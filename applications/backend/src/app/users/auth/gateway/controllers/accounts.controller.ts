import { Context, Controller, Endpoint } from '@/lib/web-server';
import { createAccountSchema } from '../schemas/accounts.schemas';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';
import { Config, NodeEnv } from '@/infra/config';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly config: Config,
    private readonly createAccountAction: CreateAccountAction,
  ) {}

  @Endpoint('POST', '/')
  async createAccount(ctx: Context) {
    const { body } = createAccountSchema.parse(ctx);
    const result = await this.createAccountAction.execute({
      login: body.login,
      password: body.password,
    });

    const cookie = this.buildCookie(result.accessToken, result.refreshToken);
    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  @Endpoint('POST', '/tokens')
  async refreshTokens(ctx: Context) {
    // TODO
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

  private buildCookie(accessToken: string, refreshToken: string): string {
    let cookie = `accessToken=${accessToken};refreshToken=${refreshToken}; HttpOnly; SameSite=Strict`;
    if (this.config.nodeEnv === NodeEnv.PRODUCTION) {
      cookie += '; Secure'
    }
    return cookie;
  }
}
