export interface GetFeedQueryInput {
  followingUserIds: string[]
  userId: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
