import { Logger } from '@/infrastructure/logger/index';
import { IConfig, NodeEnv } from '@/infrastructure/config/types/config.interface';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';

export function makeLogger(
  requestStorage: IRequestStorage,
  config: IConfig,
  context?: string,
): Logger {
  return new Logger({
    context,
    pretty: config.nodeEnv === NodeEnv.DEVELOPMENT,
    level: config.nodeEnv === NodeEnv.DEVELOPMENT ? 'trace' : 'info',
    requestStorage,
  });
}
