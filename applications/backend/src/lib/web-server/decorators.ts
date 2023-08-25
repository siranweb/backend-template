import {
  controllerMetadataSymbol,
  ControllerMetadata,
  endpointMetadataSymbol,
  EndpointMetadata,
  getDefaultEndpointMetadata,
} from './index';
import Koa from 'koa';

export const Controller = (prefix: string = ''): any => {
  return (target: any) => {
    const metadata: ControllerMetadata = {
      prefix,
    };
    Reflect.set(target, controllerMetadataSymbol, metadata);
  };
};

export const Middlewares = (...middlewares: Koa.Middleware[]): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata = (Reflect.get(handler, endpointMetadataSymbol) as EndpointMetadata) ?? getDefaultEndpointMetadata();

    metadata.middlewares = middlewares;
    Reflect.set(handler, endpointMetadataSymbol, metadata);
  };
};

export const Endpoint = (method: string, path: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata = (Reflect.get(handler, endpointMetadataSymbol) as EndpointMetadata) ?? getDefaultEndpointMetadata();

    metadata.path = path;
    metadata.method = method;
    Reflect.set(handler, endpointMetadataSymbol, metadata);
  };
};
