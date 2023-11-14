import http from "node:http";
import { WebSocket, WebSocketServer } from 'ws';
import { WsRouter } from '../routing/ws-router';
import { WsHandlerMetadata, Gateway, Context, WsHandler, WsGatewayMetadata } from './types';
import { wsHandlerMetadataSymbol, wsGatewayMetadataSymbol } from './metadata';
import { EventEmitter } from "node:events";

interface Config {
  port: number;
}

enum WsServerEvent {
  ERROR = 'error',
  EVENT = 'event',
  EVENT_FINISHED = 'event_finished',
}

export type OnErrorHandler = (error: any, ws: WebSocket) => any | Promise<any>;
export type OnEventHandler = (ctx: Context) => any | Promise<any>;
export type OnEventFinishedHandler = (ctx: Context) => any | Promise<any>;

export class WsServer {
  private readonly wss: WebSocketServer;
  private readonly eventEmitter: EventEmitter = new EventEmitter();
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
    return new Promise( (resolve, reject) => {
      try {
        this.init();
        this.httpServer.listen(this.config.port, () => resolve());
      } catch (e) {
        reject(e);
      }
    });
  }

  public onError(clb: OnErrorHandler): void {
    this.eventEmitter.on(WsServerEvent.ERROR, clb);
  }

  public onEvent(clb: OnEventHandler): void {
    this.eventEmitter.on(WsServerEvent.EVENT, clb);
  }

  public onEventFinished(clb: OnEventFinishedHandler): void {
    this.eventEmitter.on(WsServerEvent.EVENT_FINISHED, clb);
  }

  private init() {
    this.registerResolvers();
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', async (buffer) => {
        const ctx = this.getBaseContext(ws);
        this.eventEmitter.emit(WsServerEvent.EVENT, ctx);
        const message = JSON.parse(buffer.toString());

        const isCorrectMessage = message.event && typeof message.data === 'object' && message.data !== null
        if (!isCorrectMessage) {
          const error = new Error(`Bad message ${message}`);
          this.eventEmitter.emit(WsServerEvent.ERROR, error, ws);
          return;
        }
        ctx.data = message.data;

        const eventHandlerData = this.wsRouter.resolve(message.event);
        if (!eventHandlerData) {
          const error = new Error(`Unknown event ${message.event}`);
          this.eventEmitter.emit(WsServerEvent.ERROR, error, ws);
          return;
        }

        const wsHandler = eventHandlerData.handler as WsHandler;
        try {
          await wsHandler(ctx);
        } catch (e) {
          this.eventEmitter.emit(WsServerEvent.ERROR, e, ws);
        } finally {
          this.eventEmitter.emit(WsServerEvent.EVENT_FINISHED, ctx);
        }
      });
    });
  }

  private getBaseContext(ws: WebSocket): Context {
    return {
      ws,
      data: undefined,
      meta: {
        timestamp: Date.now(),
      }
    }
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

      const { event } = handlerMetadata as WsHandlerMetadata;

      this.wsRouter.add(event, handler.bind(gateway));
    }
  }

  private getHandlerMetadata(handler: any): WsHandlerMetadata | null {
    return Reflect.get(handler, wsHandlerMetadataSymbol);
  }

  private checkIsHandler(handlerMetadata: WsHandlerMetadata | null, handler: any): boolean {
    return !!handlerMetadata?.event && typeof handler === 'function';
  }
}
