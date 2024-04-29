import { IWsRouter, StoredEventHandler } from '../../types/ws-router.interface';

export class WsRouter implements IWsRouter {
  private readonly eventHandlers: Map<string, StoredEventHandler> = new Map();

  public add(event: string, handler: any): void {
    if (this.eventHandlers.has(event)) {
      throw new Error(`Event ${event} already registered`);
    }

    this.eventHandlers.set(event, {
      event: event,
      handler,
    });
  }

  public resolve(event: string): StoredEventHandler | undefined {
    return this.eventHandlers.get(event);
  }
}
