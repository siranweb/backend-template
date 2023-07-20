import '@/infra/global';
import { usersController } from '@/application/users';
import { WebServer } from '@/infra/api/web-server';
import { config } from '@/infra/config';
import { loggerMiddleware } from '@/infra/api/middlewares/logger.middleware';
import { DefaultApiLogger } from '@/infra/loggers/default-api-logger';

const apiLogger = new DefaultApiLogger(config);

const webServer = new WebServer(config, [usersController]);
webServer.addMiddleware(loggerMiddleware(apiLogger))
webServer.start();