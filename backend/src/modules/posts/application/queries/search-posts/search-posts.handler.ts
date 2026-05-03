import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PrismaClient } from '@/generated/prisma'
import {
  PostMapper,
  PrismaPost,
} from '../../../infrastructure/mappers/post.mapper'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'

export interface SearchPostsQuery {
  query: string
  limit?: number
  cursor?: string
  userId?: string // To check likes/bookmarks
}

@injectable()
export class SearchPostsQueryHandler {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async execute(
    searchQuery: SearchPostsQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { query, limit = 20, cursor, userId } = searchQuery

    const isHashtag = query.startsWith('#')
    const isMention = query.startsWith('@')
    const cleanQuery = isHashtag || isMention ? query.slice(1) : query

    if (isHashtag) {
      const posts = await this.prisma.post.findMany({
        where: {
          tags: {
            some: {
              tag: {
                name: {
                  equals: cleanQuery.toLowerCase(),
                  mode: 'insensitive',
                },
              },
            },
          },
          deletedAt: null,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          tags: { include: { tag: true } },
          likes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
          _count: { select: { replies: true } },
        },
      })

      let nextCursor: string | undefined
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem?.id
      }

      return {
        posts: (posts as PrismaPost[]).map(p => {
          const domain = PostMapper.toDomain(p)
          return PostMapper.toDTO(domain, {
            isLiked: !!p.likes?.length,
            isBookmarked: !!p.bookmarks?.length,
          })
        }),
        meta: {
          hasMore: !!nextCursor,
          nextCursor: nextCursor || null,
        },
      }
    }

    // Full Text Search using Postgres native features
    // We use websearch_to_tsquery for natural language search
    let rawPosts = (await this.prisma.$queryRaw`
      SELECT p.id
      FROM posts p
      WHERE p."search_vector" @@ websearch_to_tsquery('spanish', ${query})
        AND p."deletedAt" IS NULL
      ORDER BY ts_rank(p."search_vector", websearch_to_tsquery('spanish', ${query})) DESC, p."likesCount" DESC
      LIMIT ${limit + 1}
    `) as { id: string }[]

    // Fallback to ILIKE if FTS returns no results
    if (rawPosts.length === 0) {
      rawPosts = (await this.prisma.$queryRaw`
        SELECT p.id
        FROM posts p
        WHERE p."content" ILIKE ${`%${query}%`}
          AND p."deletedAt" IS NULL
        ORDER BY p."likesCount" DESC
        LIMIT ${limit + 1}
      `) as { id: string }[]
    }

    if (rawPosts.length === 0) {
      return {
        posts: [],
        meta: {
          hasMore: false,
          nextCursor: null,
        },
      }
    }

    const postIds = rawPosts.map(p => p.id)
    const posts = await this.prisma.post.findMany({
      where: { id: { in: postIds.slice(0, limit) } },
      include: {
        author: true,
        tags: { include: { tag: true } },
        likes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
        _count: { select: { replies: true } },
      },
    })

    // Sort back as Prisma findMany doesn't guarantee order with 'in'
    const sortedPosts = postIds
      .slice(0, limit)
      .map(id => posts.find(p => p.id === id))
      .filter(p => !!p)

    let nextCursor: string | undefined
    if (rawPosts.length > limit) {
      nextCursor = rawPosts[limit]!.id
    }

    return {
      posts: (sortedPosts as PrismaPost[]).map(p => {
        const domain = PostMapper.toDomain(p)
        return PostMapper.toDTO(domain, {
          isLiked: !!p.likes?.length,
          isBookmarked: !!p.bookmarks?.length,
        })
      }),
      meta: {
        hasMore: !!nextCursor,
        nextCursor: nextCursor || null,
      },
    }
  }
}
