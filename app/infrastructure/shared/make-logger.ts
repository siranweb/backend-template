import { Logger } from '@/lib/logger';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { IRequestStorage } from '@/infrastructure/shared/types/request-storage.interface';
import { inject } from 'di-wise';
import { sharedModuleTokens } from './shared.module';

export function makeLogger(
  requestStorage: IRequestStorage = inject(sharedModuleTokens.requestStorage),
  config: IConfig = inject(sharedModuleTokens.config),
): Logger {
  return new Logger(requestStorage, config);
}
