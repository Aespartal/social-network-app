import 'reflect-metadata'
import { buildServer } from './server'
import { config } from '@/config/env'

const server = await buildServer()

try {
  await server.listen({
    port: config.PORT,
    host: config.HOST,
  })

  server.log.info(`🚀 Servidor en http://${config.HOST}:${config.PORT}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}

const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}. Starting graceful shutdown...`)

  // Force exit after 10 seconds if graceful shutdown hangs
  const forceExitTimeout = setTimeout(() => {
    server.log.error('Graceful shutdown timed out after 10s. Forcing exit...')
    process.exit(1)
  }, 10_000)

  try {
    await server.close()
    server.log.info('Server closed successfully.')
    clearTimeout(forceExitTimeout)
    process.exit(0)
  } catch (err) {
    server.log.error(err, 'Error during graceful shutdown:')
    process.exit(1)
  }
}

;['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal))
})
