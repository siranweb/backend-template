import '@/infra/common/global-imports';
import process from 'node:process';
import { webServer } from '@/entrypoints/web-servers/main/web-server';
import { wsServer } from '@/entrypoints/web-sockets/main/ws-server';
import { appDatabase } from '@/databases/app-database/database';

webServer.start().then(() => console.log('Web server started'));
wsServer.start().then(() => console.log('WebSockets server started'));

const shutdown = () => {
  Promise.allSettled([webServer.stop(), wsServer.stop(), appDatabase.destroy()]).finally(() =>
    process.exit(0),
  );
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);