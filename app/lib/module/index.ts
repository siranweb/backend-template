import { IModule, RegisterOptions } from '@/lib/module/types/module.interface';
import { Container, ErrorMessage, Provider, Scope, Token } from 'di-wise';

export class Module implements IModule {
  private readonly container: Container = new Container({
    defaultScope: Scope.Container,
  });

  private readonly publicTokens: Set<Token<any>> = new Set();
  private readonly privateTokens: Set<Token<any>> = new Set();

  constructor(public readonly name: string) {}

  public import(module: Module): void {
    module.publicTokens.forEach((token) => {
      const alreadyRegistered = !!this.container.registry.get(token);
      if (alreadyRegistered) {
        return;
      }

      const registration = module.container.registry.get(token);
      if (!registration) {
        return;
      }

      this.container.registry.set(token, registration);
      this.publicTokens.add(token);
    });
  }

  public register<Value>(
    token: Token<Value>,
    provider: Provider<Value>,
    options?: RegisterOptions,
  ): void {
    this.container.register(token, provider, options);

    if (options?.private) {
      this.privateTokens.add(token);
    } else {
      this.publicTokens.add(token);
    }
  }

  public resolve<T>(token: Token<T>): T {
    if (!this.publicTokens.has(token)) {
      throw new Error(`${ErrorMessage.UnresolvableToken} (${token}).`);
    }
    return this.container.resolve(token);
  }
}
