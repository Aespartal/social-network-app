import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetPostsWithMediaQuery } from './get-posts-with-media.query'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class GetPostsWithMediaHandler {
  constructor(
    @inject(TYPES.PostQueryProvider)
    private readonly postQueryProvider: PostQueryProvider,
    @inject(TYPES.Logger)
    private readonly logger: Logger
  ) {}

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
      this.logger.error('Error fetching posts with media', { error })
      throw PostError.unableToFetchFeed()
    }
  }
}
