// profileController.ts

import { prisma } from "@/lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { ApiResponse } from "social-network-app-shared/types/api.type";

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
            visitsReceived: true
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
      data: { user },
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
  const { visitedId } = req.params as { visitedId: string };
  const visitorId = req.user!.id;

  if (visitorId === visitedId) return reply.send();

  await prisma.profileVisit.create({
    data: {
      visitorId,
      visitedId
    }
  });

  return reply.status(204).send();
};

export const getProfileVisits = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.user!.id;

  const visits = await prisma.profileVisit.findMany({
    where: { visitedId: userId },
    include: {
      visitor: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    distinct: ['visitorId'],
    take: 10
  });

  return reply.send({ success: true, data: visits.map(v => v.visitor) });
};


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
            visitsReceived: true
          },
        },
      },
    })

    if (!user || !user.active) {
      return reply.status(404).send({
        success: false,
        error: 'Usuario no encontrado o cuenta inactiva',
      } as ApiResponse)
    }

    const publicUser = {
      ...user,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      visitsReceived: user._count.visitsReceived,
    }

    return reply.send({
      success: true,
      data: publicUser,
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
    const userId = request.user!.id;
    const limit = Number((request.query as any)?.limit) || 5;

    const suggestedUsers = await prisma.user.findMany({
      where: {
        active: true,
        id: { 
          not: userId,
        },
        followers: {
          none: {
            followerId: userId
          }
        }
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
      orderBy: [
        { verified: 'desc' },
        { followers: { _count: 'desc' } }
      ],
      take: 20,
    });

    const shuffled = suggestedUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);

    return reply.send({
      success: true,
      data: shuffled,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Error al obtener usuarios sugeridos',
    });
  }
}
