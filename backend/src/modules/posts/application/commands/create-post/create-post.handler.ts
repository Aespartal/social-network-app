import { Post } from '../../../domain/entities/post.entity'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import { PostError } from '../../../domain/errors'
import { PostResponseDTO } from '../../dto/post.dto'
import { PostMapper } from '../../../infrastructure/mappers/post.mapper'
import type { CreatePostCommand } from './create-post.command'

/**
 * CreatePostCommandHandler - CQRS Command Handler
 *
 * Orchestrates post creation with proper transaction management.
 * Follows Single Responsibility: only creates posts.
 *
 * Domain Events (to implement):
 * - PostCreated: When post is successfully created
 * - ReplyCreated: When creating a reply to another post
 */
export class CreatePostCommandHandler {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: CreatePostCommand): Promise<PostResponseDTO> {
    const { content, image, parentId, tags, authorId } = command

    if (parentId) {
      const parentExists = await this.postRepository.exists(parentId)
      if (!parentExists) {
        throw PostError.invalidParent(parentId)
      }
    }

    try {
      const post = Post.create({
        content,
        image,
        authorId,
        parentId,
        tags,
      })

      // Persist using atomic transaction
      // Repository handles:
      // - Creating post
      // - Upserting tags
      // - Updating parent's repliesCount (if reply)
      const savedPost = await this.postRepository.save(post)

      // TODO: Dispatch domain event
      // if (parentId) {
      //   await this.eventBus.publish(new ReplyCreatedEvent(savedPost.id, parentId, authorId))
      // } else {
      //   await this.eventBus.publish(new PostCreatedEvent(savedPost.id, authorId))
      // }

      return PostMapper.toDTO(savedPost)
    } catch (error) {
      if (error instanceof PostError) throw error

      console.error('[CreatePostCommandHandler] Unexpected error:', error)
      throw PostError.creationFailed()
    }
  }
}
