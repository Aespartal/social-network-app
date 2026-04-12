import { PageRequest } from '../common/post-query.provider.interface'

export interface GetPostDetailQuery {
  postId: string
  userId?: string
  repliesPage: PageRequest
}
