interface CommandHandlerData {
  command: string;
  handler: any;
}

export class WsRouter {
  private readonly commandHandlers: Map<string, CommandHandlerData> = new Map();

  public add(command: string, handler: any): void {
    if (this.commandHandlers.has(command)) {
      throw new Error(`Command ${command} already registered`);
    }

    this.commandHandlers.set(command, {
      command,
      handler,
    });
  }

  public resolve(command: string): CommandHandlerData | null {
    return this.commandHandlers.get(command);
  }
}
