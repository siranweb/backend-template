import { Module } from '@/lib/module';
import { makeLogger } from '@/infrastructure/shared/make-logger';
import { asFunction, asValue } from 'awilix';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { config } from '@/infrastructure/shared/config';
import { IConfig } from '@/infrastructure/shared/types/config.interface';

export const sharedModule = new Module('shared');
sharedModule.register<ILogger>('logger', asFunction(makeLogger));
sharedModule.register<IConfig>('config', asValue(config));
