import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { PostError } from '../../../domain/errors'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import type { ToggleBookmarkCommand } from './toggle-bookmark.command'

import { PostBookmarkedEvent } from '@/lib/events/domain-events'
import type { EventBus } from '@/lib/events/event-bus.interface'

/**
 * ToggleBookmarkCommandHandler - CQRS Command Handler
 *
 * Handles bookmark/unbookmark operations on posts.
 * Ensures atomicity: bookmark record + counter must be consistent.
 *
 * Transaction scope:
 * - Create/Delete bookmark record
 * - Increment/Decrement post.bookmarksCount
 *
 * Domain Events (to implement):
 * - PostBookmarked: When user bookmarks a post
 * - PostUnbookmarked: When user removes bookmark
 *
 * Note: These events could trigger:
 * - User's bookmark collection update
 * - Analytics tracking
 */
@injectable()
export class ToggleBookmarkCommandHandler {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus
  ) {}

  async execute(
    command: ToggleBookmarkCommand
  ): Promise<{ isBookmarked: boolean }> {
    const { postId, userId } = command

    const postExists = await this.postRepository.exists(postId)
    if (!postExists) {
      throw PostError.notFound(postId)
    }

    // Execute atomic toggle operation
    // Repository handles transaction:
    // - Check if bookmark exists
    // - Create or delete bookmark record
    // - Update bookmarksCount accordingly
    const result = await this.postRepository.toggleBookmark(postId, userId)

    if (result.isBookmarked) {
      await this.eventBus.publish([new PostBookmarkedEvent(postId, userId)])
    }

    return result
  }
}
