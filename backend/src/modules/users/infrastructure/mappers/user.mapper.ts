import { User as PrismaUser } from '@/generated/prisma'
import { User } from '../../domain/entities/user.entity'
import { UserResponseDTO } from '../../application/dto/user.dto'
import { FollowerResponseDTO } from '../../application/queries/common/user-query.provider.interface'

export class UserMapper {
  static toDomain(
    prismaUser: PrismaUser & {
      _count?: {
        followers: number
        following: number
        posts: number
        visitsReceived: number
      }
    }
  ): User {
    return User.reconstitute({
      id: prismaUser.id,
      username: prismaUser.username,
      name: prismaUser.name,
      avatar: prismaUser.avatar,
      bio: prismaUser.bio,
      verified: prismaUser.verified,
      active: prismaUser.active,
      followersCount: prismaUser._count?.followers ?? 0,
      followingCount: prismaUser._count?.following ?? 0,
      postsCount: prismaUser._count?.posts ?? 0,
      visitsReceived: prismaUser._count?.visitsReceived ?? 0,
      totalXP: prismaUser.totalXP,
      currentLevel: prismaUser.currentLevel,
      role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }

  static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email || undefined,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      verified: user.verified,
      active: user.active,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      _count: {
        posts: user.postsCount,
        followers: user.followersCount,
        following: user.followingCount,
        visitsReceived: user.visitsReceived,
      },
      totalXP: user.totalXP,
      currentLevel: user.currentLevel,
    }
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
