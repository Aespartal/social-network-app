export interface GetPostsWithMediaQuery {
  userId?: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
