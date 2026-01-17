export interface GetPostsByTagQuery {
  tagName: string
  userId?: string
  page: {
    cursor?: string
    limit?: number
    since?: string
  }
}
