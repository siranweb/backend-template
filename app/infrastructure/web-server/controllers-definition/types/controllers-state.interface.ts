import { ControllerPrototype, HandlerFunc } from '@/infrastructure/web-server/types/shared';
import { HTTPMethod } from 'h3';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

export interface IControllersState {
  getControllerDef(controller: ControllerPrototype): ControllerDef | null;
  setControllerPrefix(controller: ControllerPrototype, prefix: string): void;
  setControllerChain(controller: ControllerPrototype, chain: IChainHandler[]): void;
  setHandlerPath(controller: ControllerPrototype, handler: Handler, path: string): void;
  setHandlerChain(controller: ControllerPrototype, handler: Handler, chain: IChainHandler[]): void;
  setHandlerMethod(controller: ControllerPrototype, handler: Handler, method: HTTPMethod): void;
}

export type Handler = HandlerFunc;

export type ControllerDef = {
  controller: ControllerPrototype;
  handlers: Map<Handler, HandlerDef>;
  prefix: string;
  chain: IChainHandler[];
};

export type HandlerDef = {
  handler: Handler;
  path: string;
  chain: IChainHandler[];
  method: HTTPMethod;
};
