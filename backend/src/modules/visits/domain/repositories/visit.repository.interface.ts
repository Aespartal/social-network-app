import { ProfileVisit } from '../entities/visit.entity'

export interface VisitRepository {
  recordVisit(visitorId: string, visitedId: string): Promise<void>
  getProfileVisits(userId: string, limit?: number): Promise<ProfileVisit[]>
  countVisits(userId: string): Promise<number>
}
