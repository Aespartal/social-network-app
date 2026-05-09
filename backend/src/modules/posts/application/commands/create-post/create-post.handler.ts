import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { Logger } from '@/lib/logger/logger.interface'
import { Post } from '../../../domain/entities/post.entity'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import { PostError } from '../../../domain/errors'
import { PostResponseDTO } from '../../dto/post.dto'
import { PostMapper } from '../../../infrastructure/mappers/post.mapper'
import type { CreatePostCommand } from './create-post.command'
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
    private readonly checkAchievementHandler: CheckAchievementHandler,
    @inject(TYPES.Logger) private readonly logger: Logger
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

      this.logger.info('Creando post para usuario', { authorId })

      const savedPost = await this.postRepository.save(post)

      this.logger.info('Post guardado exitosamente', {
        postId: savedPost.id,
        authorId,
      })

      const events: Array<
        PostCreatedEvent | ReplyCreatedEvent | UserMentionedEvent
      > = [new PostCreatedEvent(savedPost.id, authorId)]

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
        this.logger.debug('Publicando eventos de post', {
          eventsCount: events.length,
          postId: savedPost.id,
        })
        await this.eventBus.publish(events)
      }

      // Check achievements - fire and forget
      this.checkAchievementsAfterPost(savedPost, authorId).catch(err => {
        this.logger.error(
          'Error al verificar logros tras post',
          { userId: authorId, postId: savedPost.id },
          err
        )
      })

      return PostMapper.toDTO(savedPost)
    } catch (error) {
      if (error instanceof PostError) {
        this.logger.warn('Error de dominio al crear post', {
          domainError: error.message,
          code: error.code,
          authorId,
        })
        throw error
      }

      this.logger.error(
        'Error inesperado al crear post',
        { authorId },
        error as Error
      )
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
