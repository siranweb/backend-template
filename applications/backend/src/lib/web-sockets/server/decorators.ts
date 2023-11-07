import { wsHandlerMetadataSymbol, getDefaultWsHandlerMetadata, wsGatewayMetadataSymbol } from './metadata';
import { WsHandlerMetadata } from './types';

export const WsGateway = (): any => {
  return (target: any) => {
    const metadata = {};
    Reflect.set(target, wsGatewayMetadataSymbol, metadata);
  };
};

export const WsHandler = (eventName: string): any => {
  return (target: any, propertyKey: string) => {
    const handler = target[propertyKey];
    const metadata = (Reflect.get(handler, wsHandlerMetadataSymbol) as WsHandlerMetadata) ?? getDefaultWsHandlerMetadata();

    metadata.command = eventName;
    Reflect.set(handler, wsHandlerMetadataSymbol, metadata);
  };
};
