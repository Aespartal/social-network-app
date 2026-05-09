import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import { PostError } from '../../../domain/errors'
import { Role } from '@/enums/role.enum'
import type { DeletePostCommand } from './delete-post.command'
import type { Logger } from '@/lib/logger/logger.interface'

/**
 * DeletePostCommandHandler - CQRS Command Handler
 *
 * Handles post deletion (soft delete) with authorization.
 * Only author or staff (moderator/admin) can delete posts.
 *
 * Transaction scope:
 * - Mark post as deleted (deletedAt timestamp)
 * - Decrement parent's repliesCount (if this is a reply)
 *
 * Domain Events (to implement):
 * - PostDeleted: When post is successfully soft-deleted
 */
@injectable()
export class DeletePostCommandHandler {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { postId, userId, userRole } = command

    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw PostError.notFound(postId)
    }

    const isAuthor = post.belongsTo(userId)
    const isStaff = [Role.MODERATOR, Role.ADMIN].includes(userRole as Role)

    if (!isAuthor && !isStaff) {
      throw PostError.forbidden()
    }

    try {
      post.markAsDeleted()

      await this.postRepository.delete(post)
    } catch (error) {
      if (error instanceof PostError) throw error

      this.logger.error('Unexpected error', { error })
      throw PostError.deleteFailed()
    }
  }
}
