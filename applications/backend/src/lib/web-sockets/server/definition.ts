import { markInitializable } from '@/lib/initializer';
import { ChainFunc, WsHandlerMetadata } from './types';

export const wsGatewayMetadataSymbol = Symbol('wsGatewayMetadata');
export const wsHandlerMetadataSymbol = Symbol('wsHandlerMetadata');

export const WsGateway = (): any => {
  return (target: any) => {
    markInitializable(target);
    const metadata = {};
    Reflect.set(target, wsGatewayMetadataSymbol, metadata);
  };
};

export const WsHandler = (eventName: string, params: WsHandlerParams = {}): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata: WsHandlerMetadata = {
      event: eventName,
      chain: params.chain ?? [],
    };

    Reflect.set(handler, wsHandlerMetadataSymbol, metadata);
  };
};

interface WsHandlerParams {
  chain?: ChainFunc[];
}
