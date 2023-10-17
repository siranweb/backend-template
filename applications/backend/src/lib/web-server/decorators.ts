import {
  controllerMetadataSymbol,
  endpointMetadataSymbol,
  getDefaultEndpointMetadata,
} from './metadata';
import { ControllerMetadata, EndpointMetadata } from './types';
import { HTTPMethod } from "find-my-way";

export const Controller = (): any => {
  return (target: any) => {
    const metadata: ControllerMetadata = {};
    Reflect.set(target, controllerMetadataSymbol, metadata);
  };
};

// TODO chains?
// export const Middlewares = (...middlewares: Koa.Middleware[]): any => {
//   return (target: any, propertyKey: string) => {
//     const handler = target[propertyKey];
//     const metadata =
//       (Reflect.get(handler, endpointMetadataSymbol) as EndpointMetadata) ??
//       getDefaultEndpointMetadata();
//
//     metadata.middlewares = middlewares;
//     Reflect.set(handler, endpointMetadataSymbol, metadata);
//   };
// };

export const Endpoint = (method: HTTPMethod, path: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const storedMetadata = Reflect.get(handler, endpointMetadataSymbol) as EndpointMetadata | null;
    const metadata = storedMetadata ?? getDefaultEndpointMetadata();

    metadata.path = path;
    metadata.method = method;
    Reflect.set(handler, endpointMetadataSymbol, metadata);
  };
};
