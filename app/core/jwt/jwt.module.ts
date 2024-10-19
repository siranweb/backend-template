import { asClass } from 'awilix';
import { JwtService } from '@/core/jwt/services/jwt.service';
import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { Module } from '@/lib/module';
import { sharedModule } from '@/infrastructure/shared/shared.module';

export const jwtModule = new Module('jwt');
jwtModule.use(sharedModule);

jwtModule.register<IJWTService>('jwtService', asClass(JwtService).singleton());
