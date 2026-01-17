/**
 * CreatePostCommand - CQRS Command
 *
 * Represents the intent to create a new post.
 * All validation rules are enforced here or in the domain entity.
 */
export interface CreatePostCommand {
  content: string
  image?: string
  authorId: string
  parentId?: string
  tags?: string[]
}
