import { Role } from '@/enums/role.enum'

export interface UserCounts {
  followers: number
  following: number
  posts: number
  visitsReceived: number
}

export interface UserEntity {
  id: string
  email: string
  username: string
  name: string
  password: string
  avatar: string | null
  bio: string | null
  verified: boolean
  active: boolean
  googleId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  role: Role
  counts?: UserCounts
  isFollowing?: boolean
}

export interface CreateUserInput {
  email: string
  username: string
  name: string
  passwordHash: string
  avatar?: string | null
  bio?: string | null
  role?: Role
}

export interface UpdateUserInput {
  email?: string
  username?: string
  name?: string
  passwordHash?: string
  avatar?: string | null
  bio?: string | null
  verified?: boolean
  active?: boolean
  role?: Role
}

export interface UserFilterOptions {
  email?: string
  username?: string
  role?: Role
  cursor?: string
  limit?: number
  excludeSelfId?: string
}

export interface PaginatedUsers {
  users: UserEntity[]
  meta: {
    hasNext: boolean
    nextCursor: string | null
    total?: number
  }
}
