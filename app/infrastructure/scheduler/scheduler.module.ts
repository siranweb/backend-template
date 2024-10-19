import { asFunction } from 'awilix';
import { Module } from '@/lib/module';
import { makeScheduler } from '@/infrastructure/scheduler/make-scheduler';
import { IScheduler } from '@/lib/scheduler/types/scheduler.interface';
import { sharedModule } from '@/infrastructure/shared/shared.module';

export const schedulerModule = new Module('scheduler');
schedulerModule.use(sharedModule);

schedulerModule.register<IScheduler>('scheduler', asFunction(makeScheduler).singleton());
