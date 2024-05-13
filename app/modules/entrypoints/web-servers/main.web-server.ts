import { config } from '@/modules/config';
import { WebServer } from '@/lib/web-server';
import { usersController } from '@/di/users.di';
import { registerController } from '@/modules/common/definitions/controller/register-controller';
import { errorHandler, redoc } from '@/di/web-server.di';
import { docsController } from '@/di/docs.di';

export const mainWebServer = new WebServer({
  port: config.webServer.port,
});

mainWebServer.onError(errorHandler);

registerController(mainWebServer, redoc, usersController);
registerController(mainWebServer, redoc, docsController);
