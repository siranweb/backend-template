import { createApp, toNodeListener } from 'h3';
import { createServer } from 'node:http';
import { config } from '@/infrastructure/config';
import { apiRouter } from '@/infrastructure/web-server/routers/api.router';
import { requestStorage } from '@/infrastructure/request-storage';
import { uuidv4 } from 'uuidv7';
import console from 'node:console';

const app = createApp({
  onRequest: () => {
    const { requestId } = requestStorage.getStore()!;
    console.log(requestId);
  },
});
app.use(apiRouter);

const webServer = createServer((...args) => {
  requestStorage.run(
    {
      requestId: uuidv4(),
    },
    () => {
      toNodeListener(app)(...args);
    },
  );
});

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
