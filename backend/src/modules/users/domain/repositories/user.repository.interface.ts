import { Role } from "@/enums/role.enum"

export interface UserRepository {
  create(input: UserRepository.CreateInput): Promise<UserRepository.User>
  findById(id: string, includeRelations?: UserRepository.IncludeOptions): Promise<UserRepository.User | null>
  findByEmail(email: string, includeRelations?: UserRepository.IncludeOptions): Promise<UserRepository.User | null>
  findByUsername(username: string, includeRelations?: UserRepository.IncludeOptions): Promise<UserRepository.User | null>
  findMany(options: UserRepository.FindManyOptions): Promise<UserRepository.PaginatedResult>
  update(id: string, input: UserRepository.UpdateInput): Promise<UserRepository.User>
  softDelete(id: string): Promise<void>
  existsByEmail(email: string): Promise<boolean>
  existsByUsername(username: string): Promise<boolean>
}

export namespace UserRepository {
  export interface CreateInput {
    email: string
    username: string
    name: string
    passwordHash: string
    avatar?: string | null
    bio?: string | null
    role?: string
  }

  export interface UpdateInput {
    email?: string
    username?: string
    name?: string
    passwordHash?: string
    avatar?: string | null
    bio?: string | null
    verified?: boolean
    active?: boolean
    role?: string
  }

  export interface IncludeOptions {
    counts?: boolean
    isFollowing?: boolean
    followerId?: string
  }

  export interface FindManyOptions {
    email?: string
    username?: string
    role?: string
    cursor?: string
    limit?: number
    excludeSelfId?: string
    followerId?: string
    includeRelations?: IncludeOptions
  }

  export interface UserCounts {
    followers: number
    following: number
    posts: number
    visitsReceived: number
  }

  export interface User {
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

  export interface PaginatedResult {
    users: User[]
    meta: {
      hasNext: boolean
      nextCursor: string | null
    }
  }
}
