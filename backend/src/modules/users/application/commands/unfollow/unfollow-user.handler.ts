import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors/user.errors'
import { UnfollowUserCommand } from './unfollow-user.command'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class UnfollowUserHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async execute(command: UnfollowUserCommand): Promise<void> {
    const { followerId, followedId } = command

    this.logger.info('Procesando unfollow', { followerId, followedId })

    const [follower, followed] = await Promise.all([
      this.userRepository.findById(followerId),
      this.userRepository.findById(followedId),
    ])

    if (!follower) {
      this.logger.warn('Usuario no encontrado', { userId: followerId })
      throw UserError.notFound(followerId)
    }
    if (!followed) {
      this.logger.warn('Usuario no encontrado', { userId: followedId })
      throw UserError.notFound(followedId)
    }

    const isFollowing = await this.userRepository.isFollowing(
      followerId,
      followedId
    )
    if (!isFollowing) {
      this.logger.warn('El usuario no sigue al otro usuario', {
        followerId,
        followedId,
      })
      throw UserError.notFollowing()
    }

    follower.decrementFollowing()
    followed.decrementFollowers()

    await this.userRepository.unfollow(followerId, followedId)

    await Promise.all([
      this.userRepository.save(follower),
      this.userRepository.save(followed),
    ])

    this.logger.info('Unfollow completado', { followerId, followedId })
  }
}
