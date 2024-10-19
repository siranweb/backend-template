import awilix, {
  AwilixContainer,
  createContainer,
  Resolver,
  BuildResolver,
  RegistrationHash,
} from 'awilix';
import { IModule } from '@/lib/module/types/module.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';

export class Module implements IModule {
  private static readonly container: AwilixContainer = createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    strict: true,
  });

  private registrationHash: RegistrationHash = {};

  constructor(public readonly name: string) {}

  get registrations(): RegistrationHash {
    return this.registrationHash;
  }

  public init(): void {
    Module.container.register(this.registrationHash);
  }

  public use(module: IModule) {
    this.registrationHash = { ...this.registrationHash, ...module.registrations };
  }

  public register<T>(key: string | symbol, registration: Resolver<T>) {
    this.registrationHash[key] = this.withNamedLogger(key, registration);
  }

  public resolve<T>(key: string | symbol): T {
    return Module.container.resolve<T>(key);
  }

  private withNamedLogger<T>(key: string | symbol, resolver: Resolver<T>): Resolver<T> {
    const buildResolver = resolver as BuildResolver<any>;
    let logger = Module.container.resolve<ILogger>('logger', { allowUnregistered: true });
    if (!logger) {
      this.init();
    }
    logger = Module.container.resolve<ILogger>('logger', { allowUnregistered: true });

    if (!logger || key === 'logger') {
      return resolver;
    }

    return buildResolver.inject(() => ({
      logger: logger.child(key.toString()),
    }));
  }
}
