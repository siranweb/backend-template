import { createApp, toNodeListener } from 'h3';
import { createServer } from 'node:http';
import { config } from '@/infrastructure/config';
import { apiRouter } from '@/infrastructure/web-server/routers/api.router';

const app = createApp();
app.use(apiRouter);

const webServer = createServer(toNodeListener(app));

export async function startServer(): Promise<void> {
  return new Promise((res, rej) => {
    webServer.listen(config.webServer.port).on('error', rej).on('listening', res);
  });
}

export async function stopServer(): Promise<void> {
  return new Promise((res, rej) => {
    webServer.close().on('error', rej).on('close', res);
  });
}
