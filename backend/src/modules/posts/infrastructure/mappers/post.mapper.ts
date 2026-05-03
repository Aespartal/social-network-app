import { PostResponseDTO } from '../../application/dto/post.dto'
import { Post, PostAuthor } from '../../domain/entities/post.entity'

/**
 * Interface to represent the shape of a Post coming from Prisma
 * including the fields added by our various 'include' configurations.
 */
export interface PrismaPost {
  id: string
  content: string
  image: string | null
  authorId: string
  author?: {
    id: string
    username?: string
    name?: string
    avatar?: string | null
    verified?: boolean
  }
  parentId?: string | null
  parent?: {
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      username: string
      name: string
      avatar: string | null
    }
  } | null
  tags?: Array<{
    tag: {
      name: string
    }
  }>
  _count?: {
    likes?: number
    replies?: number
    bookmarks?: number
  }
  likesCount?: number
  repliesCount?: number
  bookmarksCount?: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  country: string | null
  city: string | null
  readingTime: number
  // Fields for user context (from some queries)
  likes?: Array<{ id: string }>
  bookmarks?: Array<{ id: string }>
}

/**
 * PostMapper - Infrastructure Layer
 *
 * Maps between Domain entities and DTOs/Infrastructure models.
 * Follows the principle: Domain is pure, mappers handle the translation.
 */
export class PostMapper {
  /**
   * Converts a Domain Post entity to a Response DTO (ViewModel)
   * Includes user-specific context flags (isLiked, isBookmarked)
   *
   * @param entity - Post domain entity
   * @param userContext - Optional context for user-specific flags
   * @returns PostResponseDTO for API responses
   */
  static toDTO(
    entity: Post,
    userContext?: {
      isLiked?: boolean
      isBookmarked?: boolean
    }
  ): PostResponseDTO {
    const author = entity.author
    if (!author) {
      throw new Error(`Post ${entity.id} has no author data loaded`)
    }

    return {
      id: entity.id,
      content: entity.content,
      image: entity.image ?? undefined,
      authorId: entity.authorId,
      parentId: entity.parentId ?? undefined,
      parent: entity.parent
        ? {
            id: entity.parent.id,
            content: entity.parent.content,
            createdAt: entity.parent.createdAt.toISOString(),
            author: {
              username: entity.parent.author.username,
              name: entity.parent.author.name,
              avatar: entity.parent.author.avatar,
            },
          }
        : undefined,
      tags: entity.tags.length > 0 ? entity.tags : undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      author: {
        id: author.id,
        username: author.username,
        name: author.name,
        avatar: author.avatar,
        verified: author.verified,
      },
      likesCount: entity.likesCount,
      repliesCount: entity.repliesCount,
      bookmarksCount: entity.bookmarksCount,
      isLiked: userContext?.isLiked ?? false,
      isBookmarked: userContext?.isBookmarked ?? false,
      isAuthorReply:
        entity.parentId && entity.parent
          ? entity.authorId === entity.parent.author.id ||
            author.username === entity.parent.author.username
          : false,
      country: entity.country ?? undefined,
      city: entity.city ?? undefined,
      readingTime: entity.readingTime,
    }
  }

  /**
   * Converts a list of Post entities to DTOs
   *
   * @param entities - Array of Post entities
   * @param userContextMap - Optional map of postId -> user context
   * @returns Array of PostResponseDTOs
   */
  static toDTOList(
    entities: Post[],
    userContextMap?: Map<string, { isLiked: boolean; isBookmarked: boolean }>
  ): PostResponseDTO[] {
    return entities.map(entity => {
      const context = userContextMap?.get(entity.id)
      return this.toDTO(entity, context)
    })
  }

  /**
   * Maps Prisma post data to Domain Post entity
   * Used by repository when loading from database
   */
  static toDomain(prismaPost: PrismaPost): Post {
    const author: PostAuthor | undefined = prismaPost.author
      ? {
          id: prismaPost.author.id,
          username: prismaPost.author.username ?? '',
          name: prismaPost.author.name ?? '',
          avatar: prismaPost.author.avatar ?? null,
          verified: prismaPost.author.verified ?? false,
        }
      : undefined

    const parent = prismaPost.parent
      ? {
          id: prismaPost.parent.id,
          content: prismaPost.parent.content,
          createdAt: prismaPost.parent.createdAt,
          author: {
            id: prismaPost.parent.author.id,
            username: prismaPost.parent.author.username,
            name: prismaPost.parent.author.name,
            avatar: prismaPost.parent.author.avatar,
          },
        }
      : undefined

    const tags = prismaPost.tags ? prismaPost.tags.map(t => t.tag.name) : []

    const likesCount = prismaPost._count?.likes ?? prismaPost.likesCount ?? 0
    const repliesCount =
      prismaPost._count?.replies ?? prismaPost.repliesCount ?? 0
    const bookmarksCount =
      prismaPost._count?.bookmarks ?? prismaPost.bookmarksCount ?? 0

    return Post.reconstitute({
      id: prismaPost.id,
      content: prismaPost.content,
      image: prismaPost.image,
      authorId: prismaPost.authorId,
      author,
      parentId: prismaPost.parentId ?? null,
      parent,
      likesCount,
      repliesCount,
      bookmarksCount,
      createdAt: prismaPost.createdAt,
      updatedAt: prismaPost.updatedAt,
      deletedAt: prismaPost.deletedAt,
      tags,
      country: prismaPost.country,
      city: prismaPost.city,
      readingTime: prismaPost.readingTime ?? 1,
    })
  }

  /**
   * Maps a list of Prisma posts to Domain entities
   */
  static toDomainList(prismaPosts: PrismaPost[]): Post[] {
    return prismaPosts.map(post => this.toDomain(post))
  }
}
