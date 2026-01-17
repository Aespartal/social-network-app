import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetTrendingPostsQuery } from './get-trending.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'

export class GetTrendingPostsHandler {
  constructor(private readonly postQueryProvider: PostQueryProvider) {}

  async execute(
    query: GetTrendingPostsQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    try {
      return await this.postQueryProvider.getTrendingPosts(
        query.page,
        query.userId
      )
    } catch (error) {
      console.error('Error fetching trending posts:', error)
      throw PostError.unableToFetchFeed()
    }
  }
}
