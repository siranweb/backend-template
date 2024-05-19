import process from 'node:process';
import { appDatabase } from '@/infrastructure/app-database/database';
import { startServer, stopServer } from 'app/infrastructure/web-server';

startServer().then(() => console.log('Server started'));

const shutdown = () => {
  Promise.allSettled([stopServer(), appDatabase.destroy()]).finally(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);
