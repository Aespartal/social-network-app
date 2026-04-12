import { User as PrismaUser } from '@/generated/prisma'
import { User } from '../../domain/entities/user.entity'
import { FollowerResponseDTO } from '../../application/queries/common/user-query.provider.interface'

export class UserMapper {
  static toDomain(
    prismaUser: PrismaUser & {
      _count?: { followers: number; following: number }
    }
  ): User {
    return User.reconstitute({
      id: prismaUser.id,
      username: prismaUser.username,
      name: prismaUser.name,
      avatar: prismaUser.avatar,
      bio: prismaUser.bio,
      verified: prismaUser.verified,
      followersCount: prismaUser._count?.followers ?? 0,
      followingCount: prismaUser._count?.following ?? 0,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }

  static toFollowerDTO(
    prismaUser: PrismaUser,
    isFollowing: boolean = false
  ): FollowerResponseDTO {
    return {
      id: prismaUser.id,
      username: prismaUser.username,
      name: prismaUser.name,
      avatar: prismaUser.avatar,
      verified: prismaUser.verified,
      isFollowing,
    }
  }
}
