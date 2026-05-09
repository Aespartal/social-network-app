import { inject, injectable } from 'inversify'
import { OAuth2Client } from 'google-auth-library'
import { GoogleService } from '../../domain/services/google.service.interface'
import { GoogleUserInfo } from '../../domain/entities/google-user.entity'
import { AuthError } from '../../domain/errors'
import { config } from '@/config/env'
import { TYPES } from '@/lib/di-types'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class HttpGoogleService implements GoogleService {
  private client: OAuth2Client

  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {
    this.client = new OAuth2Client(config.GOOGLE_CLIENT_ID)
  }

  async fetchUserInfo(token: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      if (!payload) {
        this.logger.error('Token de Google inválido', { payload })
        throw AuthError.googleError('Token de Google inválido')
      }

      return {
        sub: payload.sub,
        googleId: payload.sub,
        email: payload.email || '',
        name: payload.name || payload.given_name || '',
        avatar: payload.picture,
        emailVerified: payload.email_verified || false,
      }
    } catch (error) {
      if (error instanceof AuthError) throw error

      this.logger.error('Error verifying ID Token:', { error })

      return this.fetchFromUserInfoEndpoint(token)
    }
  }

  private async fetchFromUserInfoEndpoint(
    token: string
  ): Promise<GoogleUserInfo> {
    try {
      this.logger.warn('Falling back to userinfo endpoint (Less secure)', {
        token,
      })
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      )

      if (!response.ok) {
        this.logger.error('Error al validar token con Google', { response })
        throw AuthError.googleError('Error al validar token con Google')
      }

      const payload = (await response.json()) as any
      return {
        sub: payload.sub,
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.given_name || '',
        avatar: payload.picture,
        emailVerified: payload.email_verified || false,
      }
    } catch (_error) {
      this.logger.error('Error al conectar con Google', { error: _error })
      throw AuthError.googleError('Error al conectar con Google')
    }
  }
}
