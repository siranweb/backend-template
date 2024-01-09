import { initializableSymbol } from './initializable';

// TODO get rid of reflect-metadata and use static instead

export class Initializer<
  InitializableItem extends Record<string, any>,
  Handler extends (...args: any[]) => any,
> {
  public init(
    initializableItems: InitializableItem[],
    registerClb: (toInitializeItem: InitializableItem, handlers: Handler[]) => void,
  ): void {
    for (const item of initializableItems) {
      const metadata = this.checkIsInitializable(item.constructor);

      if (!metadata) {
        console.log(`${item.constructor.name} is not marked for initialization`);
        continue;
      }

      const handlers = this.getHandlers(item);
      registerClb(item, handlers);
    }
  }

  private getHandlers(toInitializeItem: InitializableItem): Handler[] {
    const prototype = Object.getPrototypeOf(toInitializeItem);
    const properties = Object.getOwnPropertyNames(prototype);

    const handlers: Handler[] = [];
    for (const property of properties) {
      const handler = toInitializeItem[property];
      const isHandler = this.checkIsHandler(handler);
      if (isHandler) {
        handlers.push(handler);
      }
    }

    return handlers;
  }

  private checkIsInitializable(initializableItem: any): boolean {
    return Reflect.get(initializableItem, initializableSymbol);
  }

  private checkIsHandler(handler: any): boolean {
    return typeof handler === 'function';
  }
}
