import type { UserRepository } from '../../domain/repositories/user.repository.interface'
import type { PrismaClient } from '@/generated/prisma'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    input: UserRepository.CreateInput
  ): Promise<UserRepository.User> {
    const { email, username, name, passwordHash, avatar, bio, role } = input

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        name,
        password: passwordHash,
        avatar,
        bio,
        role: (role as any) || 'USER',
      },
      include: this.buildInclude({ counts: true }),
    })

    return this.mapToDomain(user)
  }

  async findById(
    id: string,
    includeRelations?: UserRepository.IncludeOptions
  ): Promise<UserRepository.User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: this.buildInclude(includeRelations),
    })

    if (!user) return null

    return this.mapToDomain(user)
  }

  async findByEmail(
    email: string,
    includeRelations?: UserRepository.IncludeOptions
  ): Promise<UserRepository.User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: this.buildInclude(includeRelations),
    })

    if (!user) return null

    return this.mapToDomain(user)
  }

  async findByUsername(
    username: string,
    includeRelations?: UserRepository.IncludeOptions
  ): Promise<UserRepository.User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: this.buildInclude(includeRelations),
    })

    if (!user) return null

    return this.mapToDomain(user)
  }

  async findMany(
    options: UserRepository.FindManyOptions
  ): Promise<UserRepository.PaginatedResult> {
    const {
      email,
      username,
      role,
      cursor,
      limit = 20,
      excludeSelfId,
      followerId,
      includeRelations,
    } = options

    const where: any = {
      deletedAt: null,
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
      ...(username && {
        username: { contains: username, mode: 'insensitive' },
      }),
      ...(role && { role }),
      ...(excludeSelfId && { id: { not: excludeSelfId } }),
    }

    const pageSize = Math.min(limit, 100)
    const users = await this.prisma.user.findMany({
      where,
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: this.buildInclude({
        ...includeRelations,
        counts: true,
        followerId,
      }),
    })

    const hasMore = users.length > pageSize
    const results = hasMore ? users.slice(0, -1) : users

    const domainUsers = results.map(user => {
      const userData = user as any
      const isFollowing =
        followerId && userData.followers
          ? userData.followers.some((f: any) => f.followerId === followerId)
          : false

      return {
        ...this.mapToDomain(user),
        isFollowing,
      }
    })

    return {
      users: domainUsers,
      meta: {
        hasNext: hasMore,
        nextCursor:
          hasMore && domainUsers.length > 0 ? domainUsers.at(-1)!.id : null,
      },
    }
  }

  async update(
    id: string,
    input: UserRepository.UpdateInput
  ): Promise<UserRepository.User> {
    const updateData: any = { ...input }

    if ((input as any).passwordHash) {
      updateData.password = (input as any).passwordHash
      delete updateData.passwordHash
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: this.buildInclude({ counts: true }),
    })

    return this.mapToDomain(user)
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { active: false },
    })
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    return user !== null
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })
    return user !== null
  }

  private buildInclude(includeRelations?: UserRepository.IncludeOptions) {
    const include: any = {}

    if (includeRelations?.counts !== false) {
      include._count = {
        select: {
          followers: true,
          following: true,
          posts: true,
          visitsReceived: true,
        },
      }
    }

    if (includeRelations?.followerId) {
      include.followers = {
        where: { followerId: includeRelations.followerId },
        select: { followerId: true },
      }
    }

    return include
  }

  private mapToDomain(user: any): UserRepository.User {
    const counts = user._count || {
      followers: 0,
      following: 0,
      posts: 0,
      visitsReceived: 0,
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      password: user.password,
      avatar: user.avatar,
      bio: user.bio,
      verified: user.verified,
      active: user.active,
      googleId: user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      role: user.role,
      counts: {
        followers: counts.followers,
        following: counts.following,
        posts: counts.posts,
        visitsReceived: counts.visitsReceived,
      },
      isFollowing: false,
    }
  }
}
