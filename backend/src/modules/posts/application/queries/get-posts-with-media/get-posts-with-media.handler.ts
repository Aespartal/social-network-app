import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetPostsWithMediaQuery } from './get-posts-with-media.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'

export class GetPostsWithMediaHandler {
  constructor(private readonly postQueryProvider: PostQueryProvider) {}

  async execute(
    query: GetPostsWithMediaQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    try {
      return await this.postQueryProvider.getPostsWithMedia(query)
    } catch (error) {
      console.error('Error fetching posts with media:', error)
      throw PostError.unableToFetchFeed()
    }
  }
}
