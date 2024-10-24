import { IControllerInitializer } from '@/infrastructure/web-server/types/controller-initializer.interface';
import { Controller, HandlerFunc } from '@/common/types/controller.types';
import { defineEventHandler, H3Event, HTTPMethod, Router } from 'h3';
import {
  ControllerDef,
  HandlerDef,
  IControllersState,
} from '@/lib/controller-tools/types/controllers-state.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { normalizeApiError } from '@/lib/errors/utils/normalize-api-error';
import { IChainHandler } from '@/infrastructure/controllers-state/types/chain-handler.interface';
import { IOpenApiBuilder } from '@/lib/open-api/types/open-api-builder.interface';
import { injectLogger } from '@/infrastructure/shared/shared.module';
import { inject } from 'di-wise';
import { controllersStateModuleTokens } from '@/infrastructure/controllers-state/controllers-state.module';

export class ControllerInitializer implements IControllerInitializer {
  constructor(
    private readonly logger: ILogger = injectLogger(ControllerInitializer.name),
    private readonly controllersState: IControllersState = inject(
      controllersStateModuleTokens.controllersState,
    ),
  ) {}

  public init(controller: Controller, router: Router, openApiBuilder?: IOpenApiBuilder): void {
    const controllerDef = this.controllersState.getControllerDef(controller.constructor.prototype);

    if (!controllerDef) {
      this.logger.warn(
        `${controller.constructor.name} not registered: not defined in controllers state.`,
      );
      return;
    }

    controllerDef.handlers.forEach((handlerDef) => {
      this.addToRouter(router, controllerDef, handlerDef);

      if (openApiBuilder) {
        this.addToOpenApi(openApiBuilder, controllerDef, handlerDef);
      }
    });
  }

  private addToRouter(router: Router, controllerDef: ControllerDef, handlerDef: HandlerDef): void {
    const method = this.getMethod(handlerDef);
    const fullPath = this.getFullPath(controllerDef, handlerDef);
    const fullChain = [...controllerDef.chain, ...handlerDef.chain];
    const boundHandler = handlerDef.handler.bind(controllerDef.controller);
    const handler = this.withErrorHandler(this.withChain(boundHandler, fullChain));

    router.add(fullPath, defineEventHandler(handler), method);
  }

  private addToOpenApi(
    openApiBuilder: IOpenApiBuilder,
    controllerDef: ControllerDef,
    handlerDef: HandlerDef,
  ): void {
    const method = this.getMethod(handlerDef);
    if (method === 'connect') return;
    const fullPath = this.getFullPath(controllerDef, handlerDef);

    openApiBuilder.addPath(method, fullPath, {
      responses: [...controllerDef.responses, ...handlerDef.responses],
      tags: controllerDef.tags,
      bodies: handlerDef.bodies,
      params: handlerDef.params,
      queries: handlerDef.queries,
      cookies: handlerDef.cookies,
      headers: handlerDef.headers,
    });
  }

  private getMethod(handlerDef: HandlerDef): Lowercase<HTTPMethod> {
    return handlerDef.method.toLowerCase() as Lowercase<HTTPMethod>;
  }

  private getFullPath(controllerDef: ControllerDef, handlerDef: HandlerDef): string {
    return (controllerDef.prefix ?? '') + (handlerDef.path ?? '');
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
