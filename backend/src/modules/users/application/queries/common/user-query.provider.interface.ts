export interface FollowerResponseDTO {
  id: string
  username: string
  name: string
  avatar: string | null
  verified: boolean
  isFollowing?: boolean // If the current user follows this follower
}

export interface UserQueryProvider {
  getFollowers(
    userId: string,
    currentUserId?: string
  ): Promise<FollowerResponseDTO[]>
  getFollowing(
    userId: string,
    currentUserId?: string
  ): Promise<FollowerResponseDTO[]>
  isFollowing(followerId: string, followedId: string): Promise<boolean>
}
