import awilix, { Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { config, IConfig } from '@/infrastructure/config';

appDi.register({
  config: awilix.asValue(config) satisfies Resolver<IConfig>,
});
