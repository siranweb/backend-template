import { ApiError, Context, ErrorType } from '@/lib/web-server';
import { createAccountSchema, loginAccountSchema } from './schemas/accounts.schemas';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';
import { Config, NodeEnv } from '@/config';
import { buildCookie, parseCookie } from '@/utils/cookie';
import { CreateTokensByRefreshTokenAction } from '@/app/users/auth/actions/create-tokens-by-refresh-token.action';
import { LoginAction } from '@/app/users/auth/actions/login.action';
import { InvalidateRefreshToken } from '@/app/users/auth/actions/invalidate-refresh-token.action';
import { TokenInvalidError } from '@/app/users/auth/errors/token-invalid.error';

export class AccountsController {
  constructor(
    private readonly config: Config,
    private readonly createAccountAction: CreateAccountAction,
    private readonly createTokensByRefreshTokenAction: CreateTokensByRefreshTokenAction,
    private readonly loginAction: LoginAction,
    private readonly invalidateRefreshToken: InvalidateRefreshToken,
  ) {}

  async createAccount(ctx: Context) {
    const { body } = createAccountSchema.parse(ctx);
    const result = await this.createAccountAction.execute({
      login: body.login,
      password: body.password,
    });

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(result.accessToken),
      this.getRefreshTokenCookie(result.refreshToken),
    ]);
    ctx.res.end();
  }

  async refreshTokens(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    let result;
    try {
      result = await this.createTokensByRefreshTokenAction.execute(cookieObj.refreshToken);
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

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(result.accessToken),
      this.getRefreshTokenCookie(result.refreshToken),
    ]);
    ctx.res.end();
  }

  async login(ctx: Context) {
    const { body } = loginAccountSchema.parse(ctx);
    const result = await this.loginAction.execute(body.login, body.password);

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(result.accessToken),
      this.getRefreshTokenCookie(result.refreshToken),
    ]);
    ctx.res.end();
  }

  async logout(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    if (typeof cookieObj.refreshToken === 'string' && cookieObj.refreshToken) {
      await this.invalidateRefreshToken.execute(cookieObj.refreshToken);
    }

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(''),
      this.getRefreshTokenCookie(''),
    ]);
    ctx.res.end();
  }

  private getAccessTokenCookie(accessToken: string): string {
    const newCookieObj = {
      accessToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    return buildCookie(newCookieObj);
  }

  private getRefreshTokenCookie(refreshToken: string): string {
    const newCookieObj = {
      refreshToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    return buildCookie(newCookieObj);
  }
}
