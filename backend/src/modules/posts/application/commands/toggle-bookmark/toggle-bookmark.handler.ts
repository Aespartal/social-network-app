import { PostError } from '../../../domain/errors'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import type { ToggleBookmarkCommand } from './toggle-bookmark.command'

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
export class ToggleBookmarkCommandHandler {
  constructor(private readonly postRepository: PostRepository) {}

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

    // TODO: Dispatch domain event
    // if (result.isBookmarked) {
    //   await this.eventBus.publish(new PostBookmarkedEvent(postId, userId))
    // } else {
    //   await this.eventBus.publish(new PostUnbookmarkedEvent(postId, userId))
    // }

    return result
  }
}
