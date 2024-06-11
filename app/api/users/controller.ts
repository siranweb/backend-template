import { auth, logExample } from '@/infrastructure/web-server/chain-handlers.di';
import { createError, getCookie, H3Event, readValidatedBody, setCookie } from 'h3';
import { createUserSchema, loginSchema } from './schemas';
import { IConfig, NodeEnv } from '@/infrastructure/config/types/config.interface';
import { TokenInvalidError } from '@/domain/users/errors/token-invalid.error';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/infrastructure/web-server/constants';
import { ICreateUserCase } from '@/domain/users/types/create-user-case.interface';
import { IRefreshTokensCase } from '@/domain/users/types/refresh-tokens-case.interface';
import { ICreateTokensByCredentialsCase } from '@/domain/users/types/create-tokens-by-credentials-case.interface';
import { IInvalidateRefreshTokenCase } from '@/domain/users/types/invalidate-refresh-token-case.interface';
import {
  Chain,
  Controller,
  Handler,
} from '@/infrastructure/web-server/controllers-definition/decorators';

@Controller('/users')
@Chain(logExample)
export class UsersController {
  constructor(
    private readonly config: IConfig,
    private readonly createUserCase: ICreateUserCase,
    private readonly refreshTokensCase: IRefreshTokensCase,
    private readonly createTokensByCredentialsCase: ICreateTokensByCredentialsCase,
    private readonly invalidateRefreshTokenCase: IInvalidateRefreshTokenCase,
  ) {}

  @Handler('POST')
  async createUser(event: H3Event) {
    const body = await readValidatedBody(event, createUserSchema.parse);

    const { accessToken, refreshToken } = await this.createUserCase.execute({
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
      const result = await this.refreshTokensCase.execute(clientRefreshToken);
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

    this.setAccessTokenCookie(event, accessToken);
    this.setRefreshTokenCookie(event, refreshToken);
  }

  @Handler('POST', '/session')
  async login(event: H3Event) {
    const credentials = await readValidatedBody(event, loginSchema.parse);
    const { accessToken, refreshToken } =
      await this.createTokensByCredentialsCase.execute(credentials);

    this.setAccessTokenCookie(event, accessToken);
    this.setRefreshTokenCookie(event, refreshToken);
  }

  @Handler('DELETE', '/session')
  async logout(event: H3Event) {
    const clientRefreshToken = getCookie(event, REFRESH_TOKEN_NAME);

    if (clientRefreshToken) {
      await this.invalidateRefreshTokenCase.execute(clientRefreshToken);
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
