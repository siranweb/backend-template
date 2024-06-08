import { asFunction, Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { AppDatabase, makeAppDatabase } from '@/infrastructure/app-database/database';

appDi.register({
  appDatabase: asFunction(makeAppDatabase).singleton() satisfies Resolver<AppDatabase>,
});
