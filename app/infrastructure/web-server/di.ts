import { Router } from 'h3';
import { asClass, asFunction, Resolver } from 'awilix';
import { RequestLogger } from '@/infrastructure/web-server/request-logger';
import { ControllerInitializer } from '@/infrastructure/web-server/controllers-definition/controller-initializer';
import { makeApiRouter } from '@/infrastructure/web-server/api.router';
import { makeDocsRouter } from '@/infrastructure/web-server/docs/docs.router';
import { appDi } from '@/infrastructure/ioc-container';
import { IRequestLogger } from '@/infrastructure/web-server/types/request-logger.interface';
import { IControllerInitializer } from '@/infrastructure/web-server/controllers-definition/types/controller-initializer.interface';
import { WebServer } from '@/infrastructure/web-server/index';
import { IWebServer } from '@/infrastructure/web-server/types/web-server.interface';
import { OpenApi } from '@/infrastructure/web-server/docs/open-api';
import { IOpenApi } from '@/infrastructure/web-server/types/open-api-builder.interface';
import { ControllersState } from '@/infrastructure/web-server/controllers-definition/controllers-state';
import { IControllersState } from '@/infrastructure/web-server/controllers-definition/types/controllers-state.interface';
import { AuthChain } from '@/infrastructure/web-server/chain-handlers/auth.chain';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';
import { LogExampleChain } from '@/infrastructure/web-server/chain-handlers/log-example.chain';

appDi.register({
  openApi: asClass(OpenApi).singleton() satisfies Resolver<IOpenApi>,
  webServer: asClass(WebServer).singleton() satisfies Resolver<IWebServer>,
  requestLogger: asClass(RequestLogger).singleton() satisfies Resolver<IRequestLogger>,
  apiRouter: asFunction(makeApiRouter).singleton() satisfies Resolver<Router>,
  docsRouter: asFunction(makeDocsRouter).singleton() satisfies Resolver<Router>,
  controllersState: asClass(ControllersState).singleton() satisfies Resolver<IControllersState>,
  apiControllerInitializer: asClass(
    ControllerInitializer,
  ).singleton() satisfies Resolver<IControllerInitializer>,
  authChain: asClass(AuthChain).singleton() satisfies Resolver<IChainHandler>,
  logExampleChain: asClass(LogExampleChain).singleton() satisfies Resolver<IChainHandler>,
});
