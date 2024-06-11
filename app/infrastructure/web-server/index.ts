import { createApp, Router, toNodeListener } from 'h3';
import { createServer, Server } from 'node:http';
import { uuidv4 } from 'uuidv7';
import { IWebServer } from '@/infrastructure/web-server/types/web-server.interface';
import { IConfig } from '@/infrastructure/config/types/config.interface';
import { IRequestLogger } from '@/infrastructure/web-server/types/request-logger.interface';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';

export class WebServer implements IWebServer {
  private readonly httpServer: Server;

  constructor(
    private readonly config: IConfig,
    private readonly logger: ILogger,
    requestLogger: IRequestLogger,
    requestStorage: IRequestStorage,
    apiRouter: Router,
    docsRouter: Router,
  ) {
    const app = createApp({
      onError: (error, event) => requestLogger.error(error, event),
      onRequest: (event) => requestLogger.request(event),
      onBeforeResponse: (event) => requestLogger.finished(event),
    });

    app.use(apiRouter);
    app.use(docsRouter);

    this.httpServer = createServer((...args) => {
      requestStorage.run(
        {
          requestId: uuidv4(),
        },
        () => {
          toNodeListener(app)(...args);
        },
      );
    });
  }

  public async start(): Promise<void> {
    return new Promise((res, rej) => {
      this.httpServer
        .listen(this.config.webServer.port)
        .on('error', (err) => {
          this.logger.error(err, `Failed to start web server.`);
          rej();
        })
        .on('listening', () => {
          this.logger.info(`Web server started on port ${this.config.webServer.port}.`);
          res();
        });
    });
  }

  public async stop(): Promise<void> {
    return new Promise((res, rej) => {
      this.httpServer.close().on('error', rej).on('close', res);
    });
  }
}
