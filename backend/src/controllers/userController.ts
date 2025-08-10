import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../generated/prisma'
import { CreateUserRequest, LoginRequest } from 'social-network-app-shared'

const prisma = new PrismaClient()

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    username: string
  }
}

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
      return reply.status(400).send({
        success: false,
        error: 'Usuario ya existe con ese email o nombre de usuario',
      })
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

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    reply.send({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Usuario registrado exitosamente',
    })
  } catch (error) {
    console.error('Register error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({
      where: { email },
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
        password: true,
      },
    })

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Credenciales inválidas',
      })
    }

    if (!user.active) {
      return reply.status(401).send({
        success: false,
        error: 'Cuenta desactivada',
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return reply.status(401).send({
        success: false,
        error: 'Credenciales inválidas',
      })
    }

    const { password: _password, ...userWithoutPassword } = user

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    reply.send({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login exitoso',
    })
  } catch (error) {
    console.error('Login error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const getProfile = async (
  request: AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'No autorizado',
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
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
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return reply.status(404).send({
        success: false,
        error: 'Usuario no encontrado',
      })
    }

    reply.send({
      success: true,
      data: user,
      message: 'Perfil obtenido exitosamente',
    })
  } catch (error) {
    console.error('Get profile error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const getUserByUsername = async (
  request: FastifyRequest<{ Params: { username: string } }>,
  reply: FastifyReply
) => {
  try {
    const { username } = request.params

    const user = await prisma.user.findUnique({
      where: { username },
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
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user || !user.active) {
      return reply.status(404).send({
        success: false,
        error: 'Usuario no encontrado',
      })
    }

    reply.send({
      success: true,
      data: user,
      message: 'Usuario obtenido exitosamente',
    })
  } catch (error) {
    console.error('Get user by username error:', error)
    reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}
