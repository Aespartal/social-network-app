import { User } from '../entities/user.entity'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  update(user: User): Promise<void>
  exists(id: string): Promise<boolean>

  // Follow-specific operations
  follow(followerId: string, followedId: string): Promise<void>
  unfollow(followerId: string, followedId: string): Promise<void>
  isFollowing(followerId: string, followedId: string): Promise<boolean>
}
