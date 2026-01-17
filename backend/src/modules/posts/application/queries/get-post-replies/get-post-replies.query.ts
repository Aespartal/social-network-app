export interface GetPostRepliesQuery {
  postId: string
  userId?: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
