import { asFunction, Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { makeScheduler } from '@/infrastructure/scheduler/make-scheduler';
import { IScheduler } from '@/infrastructure/scheduler/types/scheduler.interface';

appDi.register({
  scheduler: asFunction(makeScheduler).singleton() satisfies Resolver<IScheduler>,
});
