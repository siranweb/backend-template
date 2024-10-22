import { JwtService } from '@/core/jwt/services/jwt.service';
import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { Module } from '@/lib/module';
import { Type } from 'di-wise';

export const jwtModule = new Module('jwt');

export const jwtModuleTokens = {
  jwtService: Type<IJWTService>('jwtService'),
};

jwtModule.register(jwtModuleTokens.jwtService, { useClass: JwtService });
