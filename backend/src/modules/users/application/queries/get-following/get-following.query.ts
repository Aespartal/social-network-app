export class GetFollowingQuery {
  constructor(
    public readonly userId: string,
    public readonly currentUserId?: string
  ) {}
}
