import { AsyncLocalStorage } from 'node:async_hooks';

export type IRequestStorage = AsyncLocalStorage<RequestStorageStore>;

export type RequestStorageStore = {
  requestId: string;
};
