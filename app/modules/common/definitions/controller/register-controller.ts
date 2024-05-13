import path from 'node:path/posix';
import { IWebServer } from '@/lib/web-server/types/web-server.interface';
import { IController } from '@/modules/common/types/controller.interface';
import { IRedoc } from '@/lib/redoc';
import { checkIsCorrectMethod } from '@/lib/redoc/utils';

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
    if (!checkIsCorrectMethod(lowerCasedMethod)) {
      return;
    }

    console.log(handlerState);

    redoc.addPath(route, lowerCasedMethod, {
      tags: controllerState.tags,
      summary: handlerState.openApiRoute.summary,
      description: handlerState.openApiRoute.description,
      body: handlerState.openApiRoute.body,
      queryParams: handlerState.openApiRoute.search,
    });
  });
}
