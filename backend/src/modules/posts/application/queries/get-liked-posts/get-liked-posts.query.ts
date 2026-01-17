export interface GetLikedPostsQuery {
  userId: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
