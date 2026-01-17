import { config } from '@/config/env'

export interface TokenPayload {
  id: string
  email?: string
  username?: string
  role?: string
}

export class TokenService {
  constructor(private readonly jwt: any) {}

  generateAuthTokens(user: any) {
    const accessToken = this.signToken(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      config.JWT_ACCESS_EXPIRES_IN || '15m'
    )

    const refreshToken = this.signToken(
      { id: user.id },
      config.JWT_REFRESH_EXPIRES_IN || '7d'
    )

    return { accessToken, refreshToken }
  }

  private signToken(payload: TokenPayload, expiresIn: string): string {
    return this.jwt.sign(payload, { expiresIn })
  }
}