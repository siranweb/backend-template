import { RegistrationHash } from 'awilix/lib/container';
import { Resolver } from 'awilix';

export interface IModule {
  readonly name: string;
  readonly registrations: RegistrationHash;
  init(): void;
  use(module: IModule): void;
  register<T>(key: string | symbol, registration: Resolver<T>): void;
  resolve<T>(key: string | symbol): T;
}
