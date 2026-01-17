import type { CreateUserInput } from '../../domain/entities/user.entity'
import type { UserRepository } from '../../domain/repositories/user.repository.interface'
import { UserError } from '../../domain/errors'
import bcrypt from 'bcryptjs'
import { UserResponseDTO } from '../dto/user.dto'
import { UserMapper } from '../../infrastructure/mappers/user.mapper'

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    input: CreateUserInput & { password: string }
  ): Promise<UserResponseDTO> {
    const { email, username, name, password, avatar, bio, role } = input

    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(email),
      this.userRepository.existsByUsername(username),
    ])

    if (emailExists) {
      throw UserError.emailTaken(email)
    }

    if (usernameExists) {
      throw UserError.usernameTaken(username)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    try {
      const user = await this.userRepository.create({
        email,
        username,
        name,
        passwordHash,
        avatar,
        bio,
        role,
      })

      return UserMapper.toDTO(user)
    } catch (error) {
      console.error('Error creating user:', error)
      throw UserError.creationFailed()
    }
  }
}
