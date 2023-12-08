import { Context, Controller, Endpoint } from '@/lib/web-server';
import { createAccountSchema } from '../schemas/auth.schemas';
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
    if (this.config.nodeEnv === NodeEnv.DEVELOPMENT) {
      cookie += '; Secure'
    }

    ctx.res.setHeader('Set-Cookie', cookie);
    ctx.res.end();
  }

  // @Endpoint('GET', '/:id')
  // async getUser(req: Request, res: Response, params: Params) {
  //   const parsed = getUserSchema.parse({ params });
  //   const user = {
  //     id: parsed.params.id,
  //   };
  //   // throw new UserNotFoundError();
  //
  //   res.end(JSON.stringify({ user }));
  // }
  // @Endpoint('GET', '/:id')
  // async getUser(ctx: Koa.Context) {
  //   // ctx.params.id = '';
  //   const parsed = getUserSchema.parse(ctx);
  //   // throw new UserNotFoundError();
  //   // throw new Error('');
  //   const user = {
  //     id: parsed.params.id,
  //   };
  //
  //   return {
  //     user,
  //   };
  // }
  //
  // @Endpoint('POST', '/')
  // async createUser(ctx: Koa.Context) {
  //   const user = {
  //     id: 100,
  //   };
  //   ctx.body = { user };
  // }
}
