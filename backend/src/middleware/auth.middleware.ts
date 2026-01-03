import { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Middleware Obligatorio: Si no hay token o es inválido, corta la petición.
 */
export const authenticateToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    request.log.error(err)
    return reply.status(401).send({
      success: false,
      error: 'No autorizado: Token inválido o inexistente',
    })
  }
}

/**
 * Middleware Opcional: Si hay token lo decodifica, si no, deja pasar la petición.
 * Útil para feeds públicos donde el contenido cambia si estás logueado.
 */
export const optionalAuth = async (
  request: FastifyRequest,
  _reply: FastifyReply
) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    request.user = undefined;
  }
}