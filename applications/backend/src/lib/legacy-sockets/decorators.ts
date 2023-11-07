import { eventHandlerMetadataSymbol, getDefaultEventHandlerMetadata, socketsResolverMetadataSymbol } from './metadata';
import { EventHandlerMetadata, SocketMiddleware } from './types';

export const SocketsResolver = (): any => {
  return (target: any) => {
    const metadata = {};
    Reflect.set(target, socketsResolverMetadataSymbol, metadata);
  };
};

export const EventHandler = (eventName: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata = (Reflect.get(handler, eventHandlerMetadataSymbol) as EventHandlerMetadata) ?? getDefaultEventHandlerMetadata();

    metadata.eventName = eventName;
    Reflect.set(handler, eventHandlerMetadataSymbol, metadata);
  };
};

export const SocketsMiddlewares = (...middlewares: SocketMiddleware[]): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata = (Reflect.get(handler, eventHandlerMetadataSymbol) as EventHandlerMetadata) ?? getDefaultEventHandlerMetadata();

    metadata.middlewares = middlewares;
    Reflect.set(handler, eventHandlerMetadataSymbol, metadata);
  };
};