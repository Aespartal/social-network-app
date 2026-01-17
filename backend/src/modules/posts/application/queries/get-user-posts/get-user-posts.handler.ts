import type { PostQueryProvider } from '../common/post-query.provider.interface'
import { PostError } from '../../../domain/errors'
import { PaginatedPostsResponseDTO } from '../../dto/post.dto'
import type { GetUserPostsQuery } from './get-user-posts.query'
import { prisma } from '@/lib/prisma'
import { isInvalidPageLimit } from '@/modules/posts/infrastructure/helpers/prisma-query.helpers'

export class GetUserPostsHandler {
  constructor(private readonly postQueryProvider: PostQueryProvider) {}

  async execute(query: GetUserPostsQuery): Promise<PaginatedPostsResponseDTO> {
    const { username, userId, page } = query
    const { limit = 20 } = page

    if (isInvalidPageLimit(limit)) {
      throw PostError.invalidLimit()
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (!user) {
      throw PostError.notFound(`User ${username} not found`)
    }

    try {
      return await this.postQueryProvider.getPostsByUser({
        authorId: user.id,
        userId,
        page,
      })
    } catch (error) {
      console.error('Error fetching user posts:', error)
      throw PostError.unableToFetchFeed()
    }
  }
}
