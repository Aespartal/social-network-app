import type { AuthRepository } from '../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../domain/errors'
import { config } from '@/config/env'
import { AuthResponseDTO } from '../dto'
import { AuthMapper } from '../../infrastructure/mappers/auth.mapper'
import { TokenService } from '../../infrastructure/services/token.service'

export class RefreshTokenUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(oldRefreshToken: string): Promise<AuthResponseDTO> {
    const session = await this.authRepository.findSession(oldRefreshToken)

    if (!session) {
      throw AuthError.sessionNotFound()
    }

    if (this.authRepository.isSessionExpired(session.expiresAt)) {
      await this.authRepository.deleteSession(oldRefreshToken)
      throw AuthError.tokenExpired()
    }

    const user = await this.authRepository.findById(session.userId)
    if (!user) {
      await this.authRepository.deleteSession(oldRefreshToken)
      throw AuthError.sessionNotFound()
    }

    const { accessToken, refreshToken } =
      this.tokenService.generateAuthTokens(user)
    const expiresIn = config.JWT_ACCESS_EXPIRES_IN || '15m'
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.authRepository.deleteSession(oldRefreshToken)

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
