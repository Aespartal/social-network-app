import { PageRequest } from '../common/post-query.provider.interface'

export class GetFollowingFeedQuery {
  constructor(
    public readonly followingUserIds: string[],
    public readonly userId: string,
    public readonly page: PageRequest
  ) {}
}
