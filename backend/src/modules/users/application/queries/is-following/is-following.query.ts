export class IsFollowingQuery {
  constructor(
    public readonly followerId: string,
    public readonly followedId: string
  ) {}
}
