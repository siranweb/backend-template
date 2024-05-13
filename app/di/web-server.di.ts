import { WebServerErrorHandler } from '@/modules/common/error-handlers/web-server.error-handler';
import { WebServerAuthChainHandler } from '@/modules/common/chain-handlers/web-server-auth.chain-handler';
import { ValidateAccessTokenCase } from '@/modules/users/domain/cases/validate-access-token.case';
import { config } from '@/modules/config';
import { JwtService } from '@/modules/jwt/domain/services/jwt.service';
import { Redoc } from '@/lib/redoc';

export const redoc = new Redoc('Backend Template');
const jwtService = new JwtService();
const validateAccessTokenCase = new ValidateAccessTokenCase(jwtService, config);

export const errorHandler = new WebServerErrorHandler();
export const auth = new WebServerAuthChainHandler(validateAccessTokenCase);
