import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { RecentSearchRepository } from '../../../domain/repositories/recent-search.repository.interface'
import type { Logger } from '@/lib/logger/logger.interface'
import { PostError } from '@/modules/posts/domain'

export interface GetRecentSearchesQuery {
  userId: string
  limit?: number
}

@injectable()
export class GetRecentSearchesHandler {
  constructor(
    @inject(TYPES.RecentSearchRepository)
    private readonly recentSearchRepository: RecentSearchRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger
  ) {}

  async execute(query: GetRecentSearchesQuery) {
    try {
      return this.recentSearchRepository.findByUserId(query.userId, query.limit)
    } catch (error) {
      this.logger.error('Error fetching recent searches', { error })
      throw PostError.unableToFetchRecentSearches()
    }
  }
}
