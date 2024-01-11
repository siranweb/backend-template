import { JwtService } from '@/app/users/auth/jwt';
import { AuthChainHandler } from '@/infra/web-server/auth.chain-handler';
import { config } from '@/infra/config';
import { ValidateAccessTokenAction } from '@/app/users/auth/actions/validate-access-token.action';

const jwtService = new JwtService();

const validateAccessTokenAction = new ValidateAccessTokenAction(jwtService, config);
const authChainHandler = new AuthChainHandler(validateAccessTokenAction);

export const authChainHandlerFunc = authChainHandler.handle.bind(authChainHandler);
