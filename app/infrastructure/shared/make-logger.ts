import { Logger } from '@/lib/logger';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';

export function makeLogger(requestStorage: IRequestStorage, config: IConfig): Logger {
  return new Logger(requestStorage, config);
}
