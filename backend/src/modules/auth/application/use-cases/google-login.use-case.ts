import type {
  GoogleUserPayload,
  GoogleUserInfo,
} from '../../domain/entities/google-user.entity'
import type { AuthUser } from '../../domain/entities/auth-user.entity'
import type { AuthRepository } from '../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../domain/errors'
import { config } from '@/config/env'
import { AuthResponseDTO } from '../dto/auth-response.dto'
import { AuthMapper } from '../../infrastructure/mappers/auth.mapper'
import { Role } from '@/enums/role.enum'
import { TokenService } from '../../infrastructure/services/token.service'

export class GoogleLoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(googleToken: string): Promise<AuthResponseDTO> {
    const googleUser = await this.fetchGoogleUserInfo(googleToken)

    if (!googleUser || !googleUser.email) {
      throw AuthError.googleError('Datos de usuario de Google incompletos')
    }

    let user = await this.authRepository.findByGoogleId(googleUser.sub)

    if (!user) {
      user = await this.authRepository.findByEmail(googleUser.email)

      if (user && !user.googleId) {
        user = await this.authRepository.updateUser(user.id, {
          googleId: googleUser.sub,
        })
      }
    }

    user ??= await this.createNewUser(googleUser)

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

  private async fetchGoogleUserInfo(token: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw AuthError.googleError(errorText)
      }

      const payload = (await response.json()) as GoogleUserPayload

      return {
        sub: payload.sub,
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.given_name || '',
        avatar: payload.picture,
        emailVerified: payload.email_verified || false,
      }
    } catch (error) {
      console.error('Google Login Error:', error)
      throw AuthError.googleError('Error al conectar con Google')
    }
  }

  private async createNewUser(googleUser: GoogleUserInfo): Promise<AuthUser> {
    const baseUsername = (googleUser.email.split('@')[0] || 'user').replaceAll(
      /\W/g,
      ''
    )
    const uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 1000)}`

    return await this.authRepository.createUser({
      email: googleUser.email,
      username: uniqueUsername,
      name: googleUser.name || 'Google User',
      passwordHash: '',
      avatar: googleUser.avatar || null,
      bio: null,
      role: Role.USER,
      googleId: googleUser.sub,
      verified: googleUser.emailVerified,
    })
  }
}
