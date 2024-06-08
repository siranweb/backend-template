import { asFunction, Resolver } from 'awilix';
import { di } from '@/infrastructure/ioc-container';
import { AppDatabase, makeAppDatabase } from '@/infrastructure/app-database/database';

di.register({
  appDatabase: asFunction(makeAppDatabase).singleton() satisfies Resolver<AppDatabase>,
});
