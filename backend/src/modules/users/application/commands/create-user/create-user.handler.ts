import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserRepository } from '../../../domain/repositories/user.repository.interface'
import { UserError } from '../../../domain/errors'
import { UserResponseDTO } from '../../dto'
import { UserMapper } from '../../../infrastructure/mappers/user.mapper'
import { HashService } from '@/modules/auth/domain/services/hash.service.interface'
import { CreateUserCommand } from './create-user.command'
import { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class CreateUserHandler {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.HashService) private readonly hashService: HashService,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async execute(query: CreateUserCommand): Promise<UserResponseDTO> {
    const { email, username, name, password, avatar, bio, role } = query

    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(email),
      this.userRepository.existsByUsername(username),
    ])

    if (emailExists) throw UserError.emailTaken(email)
    if (usernameExists) throw UserError.usernameTaken(username)

    const passwordHash = await this.hashService.hash(password)

    try {
      const user = await this.userRepository.create({
        email,
        username,
        name,
        passwordHash,
        avatar: avatar || null,
        bio: bio || null,
        role: role || 'USER',
      })

      return UserMapper.toDTO(user)
    } catch (error) {
      this.logger.error('Error al crear usuario', error as Error)
      throw UserError.creationFailed()
    }
  }
}
