import { asClass, Resolver } from 'awilix';
import { di } from '@/infrastructure/ioc-container';
import { Scheduler } from '@/lib/scheduler';
import { IScheduler } from '@/lib/scheduler/types/scheduler.interface';

di.register({
  scheduler: asClass(Scheduler).singleton() satisfies Resolver<IScheduler>,
});
