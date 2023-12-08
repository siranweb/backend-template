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

    let cookie = `accessToken=${result.accessToken};refreshToken=${result.refreshToken}; HttpOnly; SameSite=Strict`;
    if (this.config.nodeEnv === NodeEnv.PRODUCTION) {
      cookie += '; Secure'
    }

    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }
}
