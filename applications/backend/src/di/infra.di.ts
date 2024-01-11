import { JwtService } from '@/app/users/auth/jwt';
import { AuthChainHandler as WebServerAuthChainHandler } from '@/infra/web-server/auth.chain-handler';
import { AuthChainHandler as WebSocketsAuthChainHandler } from '@/infra/web-sockets/auth.chain-handler';
import { config } from '@/infra/config';
import { ValidateAccessTokenAction } from '@/app/users/auth/actions/validate-access-token.action';

const jwtService = new JwtService();

const validateAccessTokenAction = new ValidateAccessTokenAction(jwtService, config);

const webServer = {
  authChainHandler: new WebServerAuthChainHandler(validateAccessTokenAction),
}

const webSockets = {
  authChainHandler: new WebSocketsAuthChainHandler(validateAccessTokenAction),
}

export const webServerAuth = webServer.authChainHandler.handle.bind(webServer.authChainHandler);
export const webSocketsAuth = webSockets.authChainHandler.handle.bind(webSockets.authChainHandler);