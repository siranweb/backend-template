import { Logger } from '@/infrastructure/logger/index';
import { config, NodeEnv } from '@/infrastructure/config';
import { requestStorage } from '@/infrastructure/request-storage';

export function makeLogger(context?: string) {
  return new Logger({
    context,
    pretty: config.nodeEnv === NodeEnv.DEVELOPMENT,
    level: config.nodeEnv === NodeEnv.DEVELOPMENT ? 'trace' : 'info',
    requestStorage,
  });
}
