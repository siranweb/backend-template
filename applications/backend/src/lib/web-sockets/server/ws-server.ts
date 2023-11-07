import http from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { WsRouter } from '../routing/ws-router';
import { WsHandlerMetadata, Gateway, Context, WsHandler, WsGatewayMetadata } from './types';
import { wsHandlerMetadataSymbol, wsGatewayMetadataSymbol } from './metadata';

interface Config {
  port: number;
}

export class WsServer {
  private readonly wss: WebSocketServer;
  private readonly wsRouter: WsRouter = new WsRouter();
  private readonly httpServer: http.Server;
  private readonly config: Config;
  private readonly gateways: Gateway[];

  constructor(gateways: Gateway[], config: Config) {
    this.config = config;
    this.gateways = gateways;
    this.httpServer = http.createServer();
    this.wss = new WebSocketServer({
      server: this.httpServer,
    });
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.init();
        this.httpServer.listen(this.config.port, () => resolve());
      } catch (e) {
        reject(e);
      }
    });
  }

  private init() {
    this.registerResolvers();
    this.wss.on('error', () => {
      // TODO
    });
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (buffer) => {
        const timestamp = Date.now();
        const message = JSON.parse(buffer.toString());
        // TODO error
        if (!message.command || typeof message.data !== 'object' || message.data === null) return;
        const commandHandlerData = this.wsRouter.resolve(message.command);
        if (!commandHandlerData) {
          // TODO Error
          return;
        }

        const wsHandler = commandHandlerData.handler as WsHandler;

        const context: Context = {
          ws,
          data: message.data,
          meta: {
            timestamp,
          },
        };

        // TODO different events
        wsHandler(context);
      });
    });
  }

  private registerResolvers() {
    for (const gateway of this.gateways) {
      const gatewayMetadata = this.getGatewayMetadata(gateway);

      if (!gatewayMetadata) {
        console.log(`${gateway.name} is not marked as websocket gateway`);
        continue;
      }

      this.registerHandlers(gateway);
    }
  }

  private getGatewayMetadata(gateway: Gateway): WsGatewayMetadata | null {
    return Reflect.get(gateway.constructor, wsGatewayMetadataSymbol);
  }

  private registerHandlers(gateway: Gateway) {
    const prototype = Object.getPrototypeOf(gateway);
    const properties = Object.getOwnPropertyNames(prototype);
    for (const property of properties) {
      const handler = gateway[property];
      const handlerMetadata = this.getHandlerMetadata(handler);

      const isHandler = this.checkIsHandler(handlerMetadata, handler);
      if (!isHandler) continue;

      const { command } = handlerMetadata as WsHandlerMetadata;

      this.wsRouter.add(command, handler.bind(gateway));
    }
  }

  private getHandlerMetadata(handler: any): WsHandlerMetadata | null {
    return Reflect.get(handler, wsHandlerMetadataSymbol);
  }

  private checkIsHandler(handlerMetadata: WsHandlerMetadata | null, handler: any): boolean {
    return !!handlerMetadata?.command && typeof handler === 'function';
  }
}
