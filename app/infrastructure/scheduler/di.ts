import { asClass, Resolver } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { Scheduler } from '@/lib/scheduler';
import { IScheduler } from '@/lib/scheduler/types/scheduler.interface';

appDi.register({
  scheduler: asClass(Scheduler).singleton() satisfies Resolver<IScheduler>,
});
