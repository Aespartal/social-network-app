import { FastifyRequest, FastifyReply } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { GetUserAchievementsHandler } from '../../application/queries/get-user-achievements'

@injectable()
export class AchievementController {
  constructor(
    @inject(TYPES.GetUserAchievementsHandler)
    private readonly getUserAchievementsHandler: GetUserAchievementsHandler
  ) {}

  async getUserAchievements(
    request: FastifyRequest<{
      Params: { userId: string }
      Querystring: { includeHidden?: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params
      const includeHidden = request.query.includeHidden === 'true'

      const achievements = await this.getUserAchievementsHandler.execute({
        userId,
        includeHidden,
      })

      return reply.send({
        success: true,
        data: achievements,
      })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Error al obtener logros',
      })
    }
  }

  async getMyAchievements(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autorizado',
        })
      }

      const achievements = await this.getUserAchievementsHandler.execute({
        userId,
        includeHidden: false,
      })

      return reply.send({
        success: true,
        data: achievements,
      })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        success: false,
        error: 'Error al obtener tus logros',
      })
    }
  }
}
