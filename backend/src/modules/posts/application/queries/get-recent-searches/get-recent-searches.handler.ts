import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { RecentSearchRepository } from '../../../domain/repositories/recent-search.repository.interface'

export interface GetRecentSearchesQuery {
  userId: string
  limit?: number
}

@injectable()
export class GetRecentSearchesHandler {
  constructor(
    @inject(TYPES.RecentSearchRepository)
    private readonly recentSearchRepository: RecentSearchRepository
  ) {}

  async execute(query: GetRecentSearchesQuery) {
    return this.recentSearchRepository.findByUserId(query.userId, query.limit)
  }
}
