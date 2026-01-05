import { buildServer } from './server';
import { config } from '@/config/env';

const server = await buildServer();

try {
  await server.listen({
    port: config.PORT,
    host: config.HOST,
  });

  server.log.info(`🚀 Servidor en http://${config.HOST}:${config.PORT}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
});
