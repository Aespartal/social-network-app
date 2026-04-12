import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import {
  UserQueryProvider,
  FollowerResponseDTO,
} from '../common/user-query.provider.interface'
import { GetFollowingQuery } from './get-following.query'

@injectable()
export class GetFollowingHandler {
  constructor(
    @inject(TYPES.UserQueryProvider)
    private readonly userQueryProvider: UserQueryProvider
  ) {}

  async execute(query: GetFollowingQuery): Promise<FollowerResponseDTO[]> {
    return this.userQueryProvider.getFollowing(
      query.userId,
      query.currentUserId
    )
  }
}
