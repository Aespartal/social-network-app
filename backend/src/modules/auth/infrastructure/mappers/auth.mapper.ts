import { User as PrismaUser } from '@/generated/prisma'
import {
  AuthResponseDTO,
  AuthTokensDTO,
  AuthUserDTO,
} from '../../application/dto/auth-response.dto'
import { AuthUser } from '../../domain/entities/auth-user.entity'

export class AuthMapper {
  static toDTO(entity: AuthUser): AuthUserDTO {
    return {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      name: entity.name,
      avatar: entity.avatar ?? null,
      verified: entity.verified,
      bio: entity.bio ?? null,
      role: entity.role,
    }
  }

  static toResponseDTO(
    user: AuthUser,
    tokens?: AuthTokensDTO
  ): AuthResponseDTO {
    return {
      user: this.toDTO(user),
      tokens,
    }
  }

  static toDomain(raw: PrismaUser): AuthUser {
    if (!raw) {
      throw new Error('No se puede mapear un usuario nulo')
    }

    return AuthUser.reconstitute({
      id: raw.id,
      email: raw.email,
      username: raw.username,
      name: raw.name,
      password: raw.password ?? null,
      googleId: raw.googleId ?? null,
      avatar: raw.avatar ?? null,
      bio: raw.bio ?? null,
      verified: raw.verified ?? false,
      active: raw.active ?? true,
      role: raw.role,
      totalXP: raw.totalXP ?? 0,
      currentLevel: raw.currentLevel ?? 1,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
