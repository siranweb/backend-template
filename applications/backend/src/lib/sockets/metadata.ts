import { EventHandlerMetadata } from './types';

export const socketsResolverMetadataSymbol = Symbol('socketsResolverMetadata');
export const eventHandlerMetadataSymbol = Symbol('eventHandlerMetadata');

export const getDefaultEventHandlerMetadata = (): EventHandlerMetadata => {
  return {
    eventName: '',
    middlewares: [],
  };
};
