import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PrismaClient } from '@/generated/prisma'
import { UserRepository } from '../../domain/repositories/user.repository.interface'
import { User } from '../../domain/entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'
type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

function resolveUserRole(role?: string): UserRole {
  switch (role) {
    case 'USER':
    case 'MODERATOR':
    case 'ADMIN':
      return role
    default:
      return 'USER'
  }
}

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findById(
    id: string,
    _options?: UserRepository.FindOptions
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            visitsReceived: true,
          },
        },
      },
    })

    return user ? UserMapper.toDomain(user) : null
  }

  async findByUsername(
    username: string,
    _options?: UserRepository.FindOptions
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            visitsReceived: true,
          },
        },
      },
    })

    return user ? UserMapper.toDomain(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            visitsReceived: true,
          },
        },
      },
    })

    return user ? UserMapper.toDomain(user) : null
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id } })
    return count > 0
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } })
    return count > 0
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { username } })
    return count > 0
  }

  async create(data: UserRepository.CreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        password: data.passwordHash,
        avatar: data.avatar,
        bio: data.bio,
        role: resolveUserRole(data.role),
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            visitsReceived: true,
          },
        },
      },
    })
    return UserMapper.toDomain(user)
  }

  async update(id: string, data: UserRepository.UpdateInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        password: data.passwordHash,
        avatar: data.avatar,
        bio: data.bio,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            visitsReceived: true,
          },
        },
      },
    })
    return UserMapper.toDomain(user)
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { active: false },
    })
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
    })
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

  async getSuggestedUsers(userId: string, limit: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        active: true,
        id: { not: userId },
        followers: {
          none: { followerId: userId },
        },
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            visitsReceived: true,
          },
        },
      },
      orderBy: [{ verified: 'desc' }, { followers: { _count: 'desc' } }],
      take: 20,
    })

    const shuffled = users.sort(() => 0.5 - Math.random()).slice(0, limit)

    return shuffled.map(UserMapper.toDomain)
  }
}
