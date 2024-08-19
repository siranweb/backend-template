import '@/infrastructure/app-database/di';
import '@/infrastructure/config/di';
import '@/infrastructure/logger/di';
import '@/infrastructure/request-storage/di';
import '@/infrastructure/scheduler/di';
import '@/infrastructure/web-server/di';
import '@/domain/jwt/di';
import '@/domain/cryptography/di';
import '@/domain/users/di';
import '@/api/di';
import { appDi } from '@/infrastructure/ioc-container';
import { makeLogger } from '@/infrastructure/logger/make-logger';
import { IConfig } from '@/infrastructure/config/types/config.interface';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';
import { BuildResolver } from 'awilix/lib/resolvers';

const config = appDi.resolve<IConfig>('config');
const requestStorage = appDi.resolve<IRequestStorage>('requestStorage');

// Automatically pass logger with DI key as context
Object.keys(appDi.registrations).forEach((key) => {
  const resolver = appDi.registrations[key] as BuildResolver<any>;

  if ('inject' in resolver) {
    appDi.register(
      key,
      resolver.inject(() => ({
        logger: makeLogger(requestStorage, config, key),
      })),
    );
  } else {
    appDi.register(key, resolver);
  }
});
