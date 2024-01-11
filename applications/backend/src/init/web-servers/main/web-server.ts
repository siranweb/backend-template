import { config } from '@/infra/config';
import { errorHandler } from '@/infra/web-server/error-handler';
import { WebServer } from '@/lib/web-server';
import { accountsController } from '@/di/users.di';

export const webServer = new WebServer([accountsController], {
  port: config.webServer.port,
  prefix: '/api',
});

webServer.onError(errorHandler());
