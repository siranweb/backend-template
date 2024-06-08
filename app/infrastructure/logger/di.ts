import { asClass, Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { Logger } from '@/infrastructure/logger/index';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';

appDi.register({
  logger: asClass(Logger) satisfies Resolver<ILogger>,
});
