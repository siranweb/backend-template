import { Module } from '@/lib/module';
import { asClass } from 'awilix';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  IRequestStorage,
  RequestStorageStore,
} from '@/infrastructure/request-storage/types/request-storage.interface';

export const requestStorageModule = new Module('requestStorage');

requestStorageModule.register<IRequestStorage>(
  'requestStorage',
  asClass(AsyncLocalStorage<RequestStorageStore>).singleton(),
);
