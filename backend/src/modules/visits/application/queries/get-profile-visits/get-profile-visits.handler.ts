import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { VisitRepository } from '../../../domain/repositories/visit.repository.interface'
import { ProfileVisit } from '../../../domain/entities/visit.entity'
import { GetProfileVisitsQuery } from './get-profile-visits.query'

export interface VisitResponse {
  id: string
  username: string
  name: string
  avatar: string | null
}

@injectable()
export class GetProfileVisitsHandler {
  constructor(
    @inject(TYPES.VisitRepository)
    private readonly visitRepository: VisitRepository
  ) {}

  async execute(query: GetProfileVisitsQuery): Promise<VisitResponse[]> {
    const visits = await this.visitRepository.getProfileVisits(
      query.userId,
      query.limit
    )

    return visits.map((v: ProfileVisit) => ({
      id: v.visitorId,
      username: v.visitor?.username || '',
      name: v.visitor?.name || '',
      avatar: v.visitor?.avatar || null,
    }))
  }
}
