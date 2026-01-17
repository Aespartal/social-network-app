import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import { PostError } from '../../../domain/errors'
import { Role } from '@/enums/role.enum'
import type { DeletePostCommand } from './delete-post.command'

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
export class DeletePostCommandHandler {
  constructor(private readonly postRepository: PostRepository) {}

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

      // Persist deletion (atomic transaction)
      // Repository handles:
      // - Setting deletedAt timestamp
      // - Decrementing parent's repliesCount
      await this.postRepository.delete(post)

      // TODO: Dispatch domain event
      // await this.eventBus.publish(
      //   new PostDeletedEvent(postId, userId, post.parentId)
      // )
    } catch (error) {
      if (error instanceof PostError) throw error

      console.error('[DeletePostCommandHandler] Unexpected error:', error)
      throw PostError.deleteFailed()
    }
  }
}
