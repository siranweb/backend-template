import 'zod-openapi/extend';
import process from 'node:process';
import { mainWebServer } from '@/modules/entrypoints/web-servers/main.web-server';
import { mainWsServer } from '@/modules/entrypoints/web-sockets/main.ws-server';
import { appDatabase } from '@/modules/databases/app-database/database';

mainWebServer.start().then(() => console.log('Web server started'));
mainWsServer.start().then(() => console.log('WebSockets server started'));

const shutdown = () => {
  Promise.allSettled([mainWebServer.stop(), mainWsServer.stop(), appDatabase.destroy()]).finally(
    () => process.exit(0),
  );
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);
