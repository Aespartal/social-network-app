import { injectable } from 'inversify'
import { GoogleService } from '../../domain/services/google.service.interface'
import {
  GoogleUserInfo,
  GoogleUserPayload,
} from '../../domain/entities/google-user.entity'
import { AuthError } from '../../domain/errors'

@injectable()
export class HttpGoogleService implements GoogleService {
  async fetchUserInfo(token: string): Promise<GoogleUserInfo> {
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
      if (error instanceof AuthError) throw error

      console.error('[HttpGoogleService] Error:', error)
      throw AuthError.googleError('Error al conectar con Google')
    }
  }
}
