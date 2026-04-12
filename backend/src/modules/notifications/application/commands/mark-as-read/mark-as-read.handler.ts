import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { NotificationRepository } from '../../../domain/repositories/notification.repository.interface'

export interface MarkAsReadCommand {
  notificationId?: string
  userId: string
  all?: boolean
}

@injectable()
export class MarkAsReadHandler {
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly repository: NotificationRepository
  ) {}

  async execute(command: MarkAsReadCommand) {
    if (command.all) {
      await this.repository.markAllAsRead(command.userId)
    } else if (command.notificationId) {
      await this.repository.markAsRead(command.notificationId)
    }
  }
}
