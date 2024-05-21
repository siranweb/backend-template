import { defineEventHandler, H3Event, HTTPMethod, Router } from 'h3';
import { IController } from '@/infrastructure/web-server/types/controller.interface';
import { HandlerFunc, IChainHandler } from '@/infrastructure/web-server/types/shared';
import { errorHandler } from '@/infrastructure/web-server/di';

export function registerController(router: Router, controller: IController): void {
  const { controller: controllerState, handlers } = controller.definition;

  handlers.forEach((handlerState) => {
    if (!handlerState.method) return;

    const path = (controllerState.prefix ?? '') + (handlerState.path ?? '');
    const handler = withErrorHandler(
      withChain(handlerState.handler.bind(controller), handlerState.chain),
    );

    router.add(
      path,
      defineEventHandler(handler),
      handlerState.method.toLowerCase() as Lowercase<HTTPMethod>,
    );
  });
}

function withChain(handler: HandlerFunc, chain: IChainHandler[]): HandlerFunc {
  let lastFunc = handler;
  for (const chainHandler of chain.reverse()) {
    const chainFunc = chainHandler.handle.bind(chainHandler);
    const prev = lastFunc;
    lastFunc = (event) => chainFunc(event, prev);
  }
  return lastFunc;
}

function withErrorHandler(handler: HandlerFunc): HandlerFunc {
  return async (event: H3Event) => {
    try {
      return await handler(event);
    } catch (error: unknown) {
      errorHandler.handle(error);
    }
  };
}
