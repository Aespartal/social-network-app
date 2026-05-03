import { injectable, inject } from 'inversify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { TYPES } from '@/lib/di-types'
import { RecordVisitHandler } from '../../application/commands/record-visit/record-visit.handler'
import { GetProfileVisitsHandler } from '../../application/queries/get-profile-visits/get-profile-visits.handler'

@injectable()
export class VisitController {
  constructor(
    @inject(TYPES.RecordVisitHandler)
    private readonly recordVisitHandler: RecordVisitHandler,
    @inject(TYPES.GetProfileVisitsHandler)
    private readonly getProfileVisitsHandler: GetProfileVisitsHandler
  ) {}

  async recordVisit(
    request: FastifyRequest<{ Params: { visitedId: string } }>,
    reply: FastifyReply
  ) {
    const { visitedId } = request.params
    const visitorId = request.user!.id

    try {
      await this.recordVisitHandler.execute({ visitorId, visitedId })
      return reply.status(204).send()
    } catch (error) {
      console.error('Error recording visit:', error)
      return reply.status(500).send({
        success: false,
        error: 'Error recording visit',
      })
    }
  }

  async getProfileVisits(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.id

    try {
      const visits = await this.getProfileVisitsHandler.execute({ userId })
      return reply.send({ success: true, data: visits })
    } catch (error) {
      console.error('Error getting profile visits:', error)
      return reply.status(500).send({
        success: false,
        error: 'Error getting profile visits',
      })
    }
  }
}
