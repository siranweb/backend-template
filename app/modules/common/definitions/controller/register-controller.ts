import path from 'node:path/posix';
import { IWebServer } from '@/lib/web-server/types/web-server.interface';
import { IController } from '@/modules/common/types/controller.interface';
import { IRedoc } from '@/lib/redoc';
import { checkOpenApiIsCorrectMethod } from '@/lib/redoc/utils';

export function registerController(
  webServer: IWebServer,
  redoc: IRedoc,
  controller: IController,
): void {
  const { controller: controllerState, handlers } = controller.definition;

  handlers.forEach((handlerState) => {
    const route = path.join(controllerState.prefix ?? '', handlerState.path ?? '');

    webServer.handle({
      method: handlerState.method,
      handler: handlerState.handler.bind(controller),
      path: path.join(controllerState.prefix ?? '', handlerState.path ?? ''),
      chain: handlerState.chain,
    });

    const lowerCasedMethod = handlerState.method.toLowerCase();
    if (!checkOpenApiIsCorrectMethod(lowerCasedMethod)) {
      return;
    }

    redoc.addPath(route, lowerCasedMethod, {
      tags: controllerState.tags,
      summary: handlerState.openApiRequest.summary,
      description: handlerState.openApiRequest.description,
      body: handlerState.openApiRequest.body,
      queryParams: handlerState.openApiRequest.search,
    });
  });
}
