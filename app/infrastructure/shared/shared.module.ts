import { Module } from '@/lib/module';
import { makeLogger } from '@/infrastructure/shared/make-logger';
import { asClass, asFunction, asValue } from 'awilix';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { config } from '@/infrastructure/shared/config';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import {
  IRequestStorage,
  RequestStorageStore,
} from '@/infrastructure/shared/types/request-storage.interface';
import { AsyncLocalStorage } from 'node:async_hooks';

export const sharedModule = new Module('shared');

sharedModule.register<IRequestStorage>(
  'requestStorage',
  asClass(AsyncLocalStorage<RequestStorageStore>).singleton(),
);
sharedModule.register<IConfig>('config', asValue(config));
sharedModule.register<ILogger>('logger', asFunction(makeLogger));
