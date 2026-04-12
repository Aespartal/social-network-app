import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { EventBus } from '@/lib/events/event-bus.interface'
import {
  PostLikedEvent,
  ReplyCreatedEvent,
  UserFollowedEvent,
  UserMentionedEvent,
} from '@/lib/events/domain-events'
import { FastifyInstance } from 'fastify'
import { NotificationService } from '../../application/services/notification.service'
import { NotificationQueryProvider } from '../../application/queries/common/notification-query.provider.interface'
import { NotificationMapper } from '../../application/mappers/notification.mapper'
import { Notification } from '../../domain/entities/notification.entity'

@injectable()
export class NotificationListener {
  private server?: FastifyInstance

  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.NotificationService)
    private readonly notificationService: NotificationService,
    @inject(TYPES.NotificationQueryProvider)
    private readonly queryProvider: NotificationQueryProvider
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
  }

  private async handlePostLiked(event: PostLikedEvent) {
    const notification = await this.notificationService.notifyLike(
      event.authorId,
      event.userId,
      event.postId
    )
    if (notification && notification.id) {
      const full = await this.queryProvider.getById(notification.id)
      this.sendRealTime(
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
      this.sendRealTime(
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
      this.sendRealTime(
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
      this.sendRealTime(
        event.mentionedUserId,
        full || { type: 'MENTION', from: event.issuerId, postId: event.postId }
      )
    }
  }

  private sendRealTime(
    userId: string,
    data: Notification | Record<string, unknown>
  ) {
    if (this.server?.io) {
      const payload =
        data instanceof Notification ? NotificationMapper.toDTO(data) : data

      this.server.io.to(`user:${userId}`).emit('notification', payload)
    }
  }
}
