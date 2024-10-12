import { asClass } from 'awilix';
import { CryptographyService } from '@/core/cryptography/services/cryptography.service';
import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { Module } from '@/lib/module';

export const cryptographyModule = new Module('cryptography');
cryptographyModule.use(sharedModule);

cryptographyModule.register<ICryptographyService>(
  'cryptographyService',
  asClass(CryptographyService).singleton(),
);
