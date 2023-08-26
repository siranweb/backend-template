import '@/infra/common/global-imports';
import { usersController, usersResolver } from '@/app/users';
import { WebServer } from '@/infra/web-server';
import { config } from '@/infra/config';
import { loggerMiddleware } from '@/infra/middlewares/web-server/logger.middleware';
import { errorHandlerMiddleware } from '@/infra/middlewares/web-server/error-handler.middleware';
import { WebServerLogger } from '@/infra/loggers/web-server.logger';
import { Sockets } from '@/infra/sockets';

const apiLogger = new WebServerLogger(config);

const webServer = new WebServer(config, [usersController]);
webServer.addMiddleware(loggerMiddleware(apiLogger));
webServer.addMiddleware(errorHandlerMiddleware());
webServer.start();

const sockets = new Sockets(config, [usersResolver]);
sockets.start();
