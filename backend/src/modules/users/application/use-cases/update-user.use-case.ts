import type { UpdateUserInput } from '../../domain/entities/user.entity'
import type {
  UserRepository,
  UserRepository as UR,
} from '../../domain/repositories/user.repository.interface'
import { UserError } from '../../domain/errors'
import bcrypt from 'bcryptjs'
import { UserResponseDTO } from '../dto'
import { Role } from '@/enums/role.enum'
import { UserMapper } from '../../infrastructure/mappers/user.mapper'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    input: UpdateUserInput & { password?: string },
    currentUserId: string,
    currentUserRole: string
  ): Promise<UserResponseDTO> {
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

    const updateData: UR.UpdateInput = { ...input }

    if (input.password) {
      updateData.passwordHash = await bcrypt.hash(input.password, 10)
      delete (updateData as any).password
    }

    try {
      const updatedUser = await this.userRepository.update(id, updateData)
      return UserMapper.toDTO(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error)
      throw UserError.updateFailed()
    }
  }
}
