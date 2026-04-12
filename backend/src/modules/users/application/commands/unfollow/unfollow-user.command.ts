export class UnfollowUserCommand {
  constructor(
    public readonly followerId: string,
    public readonly followedId: string
  ) {}
}
