import process from 'node:process';
import { appDatabase } from '@/infrastructure/app-database/database';
import { startServer, stopServer } from '@/infrastructure/web-server';
import { config } from '@/infrastructure/config';
import { makeLogger } from '@/infrastructure/logger/make-logger';

const logger = makeLogger('App');

startServer(config.webServer.port).then(() =>
  logger.info(`Web server started on port ${config.webServer.port}.`),
);

const shutdown = () => {
  Promise.allSettled([stopServer(), appDatabase.destroy()]).finally(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);
