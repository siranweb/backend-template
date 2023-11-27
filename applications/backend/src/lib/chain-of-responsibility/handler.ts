export abstract class CORHandler<HandleArg> {
  protected next: CORHandler<HandleArg> = null;

  public abstract handle(data: HandleArg): void | Promise<void>;
  public setNext(handler: CORHandler<HandleArg>): void {
    this.next = handler;
  }
}