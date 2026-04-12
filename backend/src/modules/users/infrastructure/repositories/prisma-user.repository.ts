import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../domain/repositories/user.repository.interface'
import { User } from '../../domain/entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    })

    return user ? UserMapper.toDomain(user) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    })

    return user ? UserMapper.toDomain(user) : null
  }

  async update(user: User): Promise<void> {
    // We update bio, name, etc. but not the counts directly here if we want to be safe.
    // However, the aggregate keeps the counts.
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
    })
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id } })
    return count > 0
  }

  async follow(followerId: string, followedId: string): Promise<void> {
    await this.prisma.follow.create({
      data: {
        followerId,
        followingId: followedId,
      },
    })
  }

  async unfollow(followerId: string, followedId: string): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: followedId,
        },
      },
    })
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
