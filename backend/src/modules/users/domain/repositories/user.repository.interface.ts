import { User } from '../entities/user.entity'

export interface UserRepository {
  findById(
    id: string,
    options?: UserRepository.FindOptions
  ): Promise<User | null>
  findByUsername(
    username: string,
    options?: UserRepository.FindOptions
  ): Promise<User | null>
  findByEmail(
    email: string,
    options?: UserRepository.FindOptions
  ): Promise<User | null>
  exists(id: string): Promise<boolean>
  existsByEmail(email: string): Promise<boolean>
  existsByUsername(username: string): Promise<boolean>

  create(data: UserRepository.CreateInput): Promise<User>
  update(id: string, data: UserRepository.UpdateInput): Promise<User>
  softDelete(id: string): Promise<void>
  // Mantener por compatibilidad si es necesario, pero preferir la firma con ID
  save(user: User): Promise<void>

  // Follow-specific operations
  follow(followerId: string, followedId: string): Promise<void>
  unfollow(followerId: string, followedId: string): Promise<void>
  isFollowing(followerId: string, followedId: string): Promise<boolean>
  getSuggestedUsers(userId: string, limit: number): Promise<User[]>
}

export namespace UserRepository {
  export interface FindOptions {
    includeFollowers?: boolean
    includeFollowing?: boolean
  }

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
  }
}
