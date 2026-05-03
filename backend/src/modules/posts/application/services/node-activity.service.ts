import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { AuraNodeRepository } from '../../domain/repositories/aura-node.repository.interface'
import { PostRepository } from '../../domain/repositories/post.repository.interface'

@injectable()
export class NodeActivityService {
  constructor(
    @inject(TYPES.AuraNodeRepository)
    private readonly auraNodeRepository: AuraNodeRepository,
    @inject(TYPES.PostRepository)
    private readonly postRepository: PostRepository
  ) {}

  /**
   * Registra actividad en los nodos asociados a un post.
   * Se llama cuando hay likes, bookmarks o se crea un post.
   */
  async recordActivity(postId: string, weight: number = 1): Promise<void> {
    const post = await this.postRepository.findById(postId)
    if (!post || !post.tags || post.tags.length === 0) return

    for (const postTag of post.tags) {
      const tagName = postTag.toString()
      if (!tagName) continue
      const node = await this.auraNodeRepository.findBySlug(
        tagName.toLowerCase()
      )

      if (node) {
        await this.auraNodeRepository.incrementActivity(node.id, weight)
      }
    }
  }

  /**
   * Bonus por lectura profunda (reading time)
   */
  async recordDeepReading(
    postId: string,
    readingTimeMinutes: number
  ): Promise<void> {
    const weight = Math.min(readingTimeMinutes * 0.5, 2)
    await this.recordActivity(postId, weight)
  }
}
