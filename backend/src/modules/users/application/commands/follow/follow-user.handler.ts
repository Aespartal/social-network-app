import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors/user.errors'
import { FollowUserCommand } from './follow-user.command'
import { EventBus } from '@/lib/events/event-bus.interface'
import { UserFollowedEvent } from '@/lib/events/domain-events'
import { CheckAchievementHandler } from '@/modules/achievements/application/commands/check-achievement'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class FollowUserHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.CheckAchievementHandler)
    private readonly checkAchievementHandler: CheckAchievementHandler,
    @inject(TYPES.Logger) private readonly logger: Logger
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

    await this.eventBus.publish([new UserFollowedEvent(followerId, followedId)])

    await Promise.all([
      this.userRepository.save(follower),
      this.userRepository.save(followed),
    ])

    this.checkAchievementsAfterFollow(followerId, followedId).catch(err => {
      this.logger.error(
        'Error al verificar logros tras seguir usuario',
        { followerId, followedId },
        err
      )
    })
  }

  private async checkAchievementsAfterFollow(
    followerId: string,
    followedId: string
  ): Promise<void> {
    await this.checkAchievementHandler.execute({
      userId: followerId,
      triggerEvent: 'user.followed',
      metadata: { followedId },
    })

    await this.checkAchievementHandler.execute({
      userId: followedId,
      triggerEvent: 'user.followed',
      metadata: { followerId },
    })
  }
}
