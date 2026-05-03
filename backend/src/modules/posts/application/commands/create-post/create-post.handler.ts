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
  PostCreatedEvent,
} from '@/lib/events/domain-events'
import type { EventBus } from '@/lib/events/event-bus.interface'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository.interface'
import { CheckAchievementHandler } from '@/modules/achievements/application/commands/check-achievement'

@injectable()
export class CreatePostCommandHandler {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.CheckAchievementHandler)
    private readonly checkAchievementHandler: CheckAchievementHandler
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
          .map(u => u.id)
        post.setMentions(validUserIds)
      }

      console.log(
        `[CreatePostCommandHandler] Creating post for user ${authorId}`
      )
      const savedPost = await this.postRepository.save(post)
      console.log(
        `[CreatePostCommandHandler] Post saved successfully: ${savedPost.id}`
      )

      const events: Array<
        PostCreatedEvent | ReplyCreatedEvent | UserMentionedEvent
      > = [new PostCreatedEvent(savedPost.id, authorId)]

      // Notify parent post author if it's a reply
      if (parentId) {
        console.log(
          `[CreatePostCommandHandler] Post is a reply to ${parentId}, fetching parent...`
        )
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
        console.log(
          `[CreatePostCommandHandler] Post has ${mentions.length} mentions`
        )
        mentions.forEach(mentionedUserId => {
          events.push(
            new UserMentionedEvent(savedPost.id, authorId, mentionedUserId)
          )
        })
      }

      if (events.length > 0) {
        console.log(
          `[CreatePostCommandHandler] Publishing ${events.length} events...`
        )
        await this.eventBus.publish(events)
      }

      // Check achievements - fire and forget (no await to not block post creation)
      console.log(`[CreatePostCommandHandler] Triggering achievement checks...`)
      this.checkAchievementsAfterPost(savedPost, authorId).catch(err => {
        console.error('[CreatePost] Error checking achievements:', err)
      })

      return PostMapper.toDTO(savedPost)
    } catch (error) {
      if (error instanceof PostError) {
        console.warn(
          `[CreatePostCommandHandler] Domain error: ${error.message} (${error.code})`
        )
        throw error
      }

      console.error(
        '[CreatePostCommandHandler] CRITICAL UNEXPECTED ERROR:',
        error
      )
      if (error instanceof Error) {
        console.error('[CreatePostCommandHandler] Stack:', error.stack)
      }
      throw PostError.creationFailed()
    }
  }

  private async checkAchievementsAfterPost(
    post: Post,
    authorId: string
  ): Promise<void> {
    // Check basic post created achievement
    await this.checkAchievementHandler.execute({
      userId: authorId,
      triggerEvent: 'post.created',
      metadata: { postId: post.id },
    })

    // Check media achievement if post has image
    if (post.image) {
      await this.checkAchievementHandler.execute({
        userId: authorId,
        triggerEvent: 'post.created_with_media',
        metadata: { postId: post.id },
      })
    }

    // Check tags achievement if post has tags
    if (post.tags && post.tags.length > 0) {
      await this.checkAchievementHandler.execute({
        userId: authorId,
        triggerEvent: 'post.created_with_tags',
        metadata: { postId: post.id, tags: post.tags },
      })
    }

    // Check night owl achievement (if post created between 00:00-05:00)
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) {
      await this.checkAchievementHandler.execute({
        userId: authorId,
        triggerEvent: 'post.created_night',
        metadata: { postId: post.id },
      })
    }

    // Check reply/comment if it's a reply to another post
    if (post.parentId) {
      await this.checkAchievementHandler.execute({
        userId: authorId,
        triggerEvent: 'comment.created',
        metadata: { postId: post.id },
      })
    }
  }
}
