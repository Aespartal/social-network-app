import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors'
import type { HashService } from '../../../../auth/domain/services/hash.service.interface'
import { UserResponseDTO } from '../../dto'
import { Role } from '@/enums/role.enum'
import { UserMapper } from '../../../infrastructure/mappers/user.mapper'
import { EventBus } from '@/lib/events/event-bus.interface'
import { UserProfileUpdatedEvent } from '@/lib/events/domain-events'
import { CheckAchievementHandler } from '@/modules/achievements/application/commands/check-achievement'
import { UpdateUserCommand } from './update-user.command'
import { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class UpdateUserHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.HashService) private readonly hashService: HashService,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.CheckAchievementHandler)
    private readonly checkAchievementHandler: CheckAchievementHandler,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResponseDTO> {
    const { id, input, currentUserId, currentUserRole } = command

    const user = await this.userRepository.findById(id)

    if (!user) {
      throw UserError.notFound(id)
    }

    const isOwner = user.id === currentUserId
    const isStaff = [Role.MODERATOR, Role.ADMIN].includes(
      currentUserRole as Role
    )

    if (!isOwner && !isStaff) {
      throw UserError.forbidden()
    }

    if (input.email && input.email !== user.email) {
      const emailExists = await this.userRepository.existsByEmail(input.email)
      if (emailExists) {
        throw UserError.emailTaken(input.email)
      }
    }

    if (input.username && input.username !== user.username) {
      const usernameExists = await this.userRepository.existsByUsername(
        input.username
      )
      if (usernameExists) {
        throw UserError.usernameTaken(input.username)
      }
    }

    const updateData: UserRepository.UpdateInput = { ...input }

    if (input.password) {
      updateData.passwordHash = await this.hashService.hash(input.password)
    }

    try {
      const updatedUser = await this.userRepository.update(id, updateData)

      if (input.avatar && input.avatar !== user.avatar) {
        await this.eventBus.publish([
          new UserProfileUpdatedEvent(id, 'user.profile.avatar_updated'),
        ])
        await this.checkAchievementHandler.execute({
          userId: id,
          triggerEvent: 'user.profile.avatar_updated',
        })
      }

      if (input.bio && input.bio !== user.bio) {
        await this.eventBus.publish([
          new UserProfileUpdatedEvent(id, 'user.profile.bio_updated'),
        ])
        await this.checkAchievementHandler.execute({
          userId: id,
          triggerEvent: 'user.profile.bio_updated',
        })
      }

      return UserMapper.toDTO(updatedUser)
    } catch (error) {
      this.logger.error('Error updating user:', error as Error)
      throw UserError.updateFailed()
    }
  }
}
