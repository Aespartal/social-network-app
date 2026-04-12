import { AuthUser } from '../entities/auth-user.entity'
import { CreateSessionInput, SessionEntity } from '../entities/session.entity'

/**
 * AuthRepository - Domain Interface
 *
 * Handles persistence for AuthUser aggregates and sessions.
 * Follows DDD and CQRS patterns from Post module.
 */
export interface AuthRepository {
  /**
   * Persists a new or existing AuthUser aggregate
   */
  save(user: AuthUser): Promise<AuthUser>

  /**
   * Updates an existing AuthUser
   */
  update(user: AuthUser): Promise<AuthUser>

  findById(id: string): Promise<AuthUser | null>
  findByEmail(email: string): Promise<AuthUser | null>
  findByGoogleId(googleId: string): Promise<AuthUser | null>
  findByUsername(username: string): Promise<AuthUser | null>

  emailExists(email: string): Promise<boolean>
  usernameExists(username: string): Promise<boolean>

  // Security adapters (can also be split into a separate AuthService if preferred)
  verifyPassword(password: string, hash: string): Promise<boolean>

  // Session management
  createSession(input: CreateSessionInput): Promise<SessionEntity>
  findSession(token: string): Promise<SessionEntity | null>
  deleteSession(token: string): Promise<void>
  deleteAllUserSessions(userId: string): Promise<void>
  isSessionExpired(expiresAt: Date): boolean
}
