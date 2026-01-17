import type { PrismaClient } from '@/generated/prisma'
import type {
  PostQueryProvider,
  PagedPosts,
  FeedFilter,
  UserPostsFilter,
  TagPostsFilter,
  MediaPostsFilter,
  BookmarkedPostsFilter,
  LikedPostsFilter,
  PageRequest,
} from '../../application/queries/common/post-query.provider.interface'
import { PostMapper } from '../mappers/post.mapper'
import { PostResponseDTO } from '../../application/dto/post.dto'
import {
  AUTHOR_SELECT,
  AUTHOR_SELECT_BASIC,
  ACTIVE_POST_WHERE,
  TOP_LEVEL_POST_WHERE,
  SORT_ORDER,
  INTERACTION_TYPE,
  validatePageSize,
  getDaysAgo,
} from '../helpers/prisma-query.helpers'

/**
 * PrismaPostQueryProvider - Read Model Implementation (CQRS)
 *
 * Infrastructure implementation of the Read Model for posts.
 * This is NOT a Service - it's a specialized data provider.
 *
 * Responsibilities:
 * - Execute optimized SELECT queries using Prisma ORM
 * - Apply ReadCommitted isolation level for consistency
 * - Prevent N+1 queries with batch loading
 * - Transform Prisma models to DTOs
 * - Handle pagination with cursor-based approach
 *
 * What it does NOT do:
 * - No business logic validation
 * - No state changes (read-only)
 * - No transaction coordination (that's for Repository)
 *
 * Used exclusively by: QueryHandlers
 * Separation: CommandHandlers use PrismaPostRepository
 */
export class PrismaPostQueryProvider implements PostQueryProvider {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Gets the user's feed (posts from followed users)
   * Optimized with batch loading to prevent N+1 queries
   * If followingUserIds is empty, returns all posts (public feed)
   */
  async getFeed(filter: FeedFilter): Promise<PagedPosts> {
    const { followingUserIds, userId, page } = filter
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const posts = await this.prisma.post.findMany({
      where: {
        ...TOP_LEVEL_POST_WHERE,
        ...(followingUserIds.length > 0 && {
          authorId: { in: followingUserIds },
        }),
      },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: 'desc' },
      include: this.getBasicInclude(),
    })

    return this.buildPagedResultWithBatchContext(posts, pageSize, userId)
  }

  /**
   * Gets all posts by a specific user
   * Optimized with batch loading to prevent N+1 queries
   */
  async getPostsByUser(filter: UserPostsFilter): Promise<PagedPosts> {
    const { authorId, userId, page } = filter
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const posts = await this.prisma.post.findMany({
      where: {
        ...TOP_LEVEL_POST_WHERE,
        authorId,
      },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: SORT_ORDER.DESC },
      include: this.getBasicInclude(),
    })

    return this.buildPagedResultWithBatchContext(posts, pageSize, userId)
  }

  /**
   * Gets posts by tag name
   */
  async getPostsByTag(filter: TagPostsFilter): Promise<PagedPosts> {
    const { tagName, userId, page } = filter
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const tag = await this.prisma.tag.findUnique({
      where: { name: tagName.toLowerCase() },
    })

    if (!tag) {
      return {
        posts: [],
        meta: { hasMore: false, nextCursor: null },
      }
    }

    const posts = await this.prisma.post.findMany({
      where: {
        ...TOP_LEVEL_POST_WHERE,
        tags: { some: { tagId: tag.id } },
      },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: SORT_ORDER.DESC },
      include: this.getStandardInclude(userId),
    })

    return this.buildPagedResult(posts, pageSize, userId)
  }

  /**
   * Gets posts that have media (images)
   */
  async getPostsWithMedia(filter: MediaPostsFilter): Promise<PagedPosts> {
    const { userId, page } = filter
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const posts = await this.prisma.post.findMany({
      where: {
        ...TOP_LEVEL_POST_WHERE,
        image: { not: null },
      },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: SORT_ORDER.DESC },
      include: this.getStandardInclude(userId),
    })

    return this.buildPagedResult(posts, pageSize, userId)
  }

  /**
   * Gets posts bookmarked by a user
   */
  async getBookmarkedPosts(filter: BookmarkedPostsFilter): Promise<PagedPosts> {
    const { userId, page } = filter
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: SORT_ORDER.DESC },
      include: {
        post: {
          include: this.getStandardInclude(userId),
        },
      },
    })

    return this.buildInteractionBasedResult(
      bookmarks.map(b => b.post),
      pageSize,
      userId,
      INTERACTION_TYPE.BOOKMARK
    )
  }

  /**
   * Gets posts liked by a user
   */
  async getLikedPosts(filter: LikedPostsFilter): Promise<PagedPosts> {
    const { userId, page } = filter
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const likes = await this.prisma.like.findMany({
      where: { userId },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: SORT_ORDER.DESC },
      include: {
        post: {
          include: this.getStandardInclude(userId),
        },
      },
    })

    return this.buildInteractionBasedResult(
      likes.map(l => l.post),
      pageSize,
      userId,
      INTERACTION_TYPE.LIKE
    )
  }

  /**
   * Gets trending posts (most liked recently)
   */
  async getTrendingPosts(
    page: PageRequest,
    userId?: string
  ): Promise<PagedPosts> {
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const posts = await this.prisma.post.findMany({
      where: {
        ...TOP_LEVEL_POST_WHERE,
        createdAt: { gte: getDaysAgo(7) },
      },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: [
        { likesCount: SORT_ORDER.DESC },
        { createdAt: SORT_ORDER.DESC },
      ],
      include: this.getBasicInclude(),
    })

    return this.buildPagedResultWithBatchContext(posts, pageSize, userId)
  }

  /**
   * Gets replies for a specific post
   */
  async getReplies(
    postId: string,
    userId: string | undefined,
    page: PageRequest
  ): Promise<PagedPosts> {
    const { pageSize, prismaParams } = this.getPaginationParams(page)

    const posts = await this.prisma.post.findMany({
      where: {
        ...ACTIVE_POST_WHERE,
        parentId: postId,
      },
      take: prismaParams.take,
      cursor: prismaParams.cursor,
      skip: prismaParams.skip,
      orderBy: { createdAt: SORT_ORDER.ASC },
      include: this.getStandardInclude(userId),
    })

    return this.buildPagedResult(posts, pageSize, userId)
  }

  /**
   * Checks if a post exists (for validation in queries)
   */
  async exists(postId: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId, ...ACTIVE_POST_WHERE },
      select: { id: true },
    })
    return post !== null
  }

  /**
   * Gets a post by ID with user context
   */
  async getPostById(
    postId: string,
    userId?: string
  ): Promise<PostResponseDTO | null> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId, ...ACTIVE_POST_WHERE },
      include: this.getStandardInclude(userId),
    })

    if (!post) {
      return null
    }

    const domainPost = PostMapper.toDomain(post)

    let context: { isLiked: boolean; isBookmarked: boolean } | undefined
    if (userId) {
      const isLiked = Array.isArray(post.likes) && post.likes.length > 0
      const isBookmarked =
        Array.isArray(post.bookmarks) && post.bookmarks.length > 0
      context = { isLiked, isBookmarked }
    }

    return PostMapper.toDTO(domainPost, context)
  }

  // ========== Private Helper Methods ==========

  /**
   * Basic include without user context (for batch loading)
   */
  private getBasicInclude() {
    return {
      author: { select: AUTHOR_SELECT },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, replies: true, bookmarks: true } },
    }
  }

  /**
   * Standard include for posts with user-specific relations
   */
  private getStandardInclude(userId?: string) {
    return {
      ...this.getBasicInclude(),
      parent: {
        include: {
          author: { select: AUTHOR_SELECT_BASIC },
        },
      },
      ...(userId && {
        likes: { where: { userId }, select: { id: true } },
        bookmarks: { where: { userId }, select: { id: true } },
      }),
    }
  }

  /**
   * Builds pagination parameters for Prisma queries
   */
  private getPaginationParams(page: PageRequest) {
    const { cursor, limit } = page
    const pageSize = validatePageSize(limit)

    return {
      pageSize,
      prismaParams: {
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
      },
    }
  }

  /**
   * Builds paginated result from Prisma posts
   */
  private buildPagedResult(
    posts: any[],
    pageSize: number,
    userId?: string
  ): PagedPosts {
    const hasMore = posts.length > pageSize
    const results = hasMore ? posts.slice(0, -1) : posts

    const domainPosts = results.map(post => PostMapper.toDomain(post))

    const contextMap = userId
      ? new Map(
          results.map((post: any, index) => [
            domainPosts[index]!.id,
            {
              isLiked: Array.isArray(post.likes) && post.likes.length > 0,
              isBookmarked:
                Array.isArray(post.bookmarks) && post.bookmarks.length > 0,
            },
          ])
        )
      : undefined

    return {
      posts: PostMapper.toDTOList(domainPosts, contextMap),
      meta: {
        hasMore,
        nextCursor:
          hasMore && domainPosts.length > 0 ? domainPosts.at(-1)!.id : null,
      },
    }
  }

  /**
   * Builds paginated result with batch-loaded user context
   * Prevents N+1 queries by loading likes/bookmarks in a single query
   */
  private async buildPagedResultWithBatchContext(
    posts: any[],
    pageSize: number,
    userId?: string
  ): Promise<PagedPosts> {
    const hasMore = posts.length > pageSize
    const results = hasMore ? posts.slice(0, -1) : posts

    const domainPosts = results.map(post => PostMapper.toDomain(post))

    let contextMap:
      | Map<string, { isLiked: boolean; isBookmarked: boolean }>
      | undefined

    if (userId && domainPosts.length > 0) {
      const postIds = domainPosts.map(p => p.id)

      const [likes, bookmarks] = await Promise.all([
        this.prisma.like.findMany({
          where: { userId, postId: { in: postIds } },
          select: { postId: true },
        }),
        this.prisma.bookmark.findMany({
          where: { userId, postId: { in: postIds } },
          select: { postId: true },
        }),
      ])

      const likedPostIds = new Set(likes.map(l => l.postId))
      const bookmarkedPostIds = new Set(bookmarks.map(b => b.postId))

      contextMap = new Map(
        domainPosts.map(p => [
          p.id,
          {
            isLiked: likedPostIds.has(p.id),
            isBookmarked: bookmarkedPostIds.has(p.id),
          },
        ])
      )
    }

    return {
      posts: PostMapper.toDTOList(domainPosts, contextMap),
      meta: {
        hasMore,
        nextCursor:
          hasMore && domainPosts.length > 0 ? domainPosts.at(-1)!.id : null,
      },
    }
  }

  /**
   * Builds paginated result for interaction-based queries (likes, bookmarks)
   * Handles filtering null/deleted posts and batch loading the opposite interaction
   */
  private async buildInteractionBasedResult(
    rawPosts: any[],
    pageSize: number,
    userId: string,
    baseInteraction:
      | typeof INTERACTION_TYPE.LIKE
      | typeof INTERACTION_TYPE.BOOKMARK
  ): Promise<PagedPosts> {
    const hasMore = rawPosts.length > pageSize
    const results = hasMore ? rawPosts.slice(0, -1) : rawPosts

    const posts = results
      .filter(post => post !== null && post.deletedAt === null)
      .map(post => PostMapper.toDomain(post))

    let contextMap: Map<string, { isLiked: boolean; isBookmarked: boolean }>

    if (posts.length > 0) {
      const postIds = posts.map(p => p.id)

      const oppositeEntities =
        baseInteraction === INTERACTION_TYPE.BOOKMARK
          ? await this.prisma.like.findMany({
              where: { userId, postId: { in: postIds } },
              select: { postId: true },
            })
          : await this.prisma.bookmark.findMany({
              where: { userId, postId: { in: postIds } },
              select: { postId: true },
            })

      const oppositeIds = new Set(oppositeEntities.map(e => e.postId))

      contextMap = new Map(
        posts.map(p => [
          p.id,
          baseInteraction === INTERACTION_TYPE.BOOKMARK
            ? {
                isBookmarked: true,
                isLiked: oppositeIds.has(p.id),
              }
            : {
                isLiked: true,
                isBookmarked: oppositeIds.has(p.id),
              },
        ])
      )
    } else {
      contextMap = new Map()
    }

    return {
      posts: PostMapper.toDTOList(posts, contextMap),
      meta: {
        hasMore,
        nextCursor: hasMore && posts.length > 0 ? posts.at(-1)!.id : null,
      },
    }
  }
}
