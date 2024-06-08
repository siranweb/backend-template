import { JwtService } from '@/domain/jwt/services/jwt.service';
import { appDi } from '@/infrastructure/ioc-container';
import { asClass, Resolver } from 'awilix';
import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';

export const jwtService = new JwtService();

appDi.register({
  jwtService: asClass(JwtService).singleton() satisfies Resolver<IJWTService>,
});
