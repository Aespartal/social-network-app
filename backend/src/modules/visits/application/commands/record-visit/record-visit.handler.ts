import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { VisitRepository } from '../../../domain/repositories/visit.repository.interface'
import { RecordVisitCommand } from './record-visit.command'

@injectable()
export class RecordVisitHandler {
  constructor(
    @inject(TYPES.VisitRepository)
    private readonly visitRepository: VisitRepository
  ) {}

  async execute(command: RecordVisitCommand): Promise<void> {
    if (command.visitorId === command.visitedId) {
      return
    }

    await this.visitRepository.recordVisit(command.visitorId, command.visitedId)
  }
}
