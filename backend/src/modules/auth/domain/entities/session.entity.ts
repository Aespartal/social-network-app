export interface SessionEntity {
  id: string
  token: string
  userId: string
  user?: {
    id: string
    email: string
    username: string
  }
  ipAddress?: string
  userAgent?: string
  expiresAt: Date
  createdAt: Date
}

export interface CreateSessionInput {
  token: string
  userId: string
  expiresAt: Date
}
