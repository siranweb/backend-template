import { asFunction, Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { makeLogger } from '@/infrastructure/logger/make-logger';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';
import { IConfig } from '@/infrastructure/config/types/config.interface';

appDi.register({
  logger: asFunction((requestStorage: IRequestStorage, config: IConfig) =>
    makeLogger(requestStorage, config, ''),
  ).singleton() satisfies Resolver<ILogger>,
});
