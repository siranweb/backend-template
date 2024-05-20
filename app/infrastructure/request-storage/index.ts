import { AsyncLocalStorage } from 'node:async_hooks';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';
export const requestStorage: IRequestStorage = new AsyncLocalStorage();
