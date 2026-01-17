/**
 * ToggleBookmarkCommand - CQRS Command
 *
 * Represents the intent to bookmark/unbookmark a post.
 * Idempotent operation: toggle between bookmarked and unbookmarked states.
 */
export interface ToggleBookmarkCommand {
  postId: string
  userId: string
}
