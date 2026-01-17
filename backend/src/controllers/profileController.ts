import { prisma } from '@/lib/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ApiResponse } from 'social-network-app-shared/types/api.type'
import { parseUpdateProfileMultipart } from '@/utils/multipart-helper'

/**
 * Obtener Perfil Propio (Ruta Protegida)
 */
export const getProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user?.id },
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
            visitsReceived: true,
          },
        },
      },
    })

    if (!user) {
      return reply
        .status(404)
        .send({ success: false, error: 'Usuario no encontrado' } as ApiResponse)
    }

    return reply.send({
      success: true,
      data: user,
      message: 'Perfil obtenido exitosamente',
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error al obtener el perfil',
    } as ApiResponse)
  }
}

export const recordVisit = async (req: FastifyRequest, reply: FastifyReply) => {
  const { visitedId } = req.params as { visitedId: string }
  const visitorId = req.user!.id

  if (visitorId === visitedId) return reply.send()

  // Usar upsert para evitar duplicados y actualizar la fecha de la visita
  await prisma.profileVisit.upsert({
    where: {
      visitorId_visitedId: {
        visitorId,
        visitedId,
      },
    },
    update: {
      createdAt: new Date(), // Actualiza la fecha de la visita
    },
    create: {
      visitorId,
      visitedId,
    },
  })

  return reply.status(204).send()
}

export const getProfileVisits = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = req.user!.id

  const visits = await prisma.profileVisit.findMany({
    where: { visitedId: userId },
    include: {
      visitor: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    distinct: ['visitorId'],
    take: 10,
  })

  return reply.send({ success: true, data: visits.map(v => v.visitor) })
}

/**
 * Obtener Usuario por Username (Público)
 */
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
        username: true,
        name: true,
        avatar: true,
        bio: true,
        active: true,
        verified: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            visitsReceived: true,
          },
        },
      },
    })

    // Debug: Verificar el conteo de visitas directamente
    const visitsCount = await prisma.profileVisit.count({
      where: { visitedId: user?.id },
    })

    console.log('Usuario:', username)
    console.log('Visitas desde _count:', user?._count.visitsReceived)
    console.log('Visitas desde count directo:', visitsCount)

    if (!user || !user.active) {
      return reply.status(404).send({
        success: false,
        error: 'Usuario no encontrado o cuenta inactiva',
      } as ApiResponse)
    }

    // Mantener la estructura _count que espera el frontend
    return reply.send({
      success: true,
      data: user,
      message: 'Usuario obtenido exitosamente',
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error interno del servidor',
    } as ApiResponse)
  }
}

export const getSuggestedUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user!.id
    const limit = Number((request.query as any)?.limit) || 5

    const suggestedUsers = await prisma.user.findMany({
      where: {
        active: true,
        id: {
          not: userId,
        },
        followers: {
          none: {
            followerId: userId,
          },
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        verified: true,
        _count: {
          select: { followers: true },
        },
      },
      orderBy: [{ verified: 'desc' }, { followers: { _count: 'desc' } }],
      take: 20,
    })

    const shuffled = suggestedUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, limit)

    return reply.send({
      success: true,
      data: shuffled,
    })
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error al obtener usuarios sugeridos',
    })
  }
}

/**
 * Actualizar Perfil (Ruta Protegida)
 */
export const updateProfile = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params
    const userId = request.user!.id

    // Verificar que el usuario solo pueda actualizar su propio perfil
    if (id !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permiso para actualizar este perfil',
      } as ApiResponse)
    }

    // Parsear multipart data
    if (!request.isMultipart()) {
      return reply.status(400).send({
        success: false,
        error: 'El contenido debe ser multipart/form-data',
      } as ApiResponse)
    }

    const { username, name, bio, avatarUrl } =
      await parseUpdateProfileMultipart(request.parts())

    // Verificar si el username ya está en uso (si se está cambiando)
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        return reply.status(409).send({
          success: false,
          error: 'El nombre de usuario ya está en uso',
        } as ApiResponse)
      }
    }

    // Construir objeto de actualización solo con campos presentes
    const updateData: any = {}
    if (username !== undefined) updateData.username = username
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (avatarUrl !== undefined) updateData.avatar = avatarUrl

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
            visitsReceived: true,
          },
        },
      },
    })

    return reply.send({
      success: true,
      data: updatedUser,
      message: 'Perfil actualizado exitosamente',
    } as ApiResponse)
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Error al actualizar el perfil',
    } as ApiResponse)
  }
}
