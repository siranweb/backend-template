import { createApp, toNodeListener } from 'h3';
import { createServer } from 'node:http';
import { apiRouter } from '@/infrastructure/web-server/routers/api.router';
import { requestStorage } from '@/infrastructure/request-storage';
import { uuidv4 } from 'uuidv7';
import { makeLogger } from '@/infrastructure/logger/make-logger';
import { IRequestLogger } from '@/infrastructure/web-server/types/request-logger.interface';
import { RequestLogger } from '@/infrastructure/web-server/request-logger';

const logger = makeLogger('WebServer');
const requestLogger: IRequestLogger = new RequestLogger(logger);

const app = createApp({
  onError: (error, event) => requestLogger.error(error, event),
  onRequest: (event) => requestLogger.request(event),
  onBeforeResponse: (event) => requestLogger.finished(event),
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

export async function startServer(port: number): Promise<void> {
  return new Promise((res, rej) => {
    webServer.listen(port).on('error', rej).on('listening', res);
  });
}

export async function stopServer(): Promise<void> {
  return new Promise((res, rej) => {
    webServer.close().on('error', rej).on('close', res);
  });
}
