/**
 * DeletePostCommand - CQRS Command
 *
 * Represents the intent to soft-delete a post.
 * Includes authorization context (userId and role).
 */
export interface DeletePostCommand {
  postId: string
  userId: string
  userRole: string
}
