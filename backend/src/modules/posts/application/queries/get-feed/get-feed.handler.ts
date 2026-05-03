import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetFeedQueryInput } from './get-feed.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'

@injectable()
export class GetFeedHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider
  ) {}

  async execute(query: GetFeedQueryInput): Promise<PaginatedPostsResponseDTO> {
    const { limit = 20 } = query.page

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    try {
      return await this.postQueryProvider.getFeed(query)
    } catch (error) {
      console.error('Error fetching feed:', error)
      throw PostError.unableToFetchFeed()
    }
  }
}
