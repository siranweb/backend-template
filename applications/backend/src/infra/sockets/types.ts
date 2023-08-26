import { Socket } from 'socket.io';

export type SocketMiddleware = (socket: Socket, next: () => SocketMiddleware) => void;

export type Resolver = Record<string, any>;

export interface SocketsResolverMetadata {}

export interface EventHandlerMetadata {
  eventName: string;
  middlewares: SocketMiddleware[];
}
