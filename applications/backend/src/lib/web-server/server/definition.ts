import { markInitializable } from '@/lib/initializer';
import { ChainFunc, ControllerMetadata, EndpointMetadata } from './types';

export const controllerMetadataSymbol = Symbol('controllerMetadata');
export const endpointMetadataSymbol = Symbol('endpointMetadata');

export const Controller = (prefix?: string): any => {
  return (target: any) => {
    markInitializable(target);
    const metadata: ControllerMetadata = {
      prefix: prefix ?? '',
    };

    Reflect.set(target, controllerMetadataSymbol, metadata);
  };
};

export const Endpoint = (method: string, path: string, params: EndpointParams = {}): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata: EndpointMetadata = {
      path,
      method,
      chain: params.chain ?? [],
    };

    Reflect.set(handler, endpointMetadataSymbol, metadata);
  };
};

interface EndpointParams {
  chain?: ChainFunc[];
}
