import { Namespace, Server, Socket } from 'socket.io';
import { Config } from '@/infra/config';
import { createServer } from 'http';

export interface SocketsResolverMetadata {
  namespace: string;
}

export interface EventHandlerMetadata {
  eventName: string;
  middlewares: SocketMiddleware[];
}

export const socketsResolverMetadataSymbol = Symbol('socketsResolverMetadata');
export const eventHandlerMetadataSymbol = Symbol('eventHandlerMetadata');

export const getDefaultEventHandlerMetadata = (): EventHandlerMetadata => {
  return {
    eventName: '',
    middlewares: [],
  };
};

export type SocketMiddleware = (socket: Socket, next: SocketMiddleware) => any;

type Resolver = Record<string, any>;

export class Sockets {
  private readonly server;
  private readonly socketsClient;
  private readonly config;
  private readonly resolvers;
  constructor(config: Pick<Config, 'sockets'>, resolvers: Resolver[]) {
    this.server = createServer();
    this.socketsClient = new Server(this.server);
    this.config = config;
    this.resolvers = resolvers;
  }

  start() {
    try {
      this.registerResolvers();
      this.server.listen(this.config.sockets.port, () => {
        console.log(`Sockets server listening on port ${this.config.sockets.port}`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  private registerResolvers() {
    for (const resolver of this.resolvers) {
      const resolverMetadata = Reflect.get(
        resolver.constructor,
        socketsResolverMetadataSymbol,
      ) as SocketsResolverMetadata;
      if (!resolverMetadata) {
        console.log(`${resolver.name} is not marked as sockets resolver`);
        continue;
      }
      const { namespace } = resolverMetadata;
      const eventsNamespace = this.socketsClient.of(namespace);
      this.registerHandlers(resolver, eventsNamespace);
    }
  }

  private registerHandlers(resolver: Resolver, eventsNamespace: Namespace) {
    const prototype = Object.getPrototypeOf(resolver);
    const properties = Object.getOwnPropertyNames(prototype);
    for (const property of properties) {
      const handler = resolver[property];
      const handlerMetadata = Reflect.get(handler, eventHandlerMetadataSymbol) as EventHandlerMetadata;
      const isEventHandler = !!handlerMetadata && typeof handler === 'function';
      if (!isEventHandler) {
        continue;
      }

      const { eventName } = handlerMetadata;
      eventsNamespace.on(eventName, handler.bind(resolver));
    }
  }
}
