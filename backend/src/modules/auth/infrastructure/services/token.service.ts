import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { config } from '@/config/env'
import type { JWT } from '@fastify/jwt'
import { AuthUser } from '../../domain/entities/auth-user.entity'

import { Role } from '@/generated/prisma'

export interface TokenPayload {
  id: string
  email?: string
  username?: string
  role?: Role
  jti?: string
}

@injectable()
export class TokenService {
  constructor(@inject(TYPES.JWT) private readonly jwt: JWT) {}

  generateAuthTokens(user: AuthUser) {
    const accessToken = this.signToken(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role as Role,
      },
      config.JWT_ACCESS_EXPIRES_IN || '15m'
    )

    const refreshToken = this.signToken(
      {
        id: user.id,
        jti: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      },
      config.JWT_REFRESH_EXPIRES_IN || '7d'
    )

    return { accessToken, refreshToken }
  }

  private signToken(payload: TokenPayload, expiresIn: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.jwt.sign as any)(payload, { expiresIn })
  }
}
