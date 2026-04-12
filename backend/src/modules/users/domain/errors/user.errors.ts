export class UserError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'UserError'
  }

  static notFound(identifier: string) {
    return new UserError(
      `User with identifier ${identifier} not found`,
      'USER_NOT_FOUND',
      404
    )
  }

  static cannotFollowSelf() {
    return new UserError(
      'You cannot follow yourself',
      'CANNOT_FOLLOW_SELF',
      400
    )
  }

  static alreadyFollowing() {
    return new UserError(
      'You are already following this user',
      'ALREADY_FOLLOWING',
      400
    )
  }

  static notFollowing() {
    return new UserError(
      'You are not following this user',
      'NOT_FOLLOWING',
      400
    )
  }
}
