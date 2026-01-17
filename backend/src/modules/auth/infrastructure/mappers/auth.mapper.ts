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

  static toResponseDTO(user: AuthUser, tokens: AuthTokensDTO): AuthResponseDTO {
    return {
      user: this.toDTO(user),
      tokens,
    }
  }
}
