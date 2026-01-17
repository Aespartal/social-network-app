import { PostResponseDTO } from '../../application/dto/post.dto'
import { Post, PostAuthor } from '../../domain/entities/post.entity'

/**
 * PostMapper - Infrastructure Layer
 *
 * Maps between Domain entities and DTOs/Infrastructure models.
 * Follows the principle: Domain is pure, mappers handle the translation.
 */
export class PostMapper {
  /**
   * Converts a Domain Post entity to a Response DTO (ViewModel)
   * Includes user-specific context flags (isLiked, isBookmarked)
   *
   * @param entity - Post domain entity
   * @param userContext - Optional context for user-specific flags
   * @returns PostResponseDTO for API responses
   */
  static toDTO(
    entity: Post,
    userContext?: {
      isLiked?: boolean
      isBookmarked?: boolean
    }
  ): PostResponseDTO {
    const author = entity.author
    if (!author) {
      throw new Error(`Post ${entity.id} has no author data loaded`)
    }

    return {
      id: entity.id,
      content: entity.content,
      image: entity.image ?? undefined,
      parentId: entity.parentId ?? undefined,
      parent: entity.parent
        ? {
            id: entity.parent.id,
            content: entity.parent.content,
            author: {
              username: entity.parent.author.username,
              name: entity.parent.author.name,
              avatar: entity.parent.author.avatar,
            },
          }
        : undefined,
      tags: entity.tags.length > 0 ? entity.tags : undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      author: {
        id: author.id,
        username: author.username,
        name: author.name,
        avatar: author.avatar,
        verified: author.verified,
      },
      likesCount: entity.likesCount,
      repliesCount: entity.repliesCount,
      bookmarksCount: entity.bookmarksCount,
      isLiked: userContext?.isLiked ?? false,
      isBookmarked: userContext?.isBookmarked ?? false,
    }
  }

  /**
   * Converts a list of Post entities to DTOs
   *
   * @param entities - Array of Post entities
   * @param userContextMap - Optional map of postId -> user context
   * @returns Array of PostResponseDTOs
   */
  static toDTOList(
    entities: Post[],
    userContextMap?: Map<string, { isLiked: boolean; isBookmarked: boolean }>
  ): PostResponseDTO[] {
    return entities.map(entity => {
      const context = userContextMap?.get(entity.id)
      return this.toDTO(entity, context)
    })
  }

  /**
   * Maps Prisma post data to Domain Post entity
   * Used by repository when loading from database
   */
  static toDomain(prismaPost: any): Post {
    const author: PostAuthor | undefined = prismaPost.author
      ? {
          id: prismaPost.author.id,
          username: prismaPost.author.username,
          name: prismaPost.author.name,
          avatar: prismaPost.author.avatar,
          verified: prismaPost.author.verified ?? false,
        }
      : undefined

    const parent = prismaPost.parent
      ? {
          id: prismaPost.parent.id,
          content: prismaPost.parent.content,
          author: {
            username: prismaPost.parent.author.username,
            name: prismaPost.parent.author.name,
            avatar: prismaPost.parent.author.avatar,
          },
        }
      : undefined

    const tags = prismaPost.tags
      ? prismaPost.tags.map((t: any) => t.tag.name)
      : []

    const likesCount = prismaPost._count?.likes ?? prismaPost.likesCount ?? 0
    const repliesCount =
      prismaPost._count?.replies ?? prismaPost.repliesCount ?? 0
    const bookmarksCount =
      prismaPost._count?.bookmarks ?? prismaPost.bookmarksCount ?? 0

    return Post.reconstitute({
      id: prismaPost.id,
      content: prismaPost.content,
      image: prismaPost.image,
      authorId: prismaPost.authorId,
      author,
      parentId: prismaPost.parentId,
      parent,
      likesCount,
      repliesCount,
      bookmarksCount,
      createdAt: prismaPost.createdAt,
      updatedAt: prismaPost.updatedAt,
      deletedAt: prismaPost.deletedAt,
      tags,
    })
  }

  /**
   * Maps a list of Prisma posts to Domain entities
   */
  static toDomainList(prismaPosts: any[]): Post[] {
    return prismaPosts.map(this.toDomain)
  }
}
