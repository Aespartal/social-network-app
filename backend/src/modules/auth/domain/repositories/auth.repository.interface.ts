import {
  AuthUser,
  CreateAuthUserInput,
  UpdateAuthUserInput,
} from '../entities/auth-user.entity'
import { CreateSessionInput, SessionEntity } from '../entities/session.entity'

export interface AuthRepository {
  findById(id: string): Promise<AuthUser | null>
  findByEmail(email: string): Promise<AuthUser | null>
  findByGoogleId(googleId: string): Promise<AuthUser | null>
  findByUsername(username: string): Promise<AuthUser | null>
  emailExists(email: string): Promise<boolean>
  usernameExists(username: string): Promise<boolean>
  createUser(input: CreateAuthUserInput): Promise<AuthUser>
  updateUser(
    id: string,
    updates: Partial<UpdateAuthUserInput>
  ): Promise<AuthUser>
  verifyPassword(password: string, hash: string): Promise<boolean>
  createSession(input: CreateSessionInput): Promise<SessionEntity>
  findSession(token: string): Promise<SessionEntity | null>
  deleteSession(token: string): Promise<void>
  deleteAllUserSessions(userId: string): Promise<void>
  isSessionExpired(expiresAt: Date): boolean
}
