import { PostError } from '../../../domain/errors'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import type { ToggleLikeCommand } from './toggle-like.command'

/**
 * ToggleLikeCommandHandler - CQRS Command Handler
 *
 * Handles like/unlike operations on posts.
 * Ensures atomicity: like record + counter must be consistent.
 *
 * Transaction scope:
 * - Create/Delete like record
 * - Increment/Decrement post.likesCount
 *
 * Domain Events (to implement):
 * - PostLiked: When user likes a post
 * - PostUnliked: When user unlikes a post
 *
 * Note: These events could trigger:
 * - Notifications to post author
 * - Activity feed updates
 * - Analytics tracking
 */
export class ToggleLikeCommandHandler {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(
    command: ToggleLikeCommand
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    const { postId, userId } = command

    const postExists = await this.postRepository.exists(postId)
    if (!postExists) {
      throw PostError.notFound(postId)
    }

    // Execute atomic toggle operation
    // Repository handles transaction:
    // - Check if like exists
    // - Create or delete like record
    // - Update likesCount accordingly
    const result = await this.postRepository.toggleLike(postId, userId)

    // TODO: Dispatch domain event
    // if (result.isLiked) {
    //   await this.eventBus.publish(new PostLikedEvent(postId, userId))
    // } else {
    //   await this.eventBus.publish(new PostUnlikedEvent(postId, userId))
    // }

    return result
  }
}
