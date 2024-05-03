import { HandlerFunc, ChainFunc, IChainHandler } from '@/lib/web-server';

export interface IControllerDefinition {
  handlers: HandlerState[];
  controller: ControllerState;
  updateHandlerDefinition(handler: HandlerFunc, fields: UpdateHandlerDefinitionFields): void;
  updateControllerDefinition(fields: UpdateControllerDefinitionFields): void;
}

export type HandlerState = {
  handler: HandlerFunc;
  method: string;
  path?: string;
  chain?: (ChainFunc | IChainHandler)[];
};

export type ControllerState = {
  prefix?: string;
};

export type UpdateHandlerDefinitionFields = {
  method?: string;
  path?: string;
  chain?: (ChainFunc | IChainHandler)[];
};

export type UpdateControllerDefinitionFields = {
  prefix?: string;
};
