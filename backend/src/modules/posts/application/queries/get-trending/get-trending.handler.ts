import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetTrendingPostsQuery } from './get-trending.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'
import { MemoryCacheService } from '@/lib/cache.service'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class GetTrendingPostsHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider,
    @inject(TYPES.CacheService)
    private readonly cacheService: MemoryCacheService,
    @inject(TYPES.Logger)
    private readonly logger: Logger
  ) {}

  async execute(
    query: GetTrendingPostsQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page
    const cacheKey = `trending:${query.country || 'global'}:${query.city || 'all'}:${query.page.cursor || 'start'}:${limit}:${query.userId || 'anon'}`

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

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

      this.cacheService.set(cacheKey, result, 300)

      return result
    } catch (error) {
      this.logger.error('Error fetching trending posts', { error })
      throw PostError.unableToFetchFeed()
    }
  }
}
