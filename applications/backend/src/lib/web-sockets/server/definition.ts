import { markInitializable } from '@/lib/initializer';
import { WsHandlerMetadata } from './types';

export const wsGatewayMetadataSymbol = Symbol('wsGatewayMetadata');
export const wsHandlerMetadataSymbol = Symbol('wsHandlerMetadata');

export const getDefaultWsHandlerMetadata = (): WsHandlerMetadata => {
  return {
    event: '',
  };
};

export const WsGateway = (): any => {
  return (target: any) => {
    markInitializable(target);
    const metadata = {};
    Reflect.set(target, wsGatewayMetadataSymbol, metadata);
  };
};

export const WsHandler = (eventName: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata = (Reflect.get(handler, wsHandlerMetadataSymbol) as WsHandlerMetadata) ?? getDefaultWsHandlerMetadata();

    metadata.event = eventName;
    Reflect.set(handler, wsHandlerMetadataSymbol, metadata);
  };
};
