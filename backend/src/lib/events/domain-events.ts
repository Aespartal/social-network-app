import { DomainEvent } from '@/lib/events/event-bus.interface'

export class PostLikedEvent implements DomainEvent {
  readonly eventName = 'post.liked'
  readonly occurredOn = new Date()

  constructor(
    readonly postId: string,
    readonly userId: string, // Who liked
    readonly authorId: string // Who receives notification
  ) {}
}

export class ReplyCreatedEvent implements DomainEvent {
  readonly eventName = 'reply.created'
  readonly occurredOn = new Date()

  constructor(
    readonly postId: string,
    readonly authorId: string, // Who replied
    readonly parentAuthorId: string, // Who receives notification
    readonly content: string
  ) {}
}

export class UserFollowedEvent implements DomainEvent {
  readonly eventName = 'user.followed'
  readonly occurredOn = new Date()

  constructor(
    readonly followerId: string,
    readonly followedId: string // Who receives notification
  ) {}
}

export class UserMentionedEvent implements DomainEvent {
  readonly eventName = 'user.mentioned'
  readonly occurredOn = new Date()

  constructor(
    readonly postId: string,
    readonly issuerId: string,
    readonly mentionedUserId: string
  ) {}
}
