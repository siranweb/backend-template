import { config } from '@/config';
import { WebServer } from '@/lib/web-server';
import { accountsController } from '@/di/users.di';
import { webServerErrorHandler } from '@/di/entrypoints.di';

export const webServer = new WebServer([accountsController], {
  port: config.webServer.port,
  prefix: '/api',
});

webServer.onError(webServerErrorHandler);
