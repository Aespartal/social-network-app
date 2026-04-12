export interface GetTrendingPostsQuery {
  userId?: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
  country?: string
  city?: string
}
