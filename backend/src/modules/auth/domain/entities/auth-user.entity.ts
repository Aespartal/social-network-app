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
  verified?: boolean
}

export interface UpdateAuthUserInput {
  email?: string
  username?: string
  name?: string
  passwordHash?: string
  avatar?: string | null
  bio?: string | null
  role?: string
  googleId?: string | null
}

export interface LoginInput {
  email: string
  password: string
}
