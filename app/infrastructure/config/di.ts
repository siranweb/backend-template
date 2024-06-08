import awilix, { Resolver } from 'awilix';
import { di } from '@/infrastructure/ioc-container';
import { config, IConfig } from '@/infrastructure/config';

di.register({
  config: awilix.asValue(config) satisfies Resolver<IConfig>,
});
