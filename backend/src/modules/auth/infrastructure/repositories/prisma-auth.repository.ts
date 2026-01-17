import bcrypt from 'bcryptjs'
import type { PrismaClient } from '@/generated/prisma'
import type { AuthRepository as AR } from '../../domain/repositories/auth.repository.interface'

export class PrismaAuthRepository implements AR {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<AR.AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return this.mapToAuthUser(user)
  }

  async findByGoogleId(googleId: string): Promise<AR.AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    })

    if (!user) return null

    return this.mapToAuthUser(user)
  }

  async findByUsername(username: string): Promise<AR.AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    })

    if (!user) return null

    return this.mapToAuthUser(user)
  }

  async findById(id: string): Promise<AR.AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return this.mapToAuthUser(user)
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

  async createUser(input: AR.CreateAuthUserInput): Promise<AR.AuthUser> {
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
    })

    return this.mapToAuthUser(user)
  }

  async updateUser(id: string, data: Partial<{ googleId: string }>): Promise<AR.AuthUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    })

    return this.mapToAuthUser(user)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  async createSession(input: AR.CreateSessionInput): Promise<AR.SessionEntity> {
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

  async findSession(token: string): Promise<AR.SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) return null

    const result: AR.SessionEntity = {
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }

    if (session.user) {
      result.user = this.mapToAuthUser(session.user)
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

  private mapToAuthUser(user: any): AR.AuthUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      password: user.password,
      googleId: user.googleId,
      avatar: user.avatar,
      bio: user.bio,
      verified: user.verified,
      active: user.active,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
