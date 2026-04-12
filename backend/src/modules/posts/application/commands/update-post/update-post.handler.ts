import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { PostRepository } from '../../../domain/repositories/post.repository.interface'
import { PostError } from '../../../domain/errors'
import { PostResponseDTO } from '../../dto/post.dto'
import { PostMapper } from '../../../infrastructure/mappers/post.mapper'
import { Role } from '@/enums/role.enum'
import type { UpdatePostCommand } from './update-post.command'

/**
 * UpdatePostCommandHandler - CQRS Command Handler
 *
 * Handles post updates with authorization checks.
 * Only author or staff (moderator/admin) can update posts.
 *
 * Domain Events (to implement):
 * - PostUpdated: When post content is successfully modified
 */
@injectable()
export class UpdatePostCommandHandler {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository
  ) {}

  async execute(command: UpdatePostCommand): Promise<PostResponseDTO> {
    const { postId, content, image, userId, userRole } = command

    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw PostError.notFound(postId)
    }

    const isAuthor = post.belongsTo(userId)
    const isStaff = [Role.MODERATOR, Role.ADMIN].includes(userRole as Role)

    if (!isAuthor && !isStaff) {
      throw PostError.forbidden()
    }

    try {
      if (content !== undefined) {
        post.updateContent(content)
      }

      if (image !== undefined) {
        post.updateImage(image)
      }

      const updatedPost = await this.postRepository.update(post)

      // TODO: Dispatch domain event
      // await this.eventBus.publish(
      //   new PostUpdatedEvent(postId, userId, { content, image })
      // )

      return PostMapper.toDTO(updatedPost)
    } catch (error) {
      if (error instanceof PostError) throw error

      console.error('[UpdatePostCommandHandler] Unexpected error:', error)
      throw PostError.updateFailed()
    }
  }
}
