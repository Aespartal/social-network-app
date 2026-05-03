import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors/user.errors'
import { UnfollowUserCommand } from './unfollow-user.command'

@injectable()
export class UnfollowUserHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: UnfollowUserCommand): Promise<void> {
    const { followerId, followedId } = command

    const [follower, followed] = await Promise.all([
      this.userRepository.findById(followerId),
      this.userRepository.findById(followedId),
    ])

    if (!follower) throw UserError.notFound(followerId)
    if (!followed) throw UserError.notFound(followedId)

    const isFollowing = await this.userRepository.isFollowing(
      followerId,
      followedId
    )
    if (!isFollowing) {
      throw UserError.notFollowing()
    }

    follower.decrementFollowing()
    followed.decrementFollowers()

    await this.userRepository.unfollow(followerId, followedId)

    await Promise.all([
      this.userRepository.save(follower),
      this.userRepository.save(followed),
    ])
  }
}
