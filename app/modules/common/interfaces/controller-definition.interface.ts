import { HandlerFunc } from '@/lib/web-server';
import { ChainFunc } from '@/lib/web-server/types/shared';

export interface IControllerDefinition {
  handlers: HandlerState[];
  controller: ControllerState;
  updateHandlerDescription(handler: HandlerFunc, fields: UpdateHandlerDefinitionFields): void;
}

export type HandlerState = {
  handler: HandlerFunc;
  method: string;
  path?: string;
  chain?: ChainFunc[];
};

export type ControllerState = {
  prefix?: string;
  chain?: ChainFunc[];
};

export type UpdateHandlerDefinitionFields = {
  method?: string;
  path?: string;
  chain?: ChainFunc[];
};
