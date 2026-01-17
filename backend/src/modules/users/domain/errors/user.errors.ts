import { UserEntity } from '../entities/user.entity'

export enum UserErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_ALREADY_DELETED = 'USER_ALREADY_DELETED',
  USER_EMAIL_TAKEN = 'USER_EMAIL_TAKEN',
  USER_USERNAME_TAKEN = 'USER_USERNAME_TAKEN',
  USER_PASSWORD_INVALID = 'USER_PASSWORD_INVALID',
  USER_UNAUTHORIZED = 'USER_UNAUTHORIZED',
  USER_FORBIDDEN = 'USER_FORBIDDEN',
  USER_CREATION_FAILED = 'USER_CREATION_FAILED',
  USER_UPDATE_FAILED = 'USER_UPDATE_FAILED',
  USER_DELETE_FAILED = 'USER_DELETE_FAILED',
}

export class UserError extends Error {
  constructor(
    public readonly code: UserErrorCode,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'UserError'
    Object.setPrototypeOf(this, UserError.prototype)
  }

  static notFound(id: string): UserError {
    return new UserError(
      UserErrorCode.USER_NOT_FOUND,
      `Usuario con ID ${id} no encontrado`,
      404
    )
  }

  static alreadyExists(emailOrUsername: string): UserError {
    return new UserError(
      UserErrorCode.USER_ALREADY_EXISTS,
      `Usuario con email o username ${emailOrUsername} ya existe`,
      409
    )
  }

  static alreadyDeleted(): UserError {
    return new UserError(
      UserErrorCode.USER_ALREADY_DELETED,
      'El usuario ya está eliminado',
      404
    )
  }

  static emailTaken(email: string): UserError {
    return new UserError(
      UserErrorCode.USER_EMAIL_TAKEN,
      `El email ${email} ya está en uso`,
      409
    )
  }

  static usernameTaken(username: string): UserError {
    return new UserError(
      UserErrorCode.USER_USERNAME_TAKEN,
      `El nombre de usuario ${username} ya está en uso`,
      409
    )
  }

  static passwordInvalid(): UserError {
    return new UserError(
      UserErrorCode.USER_PASSWORD_INVALID,
      'Contraseña inválida',
      400
    )
  }

  static unauthorized(): UserError {
    return new UserError(
      UserErrorCode.USER_UNAUTHORIZED,
      'No autenticado',
      401
    )
  }

  static forbidden(): UserError {
    return new UserError(
      UserErrorCode.USER_FORBIDDEN,
      'Sin permisos para realizar esta acción',
      403
    )
  }

  static creationFailed(): UserError {
    return new UserError(
      UserErrorCode.USER_CREATION_FAILED,
      'Error al crear el usuario',
      500
    )
  }

  static updateFailed(): UserError {
    return new UserError(
      UserErrorCode.USER_UPDATE_FAILED,
      'Error al actualizar el usuario',
      500
    )
  }

  static deleteFailed(): UserError {
    return new UserError(
      UserErrorCode.USER_DELETE_FAILED,
      'Error al eliminar el usuario',
      500
    )
  }
}

export function isUserError(error: unknown): error is UserError {
  return error instanceof UserError
}

export const USER_ERROR_HTTP_MAPPING: Record<UserErrorCode, number> = {
  [UserErrorCode.USER_NOT_FOUND]: 404,
  [UserErrorCode.USER_ALREADY_EXISTS]: 409,
  [UserErrorCode.USER_ALREADY_DELETED]: 404,
  [UserErrorCode.USER_EMAIL_TAKEN]: 409,
  [UserErrorCode.USER_USERNAME_TAKEN]: 409,
  [UserErrorCode.USER_PASSWORD_INVALID]: 400,
  [UserErrorCode.USER_UNAUTHORIZED]: 401,
  [UserErrorCode.USER_FORBIDDEN]: 403,
  [UserErrorCode.USER_CREATION_FAILED]: 500,
  [UserErrorCode.USER_UPDATE_FAILED]: 500,
  [UserErrorCode.USER_DELETE_FAILED]: 500,
}
