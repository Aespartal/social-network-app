import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { EventBus } from '@/lib/events/event-bus.interface'
import {
  PostLikedEvent,
  ReplyCreatedEvent,
  UserFollowedEvent,
  UserMentionedEvent,
} from '@/lib/events/domain-events'
import { AchievementUnlockedEvent } from '../../../achievements/domain/events/achievement.events'
import { FastifyInstance } from 'fastify'
import { NotificationService } from '../../application/services/notification.service'
import { NotificationQueryProvider } from '../../application/queries/common/notification-query.provider.interface'
import { NotificationMapper } from '../../application/mappers/notification.mapper'
import { Notification } from '../../domain/entities/notification.entity'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class NotificationListener {
  private server?: FastifyInstance

  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.NotificationService)
    private readonly notificationService: NotificationService,
    @inject(TYPES.NotificationQueryProvider)
    private readonly queryProvider: NotificationQueryProvider,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  setServer(server: FastifyInstance) {
    this.server = server
  }

  setupSubscriptions() {
    this.eventBus.subscribe('post.liked', (event: PostLikedEvent) =>
      this.handlePostLiked(event)
    )
    this.eventBus.subscribe('reply.created', (event: ReplyCreatedEvent) =>
      this.handleReplyCreated(event)
    )
    this.eventBus.subscribe('user.followed', (event: UserFollowedEvent) =>
      this.handleUserFollowed(event)
    )
    this.eventBus.subscribe('user.mentioned', (event: UserMentionedEvent) =>
      this.handleUserMentioned(event)
    )
    this.eventBus.subscribe(
      'AchievementUnlockedEvent',
      (event: AchievementUnlockedEvent) => this.handleAchievementUnlocked(event)
    )
  }

  private async handleAchievementUnlocked(event: AchievementUnlockedEvent) {
    this.logger.info(
      `Achievement unlocked for user ${event.userId}: ${event.achievementName}`
    )
    const notification = await this.notificationService.notifyAchievement(
      event.userId,
      event.achievementName,
      event.tierAchieved,
      event.xpEarned,
      event.badgeSlug
    )

    if (notification && notification.id) {
      const full = await this.queryProvider.getById(notification.id)
      await this.sendRealTime(event.userId, full || notification)
    }
  }

  private async handlePostLiked(event: PostLikedEvent) {
    const notification = await this.notificationService.notifyLike(
      event.authorId,
      event.userId,
      event.postId
    )
    if (notification && notification.id) {
      const full = await this.queryProvider.getById(notification.id)
      await this.sendRealTime(
        event.authorId,
        full || { type: 'LIKE', from: event.userId, postId: event.postId }
      )
    }
  }

  private async handleReplyCreated(event: ReplyCreatedEvent) {
    const notification = await this.notificationService.notifyReply(
      event.parentAuthorId,
      event.authorId,
      event.postId
    )
    if (notification && notification.id) {
      const full = await this.queryProvider.getById(notification.id)
      await this.sendRealTime(
        event.parentAuthorId,
        full || { type: 'REPLY', from: event.authorId, postId: event.postId }
      )
    }
  }

  private async handleUserFollowed(event: UserFollowedEvent) {
    const notification = await this.notificationService.notifyFollow(
      event.followedId,
      event.followerId
    )
    if (notification && notification.id) {
      const full = await this.queryProvider.getById(notification.id)
      await this.sendRealTime(
        event.followedId,
        full || { type: 'FOLLOW', from: event.followerId }
      )
    }
  }

  private async handleUserMentioned(event: UserMentionedEvent) {
    const notification = await this.notificationService.notifyMention(
      event.mentionedUserId,
      event.issuerId,
      event.postId
    )
    if (notification && notification.id) {
      const full = await this.queryProvider.getById(notification.id)
      await this.sendRealTime(
        event.mentionedUserId,
        full || { type: 'MENTION', from: event.issuerId, postId: event.postId }
      )
    }
  }

  private async sendRealTime(
    userId: string,
    data: Notification | Record<string, unknown>
  ) {
    const cleanUserId = userId.trim()

    let attempts = 0
    while (!this.server?.io && attempts < 3) {
      this.logger.info(
        `Socket not ready, retrying in 500ms (attempt ${attempts + 1})`
      )
      await new Promise(resolve => setTimeout(resolve, 500))
      attempts++
    }

    if (this.server?.io) {
      const payload =
        data instanceof Notification ? NotificationMapper.toDTO(data) : data

      this.logger.info(
        `Sending notification type ${payload.type} to room 'user:${cleanUserId}'`
      )

      this.server.io.to(`user:${cleanUserId}`).emit('notification', payload)
    } else {
      this.logger.error(`Socket not ready after multiple attempts.`)
    }
  }
}
