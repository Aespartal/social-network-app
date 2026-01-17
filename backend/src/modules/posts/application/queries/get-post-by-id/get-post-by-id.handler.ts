import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PostResponseDTO } from '../../dto/post.dto'
import type { GetPostByIdQuery } from './get-post-by-id.query'

export class GetPostByIdHandler {
  constructor(private readonly postQueryProvider: PostQueryProvider) {}

  async execute(query: GetPostByIdQuery): Promise<PostResponseDTO> {
    try {
      const post = await this.postQueryProvider.getPostById(
        query.postId,
        query.userId
      )

      if (!post) {
        throw PostError.notFound(query.postId)
      }

      return post
    } catch (error) {
      if (error instanceof PostError) {
        throw error
      }
      console.error('Error fetching post:', error)
      throw PostError.unableToFetchPost()
    }
  }
}
