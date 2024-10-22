import process from 'node:process';
import 'zod-openapi/extend';
import './common/base-path';
import { IAppDatabase } from '@/infrastructure/database/types/database.types';
import { IWebServer } from '@/lib/web-server/types/web-server.interface';
import { IControllerInitializer } from '@/infrastructure/web-server/types/controller-initializer.interface';
import { IOpenApiBuilder } from '@/lib/open-api/types/open-api-builder.interface';
import {
  webServerModule,
  webServerModuleTokens,
} from '@/infrastructure/web-server/web-server.module';
import { databaseModule, databaseModuleTokens } from '@/infrastructure/database/database.module';
import { webApiModule, webApiModuleTokens } from '@/infrastructure/web-api/web-api.module';
import { Controller } from '@/common/types/controller.types';
import { Router } from 'h3';

const apiControllerInitializer: IControllerInitializer = webServerModule.resolve(
  webServerModuleTokens.apiControllerInitializer,
);
const webServer: IWebServer = webServerModule.resolve(webServerModuleTokens.webServer);
const db: IAppDatabase = databaseModule.resolve(databaseModuleTokens.db);
const openApiBuilder: IOpenApiBuilder = webServerModule.resolve(
  webServerModuleTokens.openApiBuilder,
);
const apiRouter: Router = webServerModule.resolve(webServerModuleTokens.apiRouter);

const usersController: Controller = webApiModule.resolve(webApiModuleTokens.usersController);
const exampleController: Controller = webApiModule.resolve(webApiModuleTokens.exampleController);

apiControllerInitializer.init(usersController, apiRouter, openApiBuilder);
apiControllerInitializer.init(exampleController, apiRouter, openApiBuilder);

webServer.start();

const shutdown = () => {
  Promise.allSettled([webServer.stop(), db.destroy()]).finally(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
