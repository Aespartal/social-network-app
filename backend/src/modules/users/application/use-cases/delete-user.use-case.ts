import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { UserRepository } from '../../domain/repositories/user.repository.interface'
import { UserError } from '../../domain/errors'
import { Role } from '@/enums/role.enum'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async execute(
    id: string,
    currentUserId: string,
    currentUserRole: string
  ): Promise<void> {
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

    try {
      await this.userRepository.softDelete(id)
    } catch (error) {
      this.logger.error('Error deleting user:', error as Error)
      throw UserError.deleteFailed()
    }
  }
}
