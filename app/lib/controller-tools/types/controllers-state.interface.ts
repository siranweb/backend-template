import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { HTTPMethod } from 'h3';
import { IChainHandler } from '@/infrastructure/controllers-state/types/chain-handler.interface';
import { ZodType } from 'zod';

export interface IControllersState {
  getControllerDef(controller: ControllerPrototype): ControllerDef | null;
  updateControllerState(controller: ControllerPrototype, def: UpdateControllerDef): void;
  updateHandlerState(
    controller: ControllerPrototype,
    handler: Handler,
    def: UpdateHandlerDef,
  ): void;
}

export type Handler = HandlerFunc;

export type UpdateControllerDef = {
  prefix?: string;
  tags?: string[];
  chain?: IChainHandler[];
  responses?: ResponseDef[];
};

export type UpdateHandlerDef = {
  path?: string;
  method?: HTTPMethod;
  chain?: IChainHandler[];
  responses?: ResponseDef[];
  bodies?: BodyDef[];
  params?: ZodType[];
  queries?: ZodType[];
  cookies?: ZodType[];
  headers?: ZodType[];
};

export type ControllerDef = {
  controller: ControllerPrototype;
  handlers: Map<Handler, HandlerDef>;
  prefix: string;
  tags: string[];
  chain: IChainHandler[];
  responses: ResponseDef[];
};

export type HandlerDef = {
  handler: Handler;
  path: string;
  chain: IChainHandler[];
  method: HTTPMethod;
  responses: ResponseDef[];
  bodies: BodyDef[];
  params: ZodType[];
  queries: ZodType[];
  cookies: ZodType[];
  headers: ZodType[];
};

export type ResponseDef = {
  statusCode: number;
  contentType: string;
  schema?: ZodType;
};

export type BodyDef = {
  contentType: string;
  schema?: ZodType;
};
