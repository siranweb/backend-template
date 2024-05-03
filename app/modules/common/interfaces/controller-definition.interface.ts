import { HandlerFunc } from '@/lib/web-server';
import { ChainFunc } from '@/lib/web-server/types/shared';

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
  chain?: ChainFunc[];
};

export type ControllerState = {
  prefix?: string;
};

export type UpdateHandlerDefinitionFields = {
  method?: string;
  path?: string;
  chain?: ChainFunc[];
};

export type UpdateControllerDefinitionFields = {
  prefix?: string;
};
