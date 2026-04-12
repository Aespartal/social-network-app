import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { CreateUserRequest, LoginRequest } from '@/shared/types/auth.type'
import type { ApiResponse } from '@/shared/types/api.type'
import { Role } from '@/enums/role.enum'

/**
 * Registro de Usuario
 */
export const register = async (
  request: FastifyRequest<{ Body: CreateUserRequest }>,
  reply: FastifyReply
) => {
  try {
    const { email, username, name, password, avatar, bio } = request.body

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'El email o nombre de usuario ya está en uso',
      }
      return reply.status(400).send(response)
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        avatar,
        bio,
      },
      // Seleccionamos campos para no devolver el password
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        verified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: Role.USER,
    }

    const token = request.server.jwt.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    })

    const refreshToken = request.server.jwt.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    })

    await prisma.session.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const response: ApiResponse = {
      success: true,
      data: { user, token, refreshToken },
      message: 'Usuario registrado exitosamente',
    }
    return reply.status(201).send(response)
  } catch (error) {
    request.log.error(error)
    const response: ApiResponse = {
      success: false,
      error: 'Error interno al registrar usuario',
    }
    return reply.status(500).send(response)
  }
}

/**
 * Login de Usuario
 */
export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.active) {
      return reply.status(401).send({
        success: false,
        error: 'Credenciales inválidas o cuenta desactivada',
      } as ApiResponse)
    }

    const isValidPassword = await bcrypt.compare(password, user.password!)
    if (!isValidPassword) {
      return reply.status(401).send({
        success: false,
        error: 'Credenciales inválidas',
      } as ApiResponse)
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
    }

    const token = request.server.jwt.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    })

    const refreshToken = request.server.jwt.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    })

    const { password: _, ...userWithoutPassword } = user

    return reply.send({
      success: true,
      data: { user: userWithoutPassword, token, refreshToken },
      message: 'Inicio de sesión exitoso',
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno en el servidor',
    })
  }
}

export const googleLogin = async (
  request: FastifyRequest<{ Body: { token: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { token } = request.body

    if (!token) {
      return reply.status(400).send({
        success: false,
        error: 'Token de Google requerido',
      } as ApiResponse)
    }

    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    )

    if (!googleResponse.ok) {
      return reply.status(401).send({
        success: false,
        error: 'El token de Google no es válido o ha expirado',
      })
    }

    interface GoogleUserPayload {
      sub: string
      email: string
      name?: string
      picture?: string
      [key: string]: unknown
    }

    const payload = (await googleResponse.json()) as GoogleUserPayload

    if (!payload || typeof payload !== 'object' || !payload.email) {
      return reply.status(400).send({
        success: false,
        error: 'Google no devolvió la información de perfil necesaria.',
      })
    }

    const { sub: googleId, email, name, picture } = payload

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    })

    if (!user) {
      const baseUsername = email.split('@')[0]
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          name: name || 'Google User',
          username: `${baseUsername}_${Math.floor(Math.random() * 1000)}`,
          avatar: picture,
          password: '',
          verified: true,
        },
      })
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      })
    }
    const jwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as Role,
    }

    const accessToken = request.server.jwt.sign(jwtPayload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    })

    const refreshToken = request.server.jwt.sign(jwtPayload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    })

    await prisma.session.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return reply.status(200).send({
      success: true,
      message: 'Login con Google exitoso',
      data: {
        user: userWithoutPassword,
        token: accessToken,
        refreshToken,
      },
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error en la autenticación con Google'
    return reply.status(500).send({
      success: false,
      error: errorMessage,
    })
  }
}

export const refresh = async (
  request: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
) => {
  try {
    const { refreshToken } = request.body

    const session = await prisma.session.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.session.delete({ where: { id: session.id } })

      return reply.status(401).send({
        success: false,
        error: 'Sesión expirada. Por favor, inicia sesión de nuevo.',
      } as ApiResponse)
    }

    const accessToken = request.server.jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        role: session.user.role as Role,
      },
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    )

    return reply.send({
      success: true,
      data: { token: accessToken },
      message: 'Token renovado',
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(401).send({ success: false, error: 'Token inválido' })
  }
}

export const logout = async (
  request: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
) => {
  try {
    const { refreshToken } = request.body

    await prisma.session.deleteMany({
      where: {
        token: refreshToken,
        userId: request.user!.id,
      },
    })

    return reply.send({
      success: true,
      message: 'Sesión cerrada y token invalidado',
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error al procesar el cierre de sesión',
    } as ApiResponse)
  }
}
