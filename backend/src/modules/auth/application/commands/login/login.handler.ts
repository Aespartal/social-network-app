import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { AuthRepository } from '../../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../../domain/errors'
import { AuthResponseDTO } from '../../dto/auth-response.dto'
import { AuthMapper } from '../../../infrastructure/mappers/auth.mapper'
import { TokenService } from '../../../infrastructure/services/token.service'
import { config } from '@/config/env'
import type { LoginCommand } from './login.command'
@injectable()
export class LoginCommandHandler {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDTO> {
    const { email, password } = command

    const user = await this.authRepository.findByEmail(email)

    if (!user) {
      throw AuthError.invalidCredentials()
    }

    if (!user.active) {
      throw AuthError.userInactive()
    }

    const isValidPassword = await this.authRepository.verifyPassword(
      password,
      user.password!
    )

    if (!isValidPassword) {
      throw AuthError.invalidCredentials()
    }

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
  }
}
