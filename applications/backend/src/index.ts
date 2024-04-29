import '@/app/common/global-imports';
import process from 'node:process';
import { mainWebServer } from '@/app/entrypoints/web-servers/main.web-server';
import { mainWsServer } from '@/app/entrypoints/web-sockets/main.ws-server';
import { appDatabase } from '@/app/databases/app-database/database';

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
