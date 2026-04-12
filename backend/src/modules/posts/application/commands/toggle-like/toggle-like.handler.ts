import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
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
 * - User interest profiling
 */
import { PostLikedEvent } from '@/lib/events/domain-events'
import type { EventBus } from '@/lib/events/event-bus.interface'

@injectable()
export class ToggleLikeCommandHandler {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus
  ) {}

  async execute(
    command: ToggleLikeCommand
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    const { postId, userId } = command

    const postExists = await this.postRepository.exists(postId)
    if (!postExists) {
      throw PostError.notFound(postId)
    }

    const result = await this.postRepository.toggleLike(postId, userId)

    // Publish event if liked
    if (result.isLiked) {
      const post = await this.postRepository.findById(postId)
      if (post && post.authorId !== userId) {
        await this.eventBus.publish([
          new PostLikedEvent(postId, userId, post.authorId),
        ])
      }
    }

    return result
  }
}
