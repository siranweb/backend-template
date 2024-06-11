import { EventHandler, HTTPMethod } from 'h3';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';
import { HandlerFunc } from './shared';

export interface IControllerDefinition {
  handlers: HandlerState[];
  controller: ControllerState;
  updateHandlerDefinition(handler: HandlerFunc, fields: UpdateHandlerDefinitionFields): void;
  updateControllerDefinition(fields: UpdateControllerDefinitionFields): void;
}

export type HandlerState = {
  handler: EventHandler;
  method: HTTPMethod | '';
  path?: string;
  chain: IChainHandler[];
};

export type ControllerState = {
  prefix?: string;
};

export type UpdateHandlerDefinitionFields = {
  method?: HTTPMethod | '';
  path?: string;
  chain?: IChainHandler[];
};

export type UpdateControllerDefinitionFields = {
  prefix?: string;
};
