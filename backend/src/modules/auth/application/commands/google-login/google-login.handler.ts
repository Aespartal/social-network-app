import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { AuthUser } from '../../../domain/entities/auth-user.entity'
import type { AuthRepository } from '../../../domain/repositories/auth.repository.interface'
import { AuthError } from '../../../domain/errors'
import { AuthResponseDTO } from '../../dto/auth-response.dto'
import { AuthMapper } from '../../../infrastructure/mappers/auth.mapper'
import { TokenService } from '../../../infrastructure/services/token.service'
import { config } from '@/config/env'
import { Role } from '@/enums/role.enum'
import type { GoogleService } from '../../../domain/services/google.service.interface'
import type { ImageService } from '../../../domain/services/image.service.interface'
import type { GoogleLoginCommand } from './google-login.command'
import { GoogleUserInfo } from '@/modules/auth/domain/entities/google-user.entity'

@injectable()
export class GoogleLoginCommandHandler {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.GoogleService) private readonly googleService: GoogleService,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService,
    @inject(TYPES.ImageService) private readonly imageService: ImageService
  ) {}

  async execute(command: GoogleLoginCommand): Promise<AuthResponseDTO> {
    const { token } = command
    const googleUser = await this.googleService.fetchUserInfo(token)

    if (!googleUser || !googleUser.email) {
      throw AuthError.googleError('Datos de usuario de Google incompletos')
    }

    let user = await this.authRepository.findByGoogleId(googleUser.sub)

    if (!user) {
      user = await this.authRepository.findByEmail(googleUser.email)

      if (user && !user.googleId) {
        // Enlace de cuenta: Actualizamos el usuario existente con el googleId
        let avatarUrl = user.avatar
        if (!avatarUrl && googleUser.avatar) {
          avatarUrl = await this.imageService.uploadFromUrl(
            googleUser.avatar,
            'avatars'
          )
        }

        const userProps = {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          password: user.password,
          googleId: googleUser.sub,
          avatar: avatarUrl,
          bio: user.bio,
          verified: user.verified,
          active: user.active,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: new Date(),
        }
        user = AuthUser.reconstitute(userProps)
        user = await this.authRepository.update(user)
      }
    }

    if (!user) {
      user = await this.createNewUser(googleUser)
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

  private async createNewUser(googleUser: GoogleUserInfo): Promise<AuthUser> {
    const baseUsername = (googleUser.email.split('@')[0] || 'user').replaceAll(
      /\W/g,
      ''
    )
    const uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 1000)}`

    let avatarUrl = null
    if (googleUser.avatar) {
      avatarUrl = await this.imageService.uploadFromUrl(
        googleUser.avatar,
        'avatars'
      )
    }

    const user = AuthUser.create({
      email: googleUser.email,
      username: uniqueUsername,
      name: googleUser.name || 'Google User',
      passwordHash: null,
      avatar: avatarUrl,
      bio: null,
      role: Role.USER,
      googleId: googleUser.sub,
    })

    if (googleUser.emailVerified) {
      user.verify()
    }

    return await this.authRepository.save(user)
  }
}
