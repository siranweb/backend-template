import { asFunction, Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { IAppDatabase, makeAppDatabase } from '@/infrastructure/app-database/database';

appDi.register({
  db: asFunction(makeAppDatabase).singleton() satisfies Resolver<IAppDatabase>,
});
