export enum AuthErrorCode {
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_INACTIVE = 'USER_INACTIVE',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  GOOGLE_TOKEN_INVALID = 'GOOGLE_TOKEN_INVALID',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  GOOGLE_ERROR = 'GOOGLE_ERROR',
  CREATION_FAILED = 'CREATION_FAILED',
}

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message)
    this.name = 'AuthError'
    Object.setPrototypeOf(this, AuthError.prototype)
  }

  static emailAlreadyExists(email: string) {
    return new AuthError(
      AuthErrorCode.EMAIL_TAKEN,
      `El email ${email} ya está registrado`,
      400
    )
  }

  static usernameAlreadyExists(username: string) {
    return new AuthError(
      AuthErrorCode.USERNAME_TAKEN,
      `El nombre de usuario ${username} ya está en uso`,
      400
    )
  }

  static invalidCredentials(): AuthError {
    return new AuthError(
      AuthErrorCode.INVALID_CREDENTIALS,
      'Credenciales inválidas',
      401
    )
  }

  static userInactive(): AuthError {
    return new AuthError(AuthErrorCode.USER_INACTIVE, 'Usuario inactivo', 401)
  }

  static tokenInvalid(): AuthError {
    return new AuthError(AuthErrorCode.TOKEN_INVALID, 'Token inválido', 401)
  }

  static tokenExpired(): AuthError {
    return new AuthError(AuthErrorCode.TOKEN_EXPIRED, 'Sesión expirada', 401)
  }

  static googleTokenInvalid(): AuthError {
    return new AuthError(
      AuthErrorCode.GOOGLE_TOKEN_INVALID,
      'Token de Google inválido o expirado',
      400
    )
  }

  static sessionNotFound(): AuthError {
    return new AuthError(
      AuthErrorCode.SESSION_NOT_FOUND,
      'Sesión no encontrada',
      404
    )
  }

  static googleError(message: string): AuthError {
    return new AuthError(
      AuthErrorCode.GOOGLE_ERROR,
      `Error en autenticación con Google: ${message}`,
      500
    )
  }

  static creationFailed(): AuthError {
    return new AuthError(
      AuthErrorCode.CREATION_FAILED,
      'Error al crear el usuario',
      500
    )
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError
}

export const AUTH_ERROR_HTTP_MAPPING: Record<AuthErrorCode, number> = {
  [AuthErrorCode.USER_ALREADY_EXISTS]: 400,
  [AuthErrorCode.CREATION_FAILED]: 500,
  [AuthErrorCode.INVALID_CREDENTIALS]: 401,
  [AuthErrorCode.USER_INACTIVE]: 401,
  [AuthErrorCode.TOKEN_INVALID]: 401,
  [AuthErrorCode.TOKEN_EXPIRED]: 401,
  [AuthErrorCode.GOOGLE_TOKEN_INVALID]: 400,
  [AuthErrorCode.SESSION_NOT_FOUND]: 404,
  [AuthErrorCode.GOOGLE_ERROR]: 500,
  [AuthErrorCode.EMAIL_TAKEN]: 400,
  [AuthErrorCode.USERNAME_TAKEN]: 400,
}
