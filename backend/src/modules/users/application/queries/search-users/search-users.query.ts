export interface SearchUsersQuery {
  query: string
  limit?: number
  currentUserId?: string
}

export interface SearchUsersResult {
  users: Array<{
    id: string
    username: string
    name: string
    avatar: string | null
    verified: boolean
    isFollowing?: boolean
  }>
}
