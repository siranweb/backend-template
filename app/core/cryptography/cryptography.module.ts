import { CryptographyService } from '@/core/cryptography/services/cryptography.service';
import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';
import { Module } from '@/lib/module';
import { Type } from 'di-wise';

export const cryptographyModule = new Module('cryptography');

export const cryptographyModuleTokens = {
  cryptographyService: Type<ICryptographyService>('cryptographyService'),
};

cryptographyModule.register(cryptographyModuleTokens.cryptographyService, {
  useClass: CryptographyService,
});
