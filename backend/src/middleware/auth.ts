import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    username: string
  }
}

export const authenticateToken = async (
  request: AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: 'Token de acceso requerido',
      })
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret'

    try {
      const decoded = jwt.verify(token, secret) as any
      request.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      }
    } catch (_jwtError) {
      return reply.status(403).send({
        success: false,
        error: 'Token inválido',
      })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    })
  }
}

export const optionalAuth = async (
  request: AuthenticatedRequest,
  _reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const secret = process.env.JWT_SECRET || 'fallback-secret'

      try {
        const decoded = jwt.verify(token, secret) as any
        request.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
        }
      } catch (_jwtError) {
        request.user = undefined
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error)
    request.user = undefined
  }
}
