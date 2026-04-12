import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { NotificationController } from './controllers/notification.controller'

const notificationsPlugin: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  const controller = container.get<NotificationController>(
    TYPES.NotificationController
  )

  server.get(
    '/notifications',
    { preHandler: [server.authenticate] },
    controller.getNotifications.bind(controller)
  )
  server.get(
    '/notifications/unread-count',
    { preHandler: [server.authenticate] },
    controller.getUnreadCount.bind(controller)
  )
  server.patch(
    '/notifications/mark-read',
    { preHandler: [server.authenticate] },
    controller.markAsRead.bind(controller)
  )
  server.patch(
    '/notifications/:id/mark-read',
    { preHandler: [server.authenticate] },
    controller.markAsRead.bind(controller)
  )
}

export default notificationsPlugin
