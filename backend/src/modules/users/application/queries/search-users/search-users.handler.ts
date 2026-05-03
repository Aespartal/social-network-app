import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { SearchUsersQuery, SearchUsersResult } from './search-users.query'
import { PrismaClient } from '../../../../../generated/prisma/client'

@injectable()
export class SearchUsersHandler {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async execute(query: SearchUsersQuery): Promise<SearchUsersResult> {
    const { query: searchQuery, limit = 20, currentUserId } = query

    const users = await this.prisma.user.findMany({
      where: {
        active: true,
        OR: [
          { username: { contains: searchQuery, mode: 'insensitive' } },
          { name: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        verified: true,
      },
      take: limit,
    })

    let usersWithFollowingStatus = users

    if (currentUserId) {
      const userIds = users.map((u: { id: string }) => u.id)
      const following = await this.prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: userIds },
        },
        select: { followingId: true },
      })
      const followingIds = new Set(
        following.map((f: { followingId: string }) => f.followingId)
      )

      usersWithFollowingStatus = users.map(
        (user: {
          id: string
          username: string
          name: string
          avatar: string | null
          verified: boolean
        }) => ({
          ...user,
          isFollowing: followingIds.has(user.id),
        })
      )
    }

    return { users: usersWithFollowingStatus }
  }
}
