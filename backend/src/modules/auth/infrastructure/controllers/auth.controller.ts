import { FastifyRequest, FastifyReply } from 'fastify'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/lib/di-types'
import {
  RegisterCommandHandler,
  LoginCommandHandler,
  GoogleLoginCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
  GetMeHandler,
} from '../../application'
import {
  isAuthError,
  AUTH_ERROR_HTTP_MAPPING,
} from '../../domain/errors/auth.errors'
import {
  RegisterBodyType,
  LoginBodyType,
  GoogleLoginBodyType,
  RefreshTokenBodyType,
  LogoutBodyType,
} from '../schemas'
import type { Logger } from '@/lib/logger/logger.interface'

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.RegisterCommandHandler)
    private readonly registerHandler: RegisterCommandHandler,
    @inject(TYPES.LoginCommandHandler)
    private readonly loginHandler: LoginCommandHandler,
    @inject(TYPES.GoogleLoginCommandHandler)
    private readonly googleLoginHandler: GoogleLoginCommandHandler,
    @inject(TYPES.RefreshTokenCommandHandler)
    private readonly refreshTokenHandler: RefreshTokenCommandHandler,
    @inject(TYPES.LogoutCommandHandler)
    private readonly logoutHandler: LogoutCommandHandler,
    @inject(TYPES.GetMeHandler) private readonly getMeHandler: GetMeHandler,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  async register(
    request: FastifyRequest<{ Body: RegisterBodyType }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body

      const authResponse = await this.registerHandler.execute({
        email: body.email,
        username: body.username,
        name: body.name,
        password: body.password,
        avatar: body.avatar,
        bio: body.bio,
      })

      return reply.status(201).send({
        success: true,
        data: authResponse,
        message: 'Usuario registrado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async login(
    request: FastifyRequest<{ Body: LoginBodyType }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body

      const authResponse = await this.loginHandler.execute({
        email: body.email,
        password: body.password,
      })

      return reply.send({
        success: true,
        data: authResponse,
        message: 'Login exitoso',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async googleLogin(
    request: FastifyRequest<{ Body: GoogleLoginBodyType }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body

      const authResponse = await this.googleLoginHandler.execute({
        token: body.token,
      })

      return reply.send({
        success: true,
        data: authResponse,
        message: 'Login con Google exitoso',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenBodyType }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body

      const authResponse = await this.refreshTokenHandler.execute({
        refreshToken: body.refreshToken,
      })

      return reply.send({
        success: true,
        data: authResponse,
        message: 'Token renovado exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async logout(
    request: FastifyRequest<{ Body: LogoutBodyType }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      await this.logoutHandler.execute({
        refreshToken: body.refreshToken,
      })

      return reply.send({
        success: true,
        data: null,
        message: 'Sesión cerrada exitosamente',
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'No autenticado',
        })
      }

      const userResponse = await this.getMeHandler.execute({
        userId,
      })

      return reply.send({
        success: true,
        data: userResponse,
      })
    } catch (error) {
      return this.handleError(error, reply)
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (isAuthError(error)) {
      this.logger.error('AuthController error:', { error })

      const statusCode = AUTH_ERROR_HTTP_MAPPING[error.code] || 500

      return reply.status(statusCode).send({
        success: false,
        error: error.message,
        code: error.code,
        statusCode,
      })
    }

    this.logger.error('AuthController error:', { error })
    return reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}
