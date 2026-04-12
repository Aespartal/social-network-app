import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { NotificationQueryProvider } from '../common/notification-query.provider.interface'

export interface GetNotificationsQuery {
  userId: string
  limit: number
  cursor?: string
}

@injectable()
export class GetNotificationsHandler {
  constructor(
    @inject(TYPES.NotificationQueryProvider)
    private readonly queryProvider: NotificationQueryProvider
  ) {}

  async execute(query: GetNotificationsQuery) {
    return this.queryProvider.getUserNotifications(
      query.userId,
      query.limit,
      query.cursor
    )
  }
}
