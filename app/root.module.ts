import { Module } from '@/lib/module';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { webApiModule } from '@/infrastructure/web-api/web-api.module';
import { webServerModule } from '@/infrastructure/web-server/web-server.module';

export const rootModule = new Module('root');

rootModule.use(sharedModule);
rootModule.use(webApiModule);
rootModule.use(webServerModule);
