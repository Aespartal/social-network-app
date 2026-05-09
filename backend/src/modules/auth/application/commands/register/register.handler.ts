import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { AuthUser } from '../../../domain/entities/auth-user.entity'
import type { AuthRepository } from '../../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../../domain/errors'
import { AuthResponseDTO } from '../../dto/auth-response.dto'
import { AuthMapper } from '../../../infrastructure/mappers/auth.mapper'
import { TokenService } from '../../../infrastructure/services/token.service'
import { config } from '@/config/env'
import type { HashService } from '../../../domain/services/hash.service.interface'
import type { RegisterCommand } from './register.command'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class RegisterCommandHandler {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.HashService) private readonly hashService: HashService,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async execute(command: RegisterCommand): Promise<AuthResponseDTO> {
    const { email, username, name, password, avatar, bio } = command

    const [emailExists, usernameExists] = await Promise.all([
      this.authRepository.emailExists(email),
      this.authRepository.usernameExists(username),
    ])

    if (emailExists) throw AuthError.emailAlreadyExists(email)
    if (usernameExists) throw AuthError.usernameAlreadyExists(username)

    const passwordHash = await this.hashService.hash(password)

    try {
      const user = AuthUser.create({
        email,
        username,
        name,
        passwordHash,
        avatar: avatar || null,
        bio: bio || null,
      })

      const savedUser = await this.authRepository.save(user)

      const { accessToken, refreshToken } =
        this.tokenService.generateAuthTokens(savedUser)

      const expiresIn = config.JWT_ACCESS_EXPIRES_IN || '15m'
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      await this.authRepository.createSession({
        token: refreshToken,
        userId: savedUser.id,
        expiresAt,
      })

      return AuthMapper.toResponseDTO(savedUser, {
        accessToken,
        refreshToken,
        expiresIn,
      })
    } catch (error) {
      this.logger.error('Error creating user', { error })
      throw AuthError.creationFailed()
    }
  }
}
