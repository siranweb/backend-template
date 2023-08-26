import { EndpointMetadata } from '@/infra/web-server/types';

export const controllerMetadataSymbol = Symbol('controllerMetadata');
export const endpointMetadataSymbol = Symbol('endpointMetadata');

export const getDefaultEndpointMetadata = (): EndpointMetadata => {
  return {
    path: '',
    method: '',
    middlewares: [],
  };
};
