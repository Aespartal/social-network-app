import { AuthUser, CreateAuthUserInput, UpdateAuthUserInput } from "../entities/auth-user.entity"
import { CreateSessionInput, SessionEntity } from "../entities/session.entity"

export interface AuthRepository {
  findById(id: string): Promise<AuthUser | null>
  findByEmail(email: string): Promise<AuthUser | null>
  findByGoogleId(googleId: string): Promise<AuthUser | null>
  findByUsername(username: string): Promise<AuthUser | null>
  emailExists(email: string): Promise<boolean>
  usernameExists(username: string): Promise<boolean>
  createUser(input: CreateAuthUserInput): Promise<AuthUser>
  updateUser(id: string, updates: Partial<UpdateAuthUserInput>): Promise<AuthUser>
  verifyPassword(password: string, hash: string): Promise<boolean>
  createSession(input: CreateSessionInput): Promise<SessionEntity>
  findSession(token: string): Promise<SessionEntity | null>
  deleteSession(token: string): Promise<void>
  deleteAllUserSessions(userId: string): Promise<void>
  isSessionExpired(expiresAt: Date): boolean
}

export namespace AuthRepository {
  export interface AuthUser {
    id: string
    email: string
    username: string
    name: string
    password: string | null
    googleId: string | null
    avatar: string | null
    bio: string | null
    verified: boolean
    active: boolean
    role: string
    createdAt: Date
    updatedAt: Date
  }

  export interface CreateAuthUserInput {
    email: string
    username: string
    name: string
    passwordHash: string
    avatar?: string | null
    bio?: string | null
    role?: string
    googleId?: string | null
  }

  export interface SessionEntity {
    id: string
    token: string
    userId: string
    user?: AuthUser
    userAgent?: string
    ipAddress?: string
    expiresAt: Date
    createdAt: Date
  }

  export interface CreateSessionInput {
    token: string
    userId: string
    expiresAt: Date
  }
}
