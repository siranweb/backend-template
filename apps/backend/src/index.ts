import '@/infra/app/global-imports';
import { usersController, usersResolver } from '@/application/users';
import { WebServer } from '@/infra/web-server';
import { config } from '@/infra/config';
import { loggerMiddleware } from '@/infra/web-server/middlewares/logger.middleware';
import { errorHandlerMiddleware } from '@/infra/web-server/middlewares/error-handler.middleware';
import { DefaultWebServerLogger } from '@/infra/loggers/default-web-server.logger';
import { Sockets } from '@/infra/sockets';

const apiLogger = new DefaultWebServerLogger(config);

const webServer = new WebServer(config, [usersController]);
webServer.addMiddleware(errorHandlerMiddleware())
// webServer.addMiddleware(loggerMiddleware(apiLogger))
webServer.start();

const sockets = new Sockets(config, [usersResolver]);
sockets.start();