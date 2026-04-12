import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { NotificationListener } from './services/notification-listener'

const notificationListenerPlugin: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  const listener = container.get<NotificationListener>(
    TYPES.NotificationListener
  )

  listener.setServer(server)
  listener.setupSubscriptions()

  server.log.info('🔔 Notification Listener initialized')
}

export default notificationListenerPlugin
