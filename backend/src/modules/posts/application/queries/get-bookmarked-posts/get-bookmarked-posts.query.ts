export interface GetBookmarkedPostsQuery {
  userId: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
