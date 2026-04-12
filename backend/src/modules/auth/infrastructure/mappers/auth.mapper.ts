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
    return AuthUser.reconstitute({
      id: raw.id,
      email: raw.email,
      username: raw.username,
      name: raw.name,
      password: raw.password,
      googleId: raw.googleId,
      avatar: raw.avatar,
      bio: raw.bio,
      verified: raw.verified,
      active: raw.active,
      role: raw.role,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
