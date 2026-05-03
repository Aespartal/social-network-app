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

  static emailTaken(email: string) {
    return new UserError(
      `Email ${email} is already in use`,
      'EMAIL_ALREADY_EXISTS',
      409
    )
  }

  static usernameTaken(username: string) {
    return new UserError(
      `Username ${username} is already in use`,
      'USERNAME_ALREADY_EXISTS',
      409
    )
  }

  static forbidden() {
    return new UserError(
      'You do not have permission to perform this action',
      'FORBIDDEN',
      403
    )
  }

  static creationFailed() {
    return new UserError('Failed to create user', 'USER_CREATION_FAILED', 500)
  }

  static updateFailed() {
    return new UserError('Failed to update user', 'USER_UPDATE_FAILED', 500)
  }

  static deleteFailed() {
    return new UserError('Failed to delete user', 'USER_DELETE_FAILED', 500)
  }
}
