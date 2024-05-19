import { ValidateAccessTokenCase } from '@/domain/users/cases/validate-access-token.case';
import { config } from 'app/infrastructure/config';
import { JwtService } from '@/domain/jwt/services/jwt.service';
import { Auth } from '@/infrastructure/web-server/chain-handlers/auth';
import { LogExample } from '@/infrastructure/web-server/chain-handlers/log-example';
import { ErrorHandler } from '@/infrastructure/web-server/error-handlers/error-handler';

const jwtService = new JwtService();
const validateAccessTokenCase = new ValidateAccessTokenCase(jwtService, config);

export const errorHandler = new ErrorHandler();
export const auth = new Auth(validateAccessTokenCase);
export const logExample = new LogExample();
