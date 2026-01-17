import type { CreateAuthUserInput } from '../../domain/entities/auth-user.entity'
import type { AuthRepository } from '../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../domain/errors'
import bcrypt from 'bcryptjs'
import { AuthResponseDTO } from '../dto/auth-response.dto'
import { AuthMapper } from '../../infrastructure/mappers/auth.mapper'
import { Role } from '@/enums/role.enum'
import { TokenService } from '../../infrastructure/services/token.service'
import { config } from '@/config/env'

export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(
    input: CreateAuthUserInput & { password: string }
  ): Promise<AuthResponseDTO> {
    const { email, username, name, password, avatar, bio } = input

    const [emailExists, usernameExists] = await Promise.all([
      this.authRepository.emailExists(email),
      this.authRepository.usernameExists(username),
    ])

    if (emailExists) throw AuthError.emailAlreadyExists(email)
    if (usernameExists) throw AuthError.usernameAlreadyExists(username)

    const passwordHash = await bcrypt.hash(password, 10)

    try {
      const user = await this.authRepository.createUser({
        email,
        username,
        name,
        passwordHash,
        avatar: avatar || null,
        bio: bio || null,
        role: Role.USER,
        verified: false,
      })

      const { accessToken, refreshToken } =
        this.tokenService.generateAuthTokens(user)
      const expiresIn = config.JWT_ACCESS_EXPIRES_IN || '15m'
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      await this.authRepository.createSession({
        token: refreshToken,
        userId: user.id,
        expiresAt,
      })

      return AuthMapper.toResponseDTO(user, {
        accessToken,
        refreshToken,
        expiresIn,
      })
    } catch (error) {
      console.error('Error creating user:', error)
      throw AuthError.creationFailed()
    }
  }
}
