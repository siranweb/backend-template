import { markInitializable } from '@/lib/initializer';
import { EndpointMetadata, ControllerMetadata } from './types';

export const controllerMetadataSymbol = Symbol('controllerMetadata');
export const endpointMetadataSymbol = Symbol('endpointMetadata');

const getDefaultEndpointMetadata = (): EndpointMetadata => {
  return {
    path: '',
    method: 'GET',
  };
};

export const Controller = (prefix?: string): any => {
  return (target: any) => {
    markInitializable(target);
    const metadata: ControllerMetadata = {};
    Reflect.set(target, controllerMetadataSymbol, metadata);
  };
};

export const Endpoint = (method: string, path: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const storedMetadata = Reflect.get(handler, endpointMetadataSymbol) as EndpointMetadata | null;
    const metadata = storedMetadata ?? getDefaultEndpointMetadata();

    metadata.path = path;
    metadata.method = method;
    Reflect.set(handler, endpointMetadataSymbol, metadata);
  };
};
