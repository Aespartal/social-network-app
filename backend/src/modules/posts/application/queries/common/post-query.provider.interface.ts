import { PostResponseDTO } from '../../dto/post.dto'

/**
 * Query parameters for pagination (Application Layer)
 * Encapsulates pagination concerns without exposing infrastructure details
 */
export interface PageRequest {
  cursor?: string
  limit?: number
  since?: string
}

/**
 * Paginated result wrapper (Application Layer)
 * Returns DTOs since the query service handles user context mapping
 */
export interface PagedPosts {
  posts: PostResponseDTO[]
  meta: {
    hasMore: boolean
    nextCursor: string | null
  }
}

/**
 * Filter for feed queries
 */
export interface FeedFilter {
  followingUserIds: string[]
  userId: string
  page: PageRequest
}

/**
 * Filter for user posts
 */
export interface UserPostsFilter {
  authorId: string
  userId?: string
  page: PageRequest
}

/**
 * Filter for posts by tag
 */
export interface TagPostsFilter {
  tagName: string
  userId?: string
  page: PageRequest
}

/**
 * Filter for posts with media
 */
export interface MediaPostsFilter {
  userId?: string
  page: PageRequest
}

/**
 * Filter for bookmarked posts
 */
export interface BookmarkedPostsFilter {
  userId: string
  page: PageRequest
}

/**
 * Filter for liked posts
 */
export interface LikedPostsFilter {
  userId: string
  page: PageRequest
}

/**
 * PostQueryProvider - Read Model Interface (CQRS)
 *
 * Provides optimized read-only data access for post queries.
 * This is NOT a Service - it's a data provider for the Read Model.
 *
 * Responsibilities:
 * - Execute SELECT queries optimized for read scenarios
 * - Return DTOs ready for presentation
 * - Apply ReadCommitted isolation level
 * - Handle pagination and filtering
 *
 * What it does NOT do:
 * - No business logic or validations
 * - No state modifications
 * - No transaction coordination
 *
 * Used by: QueryHandlers (Read side of CQRS)
 * Separation: CommandHandlers use PostRepository (Write side)
 */
export interface PostQueryProvider {
  /**
   * Gets the user's feed (posts from followed users)
   * @param filter - Feed filter with following IDs and pagination
   * @returns Paginated posts with user-specific flags
   */
  getFeed(filter: FeedFilter): Promise<PagedPosts>

  /**
   * Gets the "Following Feed" (posts and replies from followed users)
   * Includes threading context for visual visualization
   * @param filter - Feed filter
   * @returns Paginated posts with threading metadata
   */
  getFollowingFeed(filter: FeedFilter): Promise<PagedPosts>

  /**
   * Gets all posts by a specific user
   * @param filter - User posts filter
   * @returns Paginated posts
   */
  getPostsByUser(filter: UserPostsFilter): Promise<PagedPosts>

  /**
   * Gets posts by tag name
   * @param filter - Tag filter
   * @returns Paginated posts
   */
  getPostsByTag(filter: TagPostsFilter): Promise<PagedPosts>

  /**
   * Gets posts that have media (images)
   * @param filter - Media filter
   * @returns Paginated posts
   */
  getPostsWithMedia(filter: MediaPostsFilter): Promise<PagedPosts>

  /**
   * Gets posts bookmarked by a user
   * @param filter - Bookmarked filter
   * @returns Paginated posts
   */
  getBookmarkedPosts(filter: BookmarkedPostsFilter): Promise<PagedPosts>

  /**
   * Gets posts liked by a user
   * @param filter - Liked filter
   * @returns Paginated posts
   */
  getLikedPosts(filter: LikedPostsFilter): Promise<PagedPosts>

  /**
   * Gets trending posts (most liked recently)
   * @param filter - Page request with location filters
   * @param userId - Optional user ID for flags
   * @returns Paginated trending posts
   */
  getTrendingPosts(
    filter: PageRequest & { country?: string; city?: string },
    userId?: string
  ): Promise<PagedPosts>

  /**
   * Gets replies for a specific post
   * @param postId - Parent post ID
   * @param userId - Optional user ID for flags
   * @param page - Pagination
   * @returns Paginated replies
   */
  getReplies(
    postId: string,
    userId: string | undefined,
    page: PageRequest
  ): Promise<PagedPosts>

  /**
   * Gets a post by ID with user context
   * @param postId - Post ID
   * @param userId - Optional user ID for context flags
   * @returns Post DTO or null
   */
  getPostById(postId: string, userId?: string): Promise<PostResponseDTO | null>

  /**
   * Checks if a post exists (for validation)
   * @param postId - Post ID
   * @returns true if exists, false otherwise
   */
  exists(postId: string): Promise<boolean>
}
