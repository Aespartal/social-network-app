import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
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
import {
  ReplyCreatedEvent,
  UserMentionedEvent,
} from '@/lib/events/domain-events'
import type { EventBus } from '@/lib/events/event-bus.interface'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository.interface'

@injectable()
export class CreatePostCommandHandler {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus
  ) {}

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
        country: command.country,
        city: command.city,
      })

      // Extract and resolve mentions
      const mentionedUsernames = post.extractMentionedUsernames()
      if (mentionedUsernames.length > 0) {
        const mentionedUsers = await Promise.all(
          mentionedUsernames.map(u => this.userRepository.findByUsername(u))
        )
        const validUserIds = mentionedUsers
          .filter(u => u !== null)
          .map(u => u!.id)
        post.setMentions(validUserIds)
      }

      const savedPost = await this.postRepository.save(post)

      const events = []

      // Notify parent post author if it's a reply
      if (parentId) {
        const parentPost = await this.postRepository.findById(parentId)
        if (parentPost && parentPost.authorId !== authorId) {
          events.push(
            new ReplyCreatedEvent(
              savedPost.id,
              authorId,
              parentPost.authorId,
              savedPost.content
            )
          )
        }
      }

      // Notify mentioned users
      const mentions = post.mentions
      if (mentions && mentions.length > 0) {
        mentions.forEach(mentionedUserId => {
          events.push(
            new UserMentionedEvent(savedPost.id, authorId, mentionedUserId)
          )
        })
      }

      if (events.length > 0) {
        await this.eventBus.publish(events)
      }

      return PostMapper.toDTO(savedPost)
    } catch (error) {
      if (error instanceof PostError) throw error

      console.error('[CreatePostCommandHandler] Unexpected error:', error)
      throw PostError.creationFailed()
    }
  }
}
