import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetBookmarkedPostsQuery } from './get-bookmarked-posts.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'

@injectable()
export class GetBookmarkedPostsHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider
  ) {}

  async execute(
    query: GetBookmarkedPostsQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    try {
      return await this.postQueryProvider.getBookmarkedPosts(query)
    } catch (error) {
      console.error('Error fetching bookmarked posts:', error)
      throw PostError.unableToFetchBookmarkedPosts()
    }
  }
}
