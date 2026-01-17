import { UserResponseDTO } from '../../application/dto/user.dto'
import { UserEntity } from '../../domain/entities/user.entity'

export class UserMapper {
  static toDTO(user: UserEntity, isOwner: boolean = false): UserResponseDTO {
    const baseDTO = {
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar || null,
      bio: user.bio || null,
      verified: user.verified ?? false,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      _count: {
        followers: user.counts?.followers ?? 0,
        following: user.counts?.following ?? 0,
        posts: user.counts?.posts ?? 0,
        visitsReceived: user.counts?.visitsReceived ?? 0, // Ahora visible para todos
      },
    }

    if (isOwner) {
      return {
        ...baseDTO,
        email: user.email,
      }
    }

    return baseDTO
  }
}
