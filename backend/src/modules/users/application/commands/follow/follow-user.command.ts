export class FollowUserCommand {
  constructor(
    public readonly followerId: string,
    public readonly followedId: string
  ) {}
}
