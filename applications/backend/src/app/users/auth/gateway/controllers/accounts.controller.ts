import { Context, Controller, Endpoint } from '@/lib/web-server';
import { createAccountSchema } from '../schemas/accounts.schemas';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';
import { Config, NodeEnv } from '@/infra/config';
import { buildCookie, parseCookie } from '@/utils/cookie';
import { CreateTokensAction } from '@/app/users/auth/actions/create-tokens.action';

// TODO add refresh token to db

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly config: Config,
    private readonly createAccountAction: CreateAccountAction,
    private readonly createTokensAction: CreateTokensAction,
  ) {}

  @Endpoint('POST', '/')
  async createAccount(ctx: Context) {
    const { body } = createAccountSchema.parse(ctx);
    const result = await this.createAccountAction.execute({
      login: body.login,
      password: body.password,
    });

    const cookieObj = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    const cookie = buildCookie(cookieObj);
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('POST', '/tokens')
  async refreshTokens(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie);
    const result = await this.createTokensAction.execute(cookieObj.refreshToken);

    const newCookieObj = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    const cookie = buildCookie(newCookieObj);
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('POST', '/session')
  async login(ctx: Context) {
    // TODO
    ctx.res.end();
  }

  @Endpoint('DELETE', '/session')
  async logout(ctx: Context) {
    // TODO
    ctx.res.end();
  }
}
