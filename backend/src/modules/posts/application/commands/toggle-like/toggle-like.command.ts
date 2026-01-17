/**
 * ToggleLikeCommand - CQRS Command
 *
 * Represents the intent to like/unlike a post.
 * Idempotent operation: toggle between liked and unliked states.
 */
export interface ToggleLikeCommand {
  postId: string
  userId: string
}
