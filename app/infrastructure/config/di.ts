import awilix, { Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { config } from '@/infrastructure/config';
import { IConfig } from '@/infrastructure/config/types/config.interface';

appDi.register({
  config: awilix.asValue(config) satisfies Resolver<IConfig>,
});
