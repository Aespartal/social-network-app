import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import { UserQueryProvider } from '../common/user-query.provider.interface'
import { IsFollowingQuery } from './is-following.query'

@injectable()
export class IsFollowingHandler {
  constructor(
    @inject(TYPES.UserQueryProvider)
    private readonly userQueryProvider: UserQueryProvider
  ) {}

  async execute(query: IsFollowingQuery): Promise<boolean> {
    return this.userQueryProvider.isFollowing(
      query.followerId,
      query.followedId
    )
  }
}
