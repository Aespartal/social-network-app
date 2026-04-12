import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PrismaClient, User, Follow } from '@/generated/prisma'
import {
  UserQueryProvider,
  FollowerResponseDTO,
} from '../../application/queries/common/user-query.provider.interface'
import { UserMapper } from '../mappers/user.mapper'

@injectable()
export class PrismaUserQueryProvider implements UserQueryProvider {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async getFollowers(
    userId: string,
    currentUserId?: string
  ): Promise<FollowerResponseDTO[]> {
    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: true,
      },
    })

    const followerUsers = followers.map(
      (f: Follow & { follower: User }) => f.follower
    )

    // Check if current user follows these followers
    let followingIds: Set<string> = new Set()
    if (currentUserId) {
      const following = await this.prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followerUsers.map((u: User) => u.id) },
        },
        select: { followingId: true },
      })
      followingIds = new Set(
        following.map((f: { followingId: string }) => f.followingId)
      )
    }

    return followerUsers.map((u: User) =>
      UserMapper.toFollowerDTO(u, followingIds.has(u.id))
    )
  }

  async getFollowing(
    userId: string,
    currentUserId?: string
  ): Promise<FollowerResponseDTO[]> {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: true,
      },
    })

    const followingUsers = following.map(
      (f: Follow & { following: User }) => f.following
    )

    let followingIds: Set<string> = new Set()
    if (currentUserId) {
      const currentFollowing = await this.prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followingUsers.map((u: User) => u.id) },
        },
        select: { followingId: true },
      })
      followingIds = new Set(
        currentFollowing.map((f: { followingId: string }) => f.followingId)
      )
    }

    return followingUsers.map((u: User) =>
      UserMapper.toFollowerDTO(u, followingIds.has(u.id))
    )
  }

  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    const count = await this.prisma.follow.count({
      where: {
        followerId,
        followingId: followedId,
      },
    })
    return count > 0
  }
}
