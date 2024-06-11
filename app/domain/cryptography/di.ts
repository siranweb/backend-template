import { asClass, Resolver } from 'awilix';
import { CryptographyService } from '@/domain/cryptography/services/cryptography.service';
import { appDi } from '@/infrastructure/ioc-container';
import { ICryptographyService } from '@/domain/cryptography/types/cryptography-service.interface';

appDi.register({
  cryptographyService: asClass(
    CryptographyService,
  ).singleton() satisfies Resolver<ICryptographyService>,
});
