/**
 * UpdatePostCommand - CQRS Command
 *
 * Represents the intent to update an existing post.
 * Includes authorization context (userId and role).
 */
export interface UpdatePostCommand {
  postId: string
  content: string
  image?: string | null
  userId: string
  userRole: string
}
