import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { container } from '@/lib/di-container'
import { TYPES } from '@/lib/di-types'
import { AchievementNotificationSubscriber } from '../application/subscribers/achievement-notification.subscriber'

const achievementSubscriberPlugin: FastifyPluginAsync = async (
  server: FastifyInstance
) => {
  const subscriber = container.get<AchievementNotificationSubscriber>(
    TYPES.AchievementNotificationSubscriber
  )

  subscriber.setServer(server)
  subscriber.setupSubscriptions()

  server.log.info('🏆 Achievement Subscriber initialized')
}

export default achievementSubscriberPlugin
