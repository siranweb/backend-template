import { Module } from '@/lib/module';
import { makeLogger } from '@/infrastructure/shared/make-logger';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { config } from '@/infrastructure/shared/config';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import {
  IRequestStorage,
  RequestStorageStore,
} from '@/infrastructure/shared/types/request-storage.interface';
import { AsyncLocalStorage } from 'node:async_hooks';
import { inject, Type } from 'di-wise';

export const sharedModule = new Module('shared');

export const sharedModuleTokens = {
  requestStorage: Type<IRequestStorage>('requestStorage'),
  config: Type<IConfig>('config'),
  logger: Type<ILogger>('logger'),
};

sharedModule.register(sharedModuleTokens.requestStorage, {
  useClass: AsyncLocalStorage<RequestStorageStore>,
});

sharedModule.register(sharedModuleTokens.config, {
  useValue: config,
});

sharedModule.register(sharedModuleTokens.logger, {
  useFactory: makeLogger,
});

export function injectLogger(context: string) {
  return inject(sharedModuleTokens.logger).child(context);
}
