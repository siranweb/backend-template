import { Router } from 'h3';
import { asClass, asFunction } from 'awilix';
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

export const webServerModule = new Module('webApi');
webServerModule.use(sharedModule);

webServerModule.register<IWebServer>('webServer', asClass(WebServer).singleton());
webServerModule.register<IRequestLogger>('requestLogger', asClass(RequestLogger).singleton());
webServerModule.register<Router>('apiRouter', asFunction(makeApiRouter).singleton());
webServerModule.register<Router>('docsRouter', asFunction(makeDocsRouter).singleton());
webServerModule.register<IOpenApiBuilder>('openApiBuilder', asClass(OpenApiBuilder).singleton());
webServerModule.register<IControllerInitializer>(
  'apiControllerInitializer',
  asClass(ControllerInitializer).singleton(),
);
