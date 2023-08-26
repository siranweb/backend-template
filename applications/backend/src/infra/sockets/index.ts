import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { eventHandlerMetadataSymbol, socketsResolverMetadataSymbol } from './metadata';
import { EventHandlerMetadata, Resolver, SocketMiddleware, SocketsResolverMetadata } from './types';
import { Config } from '@/infra/config';

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

  addMiddleware(middleware: SocketMiddleware) {
    // TODO
    // @ts-ignore
    this.socketsClient.use(middleware);
  }

  private registerResolvers() {
    for (const resolver of this.resolvers) {
      const resolverMetadata = this.getResolverMetadata(resolver);

      if (!resolverMetadata) {
        console.log(`${resolver.name} is not marked as sockets resolver`);
        continue;
      }

      this.registerHandlers(resolver);
    }
  }

  private getResolverMetadata(resolver: Resolver): SocketsResolverMetadata | null {
    return Reflect.get(
      resolver.constructor,
      socketsResolverMetadataSymbol,
    );
  }

  private registerHandlers(resolver: Resolver) {
    const prototype = Object.getPrototypeOf(resolver);
    const properties = Object.getOwnPropertyNames(prototype);
    for (const property of properties) {
      const handler = resolver[property];
      const handlerMetadata = this.getHandlerMetadata(handler);

      // Handler must be a function with specified event name
      const isEventHandler = this.checkIsHandler(handlerMetadata, handler);
      if (!isEventHandler) {
        continue;
      }

      const { eventName, middlewares } = handlerMetadata as EventHandlerMetadata;

      this.socketsClient.on('connection', async (socket: Socket) => {
        const next = this.buildHandlersChain(middlewares, socket, handler, resolver);
        socket.on(eventName, async (message: any) => {
          await next(message);
        });
      });
    }
  }

  private getHandlerMetadata(handler: any): EventHandlerMetadata | null {
    return Reflect.get(
      handler,
      eventHandlerMetadataSymbol,
    );
  }

  private checkIsHandler(handlerMetadata: EventHandlerMetadata | null, handler: any): boolean {
    return !!handlerMetadata?.eventName && typeof handler === 'function';
  }

  private buildHandlersChain(middlewares: SocketMiddleware[], socket: Socket, handler: any, resolver: Resolver) {
    return middlewares.reduceRight(
      (acc, middleware) => (message: any) => middleware(socket, message, acc),
      handler.bind(resolver),
    );
  }
}
