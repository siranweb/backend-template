import { asClass, Resolver } from 'awilix';
import { di } from '@/infrastructure/ioc-container';
import { Logger } from '@/infrastructure/logger/index';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';

di.register({
  logger: asClass(Logger) satisfies Resolver<ILogger>,
});
