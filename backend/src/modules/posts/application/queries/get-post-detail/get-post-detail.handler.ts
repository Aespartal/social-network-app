import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PostResponseDTO, PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetPostDetailQuery } from './get-post-detail.query'

export interface PostDetailResponseDTO {
  post: PostResponseDTO
  replies: PaginatedPostsResponseDTO
}

@injectable()
export class GetPostDetailHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider
  ) {}

  async execute(query: GetPostDetailQuery): Promise<PostDetailResponseDTO> {
    try {
      const [post, replies] = await Promise.all([
        this.postQueryProvider.getPostById(query.postId, query.userId),
        this.postQueryProvider.getReplies(
          query.postId,
          query.userId,
          query.repliesPage
        ),
      ])

      if (!post) {
        throw PostError.notFound(query.postId)
      }

      return {
        post,
        replies: {
          posts: replies.posts,
          meta: replies.meta,
        },
      }
    } catch (error) {
      if (error instanceof PostError) {
        throw error
      }
      console.error('Error fetching post detail:', error)
      throw PostError.unableToFetchPost()
    }
  }
}
