import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { RecentSearchRepository } from '../../../domain/repositories/recent-search.repository.interface'

export interface AddRecentSearchCommand {
  userId: string
  query: string
}

@injectable()
export class AddRecentSearchCommandHandler {
  constructor(
    @inject(TYPES.RecentSearchRepository)
    private readonly recentSearchRepository: RecentSearchRepository
  ) {}

  async execute(command: AddRecentSearchCommand) {
    if (!command.query.trim()) return
    await this.recentSearchRepository.save(command.userId, command.query.trim())
  }
}
