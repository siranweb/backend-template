import { Module } from '@/lib/module';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { webApiModule } from '@/infrastructure/web-api/web-api.module';
import { webServerModule } from '@/infrastructure/web-server/web-server.module';
import { databaseModule } from '@/infrastructure/database/database.module';
import { schedulerModule } from '@/infrastructure/scheduler/scheduler.module';

export const rootModule = new Module('root');

rootModule.use(sharedModule);
rootModule.use(databaseModule);
rootModule.use(schedulerModule);
rootModule.use(webApiModule);
rootModule.use(webServerModule);
