interface EventHandlerData {
  event: string;
  handler: any;
}

export class WsRouter {
  private readonly eventHandlers: Map<string, EventHandlerData> = new Map();

  public add(event: string, handler: any): void {
    if (this.eventHandlers.has(event)) {
      throw new Error(`Event ${event} already registered`);
    }

    this.eventHandlers.set(event, {
      event: event,
      handler,
    });
  }

  public resolve(event: string): EventHandlerData | null {
    return this.eventHandlers.get(event);
  }
}
