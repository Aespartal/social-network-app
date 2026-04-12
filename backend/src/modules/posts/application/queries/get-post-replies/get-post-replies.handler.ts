import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetPostRepliesQuery } from './get-post-replies.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'

@injectable()
export class GetPostRepliesHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider
  ) {}

  async execute(
    query: GetPostRepliesQuery
  ): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    const exists = await this.postQueryProvider.exists(query.postId)
    if (!exists) {
      throw PostError.notFound(query.postId)
    }

    try {
      return await this.postQueryProvider.getReplies(
        query.postId,
        query.userId,
        query.page
      )
    } catch (error) {
      console.error('Error fetching replies:', error)
      throw PostError.unableToFetchReplies()
    }
  }
}
