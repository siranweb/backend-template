import { WsHandlerMetadata } from './types';

export const wsGatewayMetadataSymbol = Symbol('wsGatewayMetadata');
export const wsHandlerMetadataSymbol = Symbol('wsHandlerMetadata');

export const getDefaultWsHandlerMetadata = (): WsHandlerMetadata => {
  return {
    event: '',
  };
};
