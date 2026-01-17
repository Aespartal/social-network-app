import { FastifyRequest, FastifyReply } from 'fastify'
import {
  RegisterUseCase,
  LoginUseCase,
  GoogleLoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
} from '../../application'
import {
  isAuthError,
  AUTH_ERROR_HTTP_MAPPING,
} from '../../domain/errors/auth.errors'
import { CreateAuthUserInput } from '../../domain/entities/auth-user.entity'

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as CreateAuthUserInput & { password: string }

      const authResponse = await this.registerUseCase.execute(body)

      return reply.status(201).send({
        success: true,
        data: authResponse,
        message: 'Usuario registrado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const authResponse = await this.loginUseCase.execute(body)

      return reply.send({
        success: true,
        data: authResponse,
        message: 'Login exitoso',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async googleLogin(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { token: string }

      const authResponse = await this.googleLoginUseCase.execute(body.token)

      return reply.send({
        success: true,
        data: authResponse,
        message: 'Login con Google exitoso',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { refreshToken: string }

      const authResponse = await this.refreshTokenUseCase.execute(
        body.refreshToken
      )

      return reply.send({
        success: true,
        data: authResponse,
        message: 'Token renovado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { refreshToken: string }
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      await this.logoutUseCase.execute(body.refreshToken, userId)

      return reply.send({
        success: true,
        data: null,
        message: 'Sesión cerrada exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (isAuthError(error)) {
      const statusCode = AUTH_ERROR_HTTP_MAPPING[error.code] || 500
      return reply.status(statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
        statusCode,
      })
    }

    console.error('AuthController error:', error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}
