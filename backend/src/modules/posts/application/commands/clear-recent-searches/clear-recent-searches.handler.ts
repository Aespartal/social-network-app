import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { RecentSearchRepository } from '../../../domain/repositories/recent-search.repository.interface'

export interface ClearRecentSearchesCommand {
  userId: string
}

@injectable()
export class ClearRecentSearchesHandler {
  constructor(
    @inject(TYPES.RecentSearchRepository)
    private readonly recentSearchRepository: RecentSearchRepository
  ) {}

  async execute(command: ClearRecentSearchesCommand) {
    await this.recentSearchRepository.clearAll(command.userId)
  }
}
