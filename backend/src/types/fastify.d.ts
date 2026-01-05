import '@fastify/jwt'

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
    }
    user: {
      id: string;
      email: string;
      username: string;
    } | undefined;
  }
}
