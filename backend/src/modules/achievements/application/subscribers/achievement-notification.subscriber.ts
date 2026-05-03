import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { EventBus } from '@/lib/events/event-bus.interface'
import { AchievementUnlockedEvent } from '../../domain/events/achievement.events'
import { NotificationService } from '@/modules/notifications/application/services/notification.service'
import { FastifyInstance } from 'fastify'

@injectable()
export class AchievementNotificationSubscriber {
  private server?: FastifyInstance

  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.NotificationService)
    private readonly notificationService: NotificationService
  ) {}

  setServer(server: FastifyInstance) {
    this.server = server
  }

  setupSubscriptions(): void {
    /* 
    Ocultamos esta suscripción porque ya la manejamos en NotificationListener 
    para centralizar todas las notificaciones de sistema.
    this.eventBus.subscribe('AchievementUnlockedEvent', (event: AchievementUnlockedEvent) =>
      this.handleAchievementUnlocked(event)
    )
    */
  }

  private async handleAchievementUnlocked(
    event: AchievementUnlockedEvent
  ): Promise<void> {
    try {
      await this.notificationService.notifyAchievement(
        event.userId,
        event.achievementName,
        event.tierAchieved,
        event.xpEarned,
        event.badgeSlug
      )

      // Emitir en tiempo real si el servidor de sockets está disponible
      if (this.server?.io) {
        this.server.io.to(`user:${event.userId}`).emit('notification', {
          type: 'ACHIEVEMENT',
          achievementName: event.achievementName,
          tierAchieved: event.tierAchieved,
          xpEarned: event.xpEarned,
          badgeSlug: event.badgeSlug,
          profileFrameSlug: event.profileFrameSlug,
          createdAt: new Date(),
        })
      }
    } catch (error) {
      console.error(
        '[AchievementNotificationSubscriber] Error handling achievement event:',
        error
      )
    }
  }
}
