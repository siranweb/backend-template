import { Router } from 'h3';
import { RequestLogger } from '@/lib/web-server/request-logger';
import { ControllerInitializer } from '@/infrastructure/web-server/initializers/controller-initializer';
import { makeApiRouter } from '@/infrastructure/web-server/routers/api.router';
import { makeDocsRouter } from '@/infrastructure/web-server/routers/docs.router';
import { IRequestLogger } from '@/lib/web-server/types/request-logger.interface';
import { IControllerInitializer } from '@/infrastructure/web-server/types/controller-initializer.interface';
import { WebServer } from '@/lib/web-server';
import { IWebServer } from '@/lib/web-server/types/web-server.interface';
import { OpenApiBuilder } from '@/lib/open-api/open-api-builder';
import { IOpenApiBuilder } from '@/lib/open-api/types/open-api-builder.interface';
import { Module } from '@/lib/module';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { Type } from 'di-wise';

export const webServerModule = new Module('webApi');
webServerModule.import(sharedModule);

export const webServerModuleTokens = {
  webServer: Type<IWebServer>('webServer'),
  requestLogger: Type<IRequestLogger>('requestLogger'),
  apiRouter: Type<Router>('apiRouter'),
  docsRouter: Type<Router>('docsRouter'),
  openApiBuilder: Type<IOpenApiBuilder>('openApiBuilder'),
  apiControllerInitializer: Type<IControllerInitializer>('apiControllerInitializer'),
};

webServerModule.register(webServerModuleTokens.webServer, { useClass: WebServer });
webServerModule.register(webServerModuleTokens.requestLogger, { useClass: RequestLogger });
webServerModule.register(webServerModuleTokens.apiRouter, { useFactory: makeApiRouter });
webServerModule.register(webServerModuleTokens.docsRouter, { useFactory: makeDocsRouter });
webServerModule.register(webServerModuleTokens.openApiBuilder, { useClass: OpenApiBuilder });
webServerModule.register(webServerModuleTokens.apiControllerInitializer, {
  useClass: ControllerInitializer,
});
