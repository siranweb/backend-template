import { Module } from '@/lib/module';
import { IScheduler } from '@/lib/scheduler/types/scheduler.interface';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { Type } from 'di-wise';
import { makeScheduler } from '@/infrastructure/scheduler/make-scheduler';

export const schedulerModule = new Module('scheduler');
schedulerModule.import(sharedModule);

export const schedulerModuleTokens = {
  scheduler: Type<IScheduler>('scheduler'),
};

schedulerModule.register(schedulerModuleTokens.scheduler, {
  useFactory: makeScheduler,
});
