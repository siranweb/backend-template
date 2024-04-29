import path from 'node:path/posix';
import { IWebServer } from '@/lib/web-server/types/web-server.interface';
import { IController } from '@/app/common/interfaces/controller.interface';

export function registerController(webServer: IWebServer, controller: IController): void {
  const { controller: controllerState, handlers } = controller.definition;

  handlers.forEach(handlerState => {
    webServer.handle({
      method: handlerState.method,
      handler: handlerState.handler,
      path: path.join(controllerState.prefix ?? '', handlerState.path ?? ''),
      chain: handlerState.chain,
    })
  });
}
