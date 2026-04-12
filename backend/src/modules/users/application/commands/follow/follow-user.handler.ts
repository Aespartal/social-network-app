import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors/user.errors'
import { FollowUserCommand } from './follow-user.command'
import { EventBus } from '@/lib/events/event-bus.interface'
import { UserFollowedEvent } from '@/lib/events/domain-events'

@injectable()
export class FollowUserHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus
  ) {}

  async execute(command: FollowUserCommand): Promise<void> {
    const { followerId, followedId } = command

    if (followerId === followedId) {
      throw UserError.cannotFollowSelf()
    }

    const [follower, followed] = await Promise.all([
      this.userRepository.findById(followerId),
      this.userRepository.findById(followedId),
    ])

    if (!follower) throw UserError.notFound(followerId)
    if (!followed) throw UserError.notFound(followedId)

    const isAlreadyFollowing = await this.userRepository.isFollowing(
      followerId,
      followedId
    )
    if (isAlreadyFollowing) {
      throw UserError.alreadyFollowing()
    }

    follower.incrementFollowing()
    followed.incrementFollowers()

    await this.userRepository.follow(followerId, followedId)

    // Publish domain event for notifications
    await this.eventBus.publish([new UserFollowedEvent(followerId, followedId)])

    await Promise.all([
      this.userRepository.update(follower),
      this.userRepository.update(followed),
    ])
  }
}
