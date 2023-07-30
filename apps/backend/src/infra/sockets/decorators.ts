import {
  EventHandlerMetadata,
  eventHandlerMetadataSymbol,
  getDefaultEventHandlerMetadata,
  SocketMiddleware,
  SocketsResolverMetadata,
  socketsResolverMetadataSymbol,
} from './index';

export const SocketEventsResolver = (namespace: string): any => {
  return (target: any) => {
    const metadata: SocketsResolverMetadata = {
      namespace,
    };
    Reflect.set(target, socketsResolverMetadataSymbol, metadata);
  };
};

export const EventHandler = (eventName: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata =
      (Reflect.get(handler, eventHandlerMetadataSymbol) as EventHandlerMetadata) ??
      getDefaultEventHandlerMetadata();

    metadata.eventName = eventName;
    Reflect.set(handler, eventHandlerMetadataSymbol, metadata);
  };
};

export const SocketMiddlewares = (...middlewares: SocketMiddleware[]): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata =
      (Reflect.get(handler, eventHandlerMetadataSymbol) as EventHandlerMetadata) ??
      getDefaultEventHandlerMetadata();

    metadata.middlewares = middlewares;
    Reflect.set(handler, eventHandlerMetadataSymbol, metadata);
  };
};
