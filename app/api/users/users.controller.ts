import { createError, getCookie, H3Event, readValidatedBody, setCookie } from 'h3';
import { loginUserSchema } from './schemas/login-user.schema';
import { createUserSchema } from './schemas/create-user.schema';
import { IConfig, NodeEnv } from '@/infrastructure/shared/types/config.interface';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/common/constants/web';
import { Chain, Controller, Handler } from '@/infrastructure/controllers-state/decorators';
import { ICreateUserCase } from '@/core/users/types/create-user-case.interface';
import { IRefreshTokensCase } from '@/core/users/types/refresh-tokens-case.interface';
import { ICreateTokensByCredentialsCase } from '@/core/users/types/create-tokens-by-credentials-case.interface';
import { IInvalidateRefreshTokenCase } from '@/core/users/types/invalidate-refresh-token-case.interface';
import { TokenInvalidError } from '@/core/users/errors/token-invalid.error';
import {
  controllersStateModule,
  controllersStateModuleTokens,
} from '@/infrastructure/controllers-state/controllers-state.module';
import { inject } from 'di-wise';
import { sharedModuleTokens } from '@/infrastructure/shared/shared.module';
import { usersModuleTokens } from '@/core/users/users.module';

const auth = controllersStateModule.resolve(controllersStateModuleTokens.authChainHandler);

@Controller('/users')
export class UsersController {
  constructor(
    private readonly config: IConfig = inject(sharedModuleTokens.config),
    private readonly createUserCase: ICreateUserCase = inject(usersModuleTokens.createUserCase),
    private readonly refreshTokensCase: IRefreshTokensCase = inject(
      usersModuleTokens.refreshTokensCase,
    ),
    private readonly createTokensByCredentialsCase: ICreateTokensByCredentialsCase = inject(
      usersModuleTokens.createTokensByCredentialsCase,
    ),
    private readonly invalidateRefreshTokenCase: IInvalidateRefreshTokenCase = inject(
      usersModuleTokens.invalidateRefreshTokenCase,
    ),
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
    const credentials = await readValidatedBody(event, loginUserSchema.parse);
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
