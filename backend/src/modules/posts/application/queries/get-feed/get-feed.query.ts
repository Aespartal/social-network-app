export interface GetFeedQuery {
  followingUserIds: string[]
  userId: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
