import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import type { EventBus } from '@/lib/events/event-bus.interface'
import {
  PostCreatedEvent,
  PostLikedEvent,
  PostBookmarkedEvent,
} from '@/lib/events/domain-events'
import { NodeActivityService } from '../../application/services/node-activity.service'

@injectable()
export class NodeActivitySubscriber {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES.NodeActivityService)
    private readonly nodeActivityService: NodeActivityService
  ) {
    this.setupSubscriptions()
  }

  private setupSubscriptions(): void {
    this.eventBus.subscribe('post.created', async (event: PostCreatedEvent) => {
      await this.nodeActivityService.recordActivity(event.postId, 2)
    })

    this.eventBus.subscribe('post.liked', async (event: PostLikedEvent) => {
      await this.nodeActivityService.recordActivity(event.postId, 1)
    })

    this.eventBus.subscribe(
      'post.bookmarked',
      async (event: PostBookmarkedEvent) => {
        await this.nodeActivityService.recordActivity(event.postId, 1.5)
      }
    )
  }
}
