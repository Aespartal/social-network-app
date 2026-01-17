export interface GetUserPostsQuery {
  username: string
  userId?: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
