import { createError, getCookie, H3Event, readValidatedBody, setCookie } from 'h3';
import { createUserSchema, loginSchema } from './schemas';
import { IConfig, NodeEnv } from '@/infrastructure/config';
import { TokenInvalidError } from '@/domain/users/errors/token-invalid.error';
import {
  ICreateAccountCase,
  ICreateTokensByRefreshTokenCase,
  IInvalidateRefreshTokenCase,
  ILoginCase,
} from '@/domain/users/types/cases.interfaces';
import { createControllerDefinition } from '@/infrastructure/web-server/controller-definitions/creator';
import { IController } from '@/infrastructure/web-server/types/controller.interface';
import { IControllerDefinition } from '@/infrastructure/web-server/types/controller-definition.interface';
import { auth } from '@/di/web-server.di';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/infrastructure/web-server/constants';

const { Handler, Chain, Controller, definition } = createControllerDefinition();

@Controller('/users')
export class UsersController implements IController {
  public readonly definition: IControllerDefinition = definition;

  constructor(
    private readonly config: IConfig,
    private readonly createAccountCase: ICreateAccountCase,
    private readonly createTokensByRefreshTokenCase: ICreateTokensByRefreshTokenCase,
    private readonly loginCase: ILoginCase,
    private readonly invalidateRefreshToken: IInvalidateRefreshTokenCase,
  ) {}

  @Handler('POST')
  async createAccount(event: H3Event) {
    const body = await readValidatedBody(event, createUserSchema.parse);

    const { accessToken, refreshToken } = await this.createAccountCase.execute({
      login: body.login,
      password: body.password,
    });

    this.setAccessTokenCookie(event, accessToken);
    this.setRefreshTokenCookie(event, refreshToken);
  }

  @Handler('POST', '/tokens')
  @Chain(auth)
  async refreshTokens(event: H3Event) {
    const clientRefreshToken = getCookie(event, REFRESH_TOKEN_NAME);

    if (!clientRefreshToken) {
      throw createError({
        statusCode: 403,
      });
    }

    let accessToken: string;
    let refreshToken: string;
    try {
      const result = await this.createTokensByRefreshTokenCase.execute(clientRefreshToken);
      accessToken = result.accessToken;
      refreshToken = result.refreshToken;
    } catch (e) {
      if (e instanceof TokenInvalidError) {
        throw createError({
          statusCode: 403,
        });
      } else {
        throw e;
      }
    }

    // TODO move to createTokensByRefreshTokenCase
    await this.invalidateRefreshToken.execute(clientRefreshToken);

    this.setAccessTokenCookie(event, accessToken);
    this.setRefreshTokenCookie(event, refreshToken);
  }

  @Handler('POST', '/session')
  async login(event: H3Event) {
    const { login, password } = await readValidatedBody(event, loginSchema.parse);
    const { accessToken, refreshToken } = await this.loginCase.execute(login, password);

    this.setAccessTokenCookie(event, accessToken);
    this.setRefreshTokenCookie(event, refreshToken);
  }

  @Handler('DELETE', '/session')
  async logout(event: H3Event) {
    const clientRefreshToken = getCookie(event, REFRESH_TOKEN_NAME);

    if (clientRefreshToken) {
      await this.invalidateRefreshToken.execute(clientRefreshToken);
    }

    this.setAccessTokenCookie(event, '');
    this.setRefreshTokenCookie(event, '');
  }

  private setAccessTokenCookie(event: H3Event, accessToken: string): void {
    setCookie(event, ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    });
  }

  private setRefreshTokenCookie(event: H3Event, refreshToken: string): void {
    setCookie(event, REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    });
  }
}
