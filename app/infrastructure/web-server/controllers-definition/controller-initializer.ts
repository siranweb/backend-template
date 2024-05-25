import { IControllerInitializer } from '@/infrastructure/web-server/controllers-definition/types/controller-initializer.interface';
import { Controller, HandlerFunc } from '@/infrastructure/web-server/types/shared';
import { defineEventHandler, H3Event, HTTPMethod, Router } from 'h3';
import { IControllersState } from '@/infrastructure/web-server/controllers-definition/types/controllers-state.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { normalizeApiError } from '@/infrastructure/web-server/errors/normalize-api-error';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

export class ControllerInitializer implements IControllerInitializer {
  constructor(
    private readonly logger: ILogger,
    private readonly controllersState: IControllersState,
    private readonly router: Router,
  ) {}

  public init(controller: Controller): this {
    const controllerDef = this.controllersState.getControllerDef(controller.constructor.prototype);
    if (!controllerDef) {
      this.logger.warn(
        `${controller.constructor.name} not registered: not defined in controllers state.`,
      );
      return this;
    }

    controllerDef.handlers.forEach((handlerDef) => {
      const fullPath = (controllerDef.prefix ?? '') + (handlerDef.path ?? '');
      const fullChain = [...controllerDef.chain, ...handlerDef.chain];
      const boundHandler = handlerDef.handler.bind(controller);
      const handler = this.withErrorHandler(this.withChain(boundHandler, fullChain));

      this.router.add(
        fullPath,
        defineEventHandler(handler),
        handlerDef.method.toLowerCase() as Lowercase<HTTPMethod>,
      );
    });

    return this;
  }

  private withChain(handler: HandlerFunc, chain: IChainHandler[]): HandlerFunc {
    let lastFunc = handler;
    for (const chainHandler of chain.reverse()) {
      const chainFunc = chainHandler.handle.bind(chainHandler);
      const prev = lastFunc;
      lastFunc = (event) => chainFunc(event, prev);
    }
    return lastFunc;
  }

  private withErrorHandler(handler: HandlerFunc): HandlerFunc {
    return async (event: H3Event) => {
      try {
        return await handler(event);
      } catch (error: unknown) {
        throw normalizeApiError(error);
      }
    };
  }
}
