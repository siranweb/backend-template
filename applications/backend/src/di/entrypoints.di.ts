import { config } from 'src/app/config';
import { JwtService } from '@/app/jwt/domain/services/jwt.service';
import { WebServerAuthChainHandler } from '@/app/common/chain-handlers/web-server-auth.chain-handler';
import { WebSocketsAuthChainHandler } from '@/app/common/chain-handlers/web-sockets-auth.chain-handler';
import { WebServerErrorHandler } from '@/app/common/error-handlers/web-server.error-handler';
import { ValidateAccessTokenCase } from '@/app/users/domain/use-cases/validate-access-token.case';

const jwtService = new JwtService();

const validateAccessTokenCase = new ValidateAccessTokenCase(jwtService, config);

export const webServerAuthChainHandler = new WebServerAuthChainHandler(validateAccessTokenCase);
export const webServerErrorHandler = new WebServerErrorHandler();
export const webSocketsAuthChainHandler = new WebSocketsAuthChainHandler(validateAccessTokenCase);

const webServer = {
  authChainHandler: new WebServerAuthChainHandler(validateAccessTokenCase),
  errorHandler: new WebServerErrorHandler(),
};

const webSockets = {
  authChainHandler: new WebSocketsAuthChainHandler(validateAccessTokenCase),
};

export const webServerAuth = webServer.authChainHandler.handle.bind(webServer.authChainHandler);
export const webSocketsAuth = webSockets.authChainHandler.handle.bind(webSockets.authChainHandler);
