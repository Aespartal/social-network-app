import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { RecentSearchRepository } from '../../../domain/repositories/recent-search.repository.interface'

export interface DeleteRecentSearchCommand {
  id: string
  userId: string
}

@injectable()
export class DeleteRecentSearchHandler {
  constructor(
    @inject(TYPES.RecentSearchRepository)
    private readonly recentSearchRepository: RecentSearchRepository
  ) {}

  async execute(command: DeleteRecentSearchCommand) {
    await this.recentSearchRepository.delete(command.id, command.userId)
  }
}
