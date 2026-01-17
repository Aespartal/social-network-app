import { Post } from '../entities/post.entity'

/**
 * PostRepository - Domain Interface (CQRS - Command Side)
 *
 * Handles write operations (Commands) for Post aggregates.
 * Follows CQRS principles:
 * - Commands only: Create, Update, Delete
 * - Works with domain entities, not DTOs
 * - No complex queries or filtering
 *
 * Read operations are handled by PostQueryProvider (Query Side).
 */
export interface PostRepository {
  /**
   * Persists a new Post aggregate
   * @param post - The Post entity to save
   * @returns The persisted Post with its generated ID
   */
  save(post: Post): Promise<Post>

  /**
   * Retrieves a Post by its unique identifier
   * Used to load aggregate before updating/deleting
   * @param id - Post ID
   * @returns The Post entity or null if not found
   */
  findById(id: string): Promise<Post | null>

  /**
   * Updates an existing Post
   * @param post - The Post entity with updated values
   * @returns The updated Post
   */
  update(post: Post): Promise<Post>

  /**
   * Removes a Post from the repository
   * Note: Actual deletion strategy (hard/soft) is an infrastructure concern
   * @param post - The Post entity to delete
   */
  delete(post: Post): Promise<void>

  /**
   * Checks if a Post exists by ID
   * Used for validation before commands
   * @param id - Post ID
   * @returns true if exists, false otherwise
   */
  exists(id: string): Promise<boolean>

  /**
   * Toggles a like on a post (Command - modifies state)
   * @param postId - Post to like/unlike
   * @param userId - User performing the action
   * @returns Updated like status and count
   */
  toggleLike(
    postId: string,
    userId: string
  ): Promise<{ isLiked: boolean; likesCount: number }>

  /**
   * Toggles a bookmark on a post (Command - modifies state)
   * @param postId - Post to bookmark/unbookmark
   * @param userId - User performing the action
   * @returns Updated bookmark status
   */
  toggleBookmark(
    postId: string,
    userId: string
  ): Promise<{ isBookmarked: boolean }>
}
