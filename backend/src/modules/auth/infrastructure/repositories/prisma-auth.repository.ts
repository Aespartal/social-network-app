import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PrismaClient, Role as PrismaRole } from '@/generated/prisma'
import type { AuthRepository } from '../../domain/repositories/auth.repository.interface'
import { AuthUser } from '../../domain/entities/auth-user.entity'
import {
  CreateSessionInput,
  SessionEntity,
} from '../../domain/entities/session.entity'
import { AuthMapper } from '../mappers/auth.mapper'
import bcrypt from 'bcryptjs'

@injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return AuthMapper.toDomain(user)
  }

  async findByGoogleId(googleId: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    })

    if (!user) return null

    return AuthMapper.toDomain(user)
  }

  async findByUsername(username: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    })

    if (!user) return null

    return AuthMapper.toDomain(user)
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return AuthMapper.toDomain(user)
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    return user !== null
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })
    return user !== null
  }

  async save(user: AuthUser): Promise<AuthUser> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        name: user.name,
        password: user.password,
        googleId: user.googleId,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role as PrismaRole,
        verified: user.verified,
        active: user.active,
      },
    })

    return AuthMapper.toDomain(prismaUser)
  }

  async update(user: AuthUser): Promise<AuthUser> {
    const prismaUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        username: user.username,
        name: user.name,
        password: user.password,
        googleId: user.googleId,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role as PrismaRole,
        verified: user.verified,
        active: user.active,
        updatedAt: user.updatedAt,
      },
    })

    return AuthMapper.toDomain(prismaUser)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  async createSession(input: CreateSessionInput): Promise<SessionEntity> {
    const { token, userId, expiresAt } = input

    const session = await this.prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    })

    return {
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }
  }

  async findSession(token: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) return null

    const result: SessionEntity = {
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }

    if (session.user) {
      result.user = AuthMapper.toDomain(session.user)
    }

    return result
  }

  async deleteSession(token: string): Promise<void> {
    await this.prisma.session.delete({
      where: { token },
    })
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    })
  }

  isSessionExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt
  }
}
