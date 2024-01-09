import { ApiError, Context, Controller, Endpoint, ErrorType } from '@/lib/web-server';
import { createAccountSchema, loginAccountSchema } from './schemas/accounts.schemas';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';
import { Config, NodeEnv } from '@/infra/config';
import { buildCookie, parseCookie } from '@/utils/cookie';
import { CreateTokensByRefreshTokenAction } from '@/app/users/auth/actions/create-tokens-by-refresh-token.action';
import { LoginAction } from '@/app/users/auth/actions/login.action';
import { InvalidateRefreshToken } from '@/app/users/auth/actions/invalidate-refresh-token.action';
import { TokenInvalidError } from '@/app/users/auth/errors/token-invalid.error';
import { authChainHandlerFunc } from '@/init/di/infra.di';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly config: Config,
    private readonly createAccountAction: CreateAccountAction,
    private readonly createTokensAction: CreateTokensByRefreshTokenAction,
    private readonly loginAction: LoginAction,
    private readonly invalidateRefreshToken: InvalidateRefreshToken,
  ) {}

  @Endpoint('POST', '/')
  async createAccount(ctx: Context) {
    const { body } = createAccountSchema.parse(ctx);
    const result = await this.createAccountAction.execute({
      login: body.login,
      password: body.password,
    });

    const cookie = this.getAuthCookie(result.accessToken, result.refreshToken);
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('POST', '/tokens')
  async refreshTokens(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    let result;
    try {
      result = await this.createTokensAction.execute(cookieObj.refreshToken);
    } catch (e) {
      if (e instanceof TokenInvalidError) {
        throw new ApiError({
          statusCode: 403,
          type: ErrorType.APP,
          original: e,
        });
      } else {
        throw e;
      }
    }

    await this.invalidateRefreshToken.execute(cookieObj.refreshToken);

    const cookie = this.getAuthCookie(result.accessToken, result.refreshToken);
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('POST', '/session')
  async login(ctx: Context) {
    const { body } = loginAccountSchema.parse(ctx);
    const result = await this.loginAction.execute(body.login, body.password);

    const cookie = this.getAuthCookie(result.accessToken, result.refreshToken);
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('DELETE', '/session')
  async logout(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    if (typeof cookieObj.refreshToken === 'string' && cookieObj.refreshToken) {
      await this.invalidateRefreshToken.execute(cookieObj.refreshToken);
    }

    const cookie = this.getAuthCookie('', '');
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('POST', '/example', {
    chain: [authChainHandlerFunc],
  })
  async authProtectedMethodExample(ctx: Context) {
    ctx.res.end();
  }

  private getAuthCookie(accessToken: string, refreshToken: string): string {
    const newCookieObj = {
      accessToken,
      refreshToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    return buildCookie(newCookieObj);
  }
}
