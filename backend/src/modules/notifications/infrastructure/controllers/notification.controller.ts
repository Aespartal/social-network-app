import { FastifyReply, FastifyRequest } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { GetNotificationsHandler } from '../../application/queries/get-notifications/get-notifications.handler'
import { MarkAsReadHandler } from '../../application/commands/mark-as-read/mark-as-read.handler'
import { NotificationQueryProvider } from '../../application/queries/common/notification-query.provider.interface'
import { NotificationMapper } from '../../application/mappers/notification.mapper'

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.GetNotificationsHandler)
    private readonly getNotificationsHandler: GetNotificationsHandler,
    @inject(TYPES.MarkAsReadHandler)
    private readonly markAsReadHandler: MarkAsReadHandler,
    @inject(TYPES.NotificationQueryProvider)
    private readonly queryProvider: NotificationQueryProvider
  ) {}

  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id
    if (!userId) return reply.status(401).send({ error: 'Unauthorized' })

    const count = await this.queryProvider.getUnreadCount(userId)
    return reply.send({ success: true, data: count })
  }

  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id
    if (!userId) return reply.status(401).send({ error: 'Unauthorized' })

    const { limit, cursor } = request.query as {
      limit?: string
      cursor?: string
    }

    const result = await this.getNotificationsHandler.execute({
      userId,
      limit: limit ? parseInt(limit) : 20,
      cursor,
    })

    return reply.send({
      success: true,
      data: {
        ...result,
        notifications: NotificationMapper.toDTOs(result.notifications),
      },
    })
  }

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id
    if (!userId) return reply.status(401).send({ error: 'Unauthorized' })

    const { id } = request.params as { id: string }
    const { all } = request.query as { all?: string }

    await this.markAsReadHandler.execute({
      notificationId: id,
      userId,
      all: all === 'true',
    })

    return reply.send({ success: true })
  }
}
