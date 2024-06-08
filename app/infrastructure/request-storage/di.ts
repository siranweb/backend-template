import { asClass, Resolver } from 'awilix';
import { di } from '@/infrastructure/ioc-container';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  IRequestStorage,
  RequestStorageStore,
} from '@/infrastructure/request-storage/types/request-storage.interface';

di.register({
  requestStorage: asClass(
    AsyncLocalStorage<RequestStorageStore>,
  ).singleton() satisfies Resolver<IRequestStorage>,
});
