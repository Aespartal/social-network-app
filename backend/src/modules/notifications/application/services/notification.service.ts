import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface'
import {
  Notification,
  NotificationType,
} from '../../domain/entities/notification.entity'
import { Server } from 'socket.io'
import { NotificationMapper } from '../mappers/notification.mapper'

@injectable()
export class NotificationService {
  private io?: Server

  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly repository: NotificationRepository
  ) {}

  setSocketServer(io: Server) {
    this.io = io
  }

  private async emitNotification(notification: Notification) {
    if (this.io) {
      const dto = NotificationMapper.toDTO(notification)
      this.io.to(`user:${notification.recipientId}`).emit('notification', dto)
    }
  }

  async notifyLike(recipientId: string, issuerId: string, postId: string) {
    if (recipientId === issuerId) return
    const notification = Notification.create({
      type: NotificationType.LIKE,
      recipientId,
      issuerId,
      postId,
    })
    const created = await this.repository.create(notification)
    if (created) {
      await this.emitNotification(created)
    }
    return created
  }

  async notifyReply(recipientId: string, issuerId: string, postId: string) {
    if (recipientId === issuerId) return
    const notification = Notification.create({
      type: NotificationType.REPLY,
      recipientId,
      issuerId,
      postId,
    })
    const created = await this.repository.create(notification)
    if (created) {
      await this.emitNotification(created)
    }
    return created
  }

  async notifyFollow(recipientId: string, issuerId: string) {
    if (recipientId === issuerId) return
    const notification = Notification.create({
      type: NotificationType.FOLLOW,
      recipientId,
      issuerId,
    })
    const created = await this.repository.create(notification)
    if (created) {
      await this.emitNotification(created)
    }
    return created
  }

  async notifyMention(recipientId: string, issuerId: string, postId: string) {
    if (recipientId === issuerId) return
    const notification = Notification.create({
      type: NotificationType.MENTION,
      recipientId,
      issuerId,
      postId,
    })
    const created = await this.repository.create(notification)
    if (created) {
      await this.emitNotification(created)
    }
    return created
  }

  async notifyAchievement(
    recipientId: string,
    achievementName: string,
    tier: string,
    xpEarned: number,
    badgeSlug?: string
  ) {
    const notification = Notification.create({
      type: NotificationType.ACHIEVEMENT,
      recipientId,
      issuerId: recipientId,
      postId: undefined,
      metadata: {
        achievementName,
        tier,
        xpEarned,
        badgeSlug,
      },
    })
    const created = await this.repository.create(notification)
    if (created) {
      await this.emitNotification(created)
    }
    return created
  }
}
