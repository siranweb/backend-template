import { config } from '@/config';
import { JwtService } from 'src/app/jwt';
import { AuthChainHandler as WebServerAuthChainHandler } from '@/entrypoints/web-servers/shared/auth.chain-handler';
import { AuthChainHandler as WebSocketsAuthChainHandler } from '@/entrypoints/web-sockets/shared/auth.chain-handler';
import { ErrorHandler as WebServerErrorHandler } from '@/entrypoints/web-servers/shared/error-handler';
import { ValidateAccessTokenCase } from '@/app/users/domain/use-cases/validate-access-token.case';

const jwtService = new JwtService();

const validateAccessTokenCase = new ValidateAccessTokenCase(jwtService, config);

const webServer = {
  authChainHandler: new WebServerAuthChainHandler(validateAccessTokenCase),
  errorHandler: new WebServerErrorHandler(),
};

const webSockets = {
  authChainHandler: new WebSocketsAuthChainHandler(validateAccessTokenCase),
};

export const webServerAuth = webServer.authChainHandler.handle.bind(webServer.authChainHandler);
export const webServerErrorHandler = webServer.errorHandler.handle.bind(webServer.errorHandler);
export const webSocketsAuth = webSockets.authChainHandler.handle.bind(webSockets.authChainHandler);
