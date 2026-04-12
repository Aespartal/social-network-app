import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { AuthRepository } from '../../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../../domain/errors'
import { AuthResponseDTO } from '../../dto/auth-response.dto'
import { AuthMapper } from '../../../infrastructure/mappers/auth.mapper'
import { TokenService } from '../../../infrastructure/services/token.service'
import { config } from '@/config/env'
import type { RefreshTokenCommand } from './refresh-token.command'
@injectable()
export class RefreshTokenCommandHandler {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthResponseDTO> {
    const { refreshToken: token } = command

    const session = await this.authRepository.findSession(token)

    if (!session) {
      throw AuthError.sessionNotFound()
    }

    if (this.authRepository.isSessionExpired(session.expiresAt)) {
      await this.authRepository.deleteSession(token)
      throw AuthError.tokenExpired()
    }

    const user = await this.authRepository.findById(session.userId)

    if (!user || !user.active) {
      throw AuthError.tokenInvalid()
    }

    // Refresh rotation: delete old session and create new one
    await this.authRepository.deleteSession(token)

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
