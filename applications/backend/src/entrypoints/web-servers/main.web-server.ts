import { config } from '@/config';
import { WebServer } from '@/lib/web-server';
import { accountsController } from '@/di/users.di';
import { webServerAuth, webServerErrorHandler } from '@/di/entrypoints.di';

export const mainWebServer = new WebServer({
  port: config.webServer.port,
  prefix: '/api',
});

mainWebServer.handle({
  method: 'POST',
  path: '/accounts',
  handler: (ctx) => accountsController.createAccount(ctx),
});

mainWebServer.handle({
  method: 'POST',
  path: '/accounts/tokens',
  handler: (ctx) => accountsController.refreshTokens(ctx),
  chain: [webServerAuth],
});

mainWebServer.handle({
  method: 'POST',
  path: '/accounts/session',
  handler: (ctx) => accountsController.login(ctx),
});

mainWebServer.handle({
  method: 'DELETE',
  path: '/accounts/session',
  handler: (ctx) => accountsController.logout(ctx),
});

mainWebServer.onError(webServerErrorHandler);
