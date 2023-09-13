import { WebServerLogger } from '@/infra/loggers/web-server.logger';
import { config } from '@/infra/config';
import { WebServer } from '@/lib/web-server';
import { usersController } from '@/app/users';
import { loggerMiddleware } from '@/infra/middlewares/web-server/logger.middleware';
import { errorHandlerMiddleware } from '@/infra/middlewares/web-server/error-handler.middleware';

const apiLogger = new WebServerLogger(config);

export const mainWebServer = new WebServer(config, [usersController]);
mainWebServer.addMiddleware(loggerMiddleware(apiLogger));
mainWebServer.addMiddleware(errorHandlerMiddleware());
