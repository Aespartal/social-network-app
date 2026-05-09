import { injectable } from 'inversify'
import pino from 'pino'
import { OAuth2Client } from 'google-auth-library'
import { GoogleService } from '../../domain/services/google.service.interface'
import { GoogleUserInfo } from '../../domain/entities/google-user.entity'
import { AuthError } from '../../domain/errors'
import { config } from '@/config/env'

const logger = pino()

@injectable()
export class HttpGoogleService implements GoogleService {
  private client: OAuth2Client

  constructor() {
    this.client = new OAuth2Client(config.GOOGLE_CLIENT_ID)
  }

  async fetchUserInfo(token: string): Promise<GoogleUserInfo> {
    try {
      // Verificamos el ID Token (JWT)
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      if (!payload) {
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

      console.error('[HttpGoogleService] Error verifying ID Token:', error)

      // Fallback simple por si el frontend envió un access_token en lugar de id_token
      // aunque lo ideal es forzar id_token por seguridad.
      return this.fetchFromUserInfoEndpoint(token)
    }
  }

  private async fetchFromUserInfoEndpoint(
    token: string
  ): Promise<GoogleUserInfo> {
    try {
      logger.warn(
        { method: 'fetchFromUserInfoEndpoint', security: 'lower' },
        'Falling back to userinfo endpoint (Less secure)'
      )
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      )

      if (!response.ok) {
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
      throw AuthError.googleError('Error al conectar con Google')
    }
  }
}
