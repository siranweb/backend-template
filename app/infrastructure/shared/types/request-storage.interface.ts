import { AsyncLocalStorage } from 'node:async_hooks';

export interface IRequestStorage extends AsyncLocalStorage<RequestStorageStore> {}

export type RequestStorageStore = {
  requestId: string;
};
