import '@fastify/jwt'
import { Role } from '@/enums/role.enum'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }

  interface FastifyRequest {
    user?: {
      id: string
      email: string
      username: string
      role: Role
    },
    file: () => Promise<import('@fastify/multipart').MultipartFile | undefined>;
    parts: () => AsyncIterableIterator<import('@fastify/multipart').Multipart>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string
      email: string
      username: string
      role: Role
    }
    user: FastifyJWT['payload']
  }
}
