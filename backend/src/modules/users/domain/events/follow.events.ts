export class UserFollowedEvent {
  constructor(
    public readonly followerId: string,
    public readonly followedId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

export class UserUnfollowedEvent {
  constructor(
    public readonly followerId: string,
    public readonly followedId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
