import '@/lib/common/global-imports';
import { usersController, usersResolver } from '@/app/users';
import { WebServer } from '@/lib/web-server';
import { config } from '@/lib/config';
import { loggerMiddleware } from '@/lib/web-server/middlewares/logger.middleware';
import { errorHandlerMiddleware } from '@/lib/web-server/middlewares/error-handler.middleware';
import { WebServerLogger } from '@/lib/loggers/web-server.logger';
import { Sockets } from '@/lib/sockets';

const apiLogger = new WebServerLogger(config);

const webServer = new WebServer(config, [usersController]);
webServer.addMiddleware(errorHandlerMiddleware())
// webServer.addMiddleware(loggerMiddleware(apiLogger))
webServer.start();

const sockets = new Sockets(config, [usersResolver]);
sockets.start();