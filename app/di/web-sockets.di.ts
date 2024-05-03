import { config } from '@/modules/config';
import { JwtService } from '@/modules/jwt/domain/services/jwt.service';
import { WebSocketsAuthChainHandler } from '@/modules/common/chain-handlers/web-sockets-auth.chain-handler';
import { ValidateAccessTokenCase } from '@/modules/users/domain/cases/validate-access-token.case';

const jwtService = new JwtService();
const validateAccessTokenCase = new ValidateAccessTokenCase(jwtService, config);

export const auth = new WebSocketsAuthChainHandler(validateAccessTokenCase);
