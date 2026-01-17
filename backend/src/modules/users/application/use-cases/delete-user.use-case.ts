import type { UserRepository } from '../../domain/repositories/user.repository.interface'
import { UserError } from '../../domain/errors'
import { Role } from '@/enums/role.enum'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

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
      console.error('Error deleting user:', error)
      throw UserError.deleteFailed()
    }
  }
}
