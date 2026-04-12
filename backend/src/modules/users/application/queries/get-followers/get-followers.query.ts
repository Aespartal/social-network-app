export class GetFollowersQuery {
  constructor(
    public readonly userId: string,
    public readonly currentUserId?: string
  ) {}
}
