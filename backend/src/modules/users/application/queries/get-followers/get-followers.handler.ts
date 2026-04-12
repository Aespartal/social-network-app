import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import {
  UserQueryProvider,
  FollowerResponseDTO,
} from '../common/user-query.provider.interface'
import { GetFollowersQuery } from './get-followers.query'

@injectable()
export class GetFollowersHandler {
  constructor(
    @inject(TYPES.UserQueryProvider)
    private readonly userQueryProvider: UserQueryProvider
  ) {}

  async execute(query: GetFollowersQuery): Promise<FollowerResponseDTO[]> {
    return this.userQueryProvider.getFollowers(
      query.userId,
      query.currentUserId
    )
  }
}
