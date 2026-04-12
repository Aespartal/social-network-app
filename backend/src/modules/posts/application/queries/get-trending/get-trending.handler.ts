import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetTrendingPostsQuery } from './get-trending.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'
import { MemoryCacheService } from '@/lib/cache.service'

@injectable()
export class GetTrendingPostsHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider,
    @inject(TYPES.CacheService)
    private readonly cacheService: MemoryCacheService
  ) {}

  async execute(
    query: GetTrendingPostsQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page
    const cacheKey = `trending:${query.country || 'global'}:${query.city || 'all'}:${query.page.cursor || 'start'}:${limit}:${query.userId || 'anon'}`

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    // Try to get from cache
    const cached = this.cacheService.get<PaginatedPostsResponseDTO>(cacheKey)
    if (cached) return cached

    try {
      const result = await this.postQueryProvider.getTrendingPosts(
        {
          ...query.page,
          country: query.country,
          city: query.city,
        },
        query.userId
      )

      // Cache for 5 minutes (300 seconds)
      this.cacheService.set(cacheKey, result, 300)

      return result
    } catch (error) {
      console.error('Error fetching trending posts:', error)
      throw PostError.unableToFetchFeed()
    }
  }
}
