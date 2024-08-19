import process from 'node:process';
import 'zod-openapi/extend';
import '@/di';
import { IAppDatabase } from '@/infrastructure/app-database/database';
import { appDi } from '@/infrastructure/ioc-container';
import { IWebServer } from '@/infrastructure/web-server/types/web-server.interface';
import { IScheduler } from '@/infrastructure/scheduler/types/scheduler.interface';
import { IControllerInitializer } from '@/infrastructure/web-server/controllers-definition/types/controller-initializer.interface';

const webServer = appDi.resolve<IWebServer>('webServer');
const db = appDi.resolve<IAppDatabase>('db');
const scheduler = appDi.resolve<IScheduler>('scheduler');
const apiControllerInitializer = appDi.resolve<IControllerInitializer>('apiControllerInitializer');
const usersController = appDi.resolve('usersController');
const exampleController = appDi.resolve('exampleController');

// TODO apiControllerInitializer move out?
apiControllerInitializer.init(usersController).init(exampleController);
webServer.start();
scheduler.start();

const shutdown = () => {
  Promise.allSettled([webServer.stop(), db.destroy()]).finally(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
