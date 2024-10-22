import { Provider, RegistrationOptions, Token } from 'di-wise';

export interface IModule {
  readonly name: string;
  import(module: IModule): void;
  register<Value>(
    token: Token<Value>,
    provider: Provider<Value>,
    options?: RegistrationOptions,
  ): void;
  resolve<T>(token: Token<T>): T;
}

export type TokenList<Values extends unknown[]> = {
  [Index in keyof Values]: Token<Values[Index]>;
};
