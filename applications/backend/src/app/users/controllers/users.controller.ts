import Koa from 'koa';
import { Controller, Endpoint } from '@/infra/web-server/decorators';
import { getUserSchema } from '../schemas/users.schemas';
import { UserNotFoundError } from '@/app/users/errors/user-not-found.error';

@Controller('users')
export class UsersController {
  @Endpoint('GET', '/:id')
  async getUser(ctx: Koa.Context) {
    // ctx.params.id = '';
    const parsed = getUserSchema.parse(ctx);
    // throw new UserNotFoundError();
    // throw new Error('');
    const user = {
      id: parsed.params.id,
    };

    return {
      user,
    };
  }

  @Endpoint('POST', '/')
  async createUser(ctx: Koa.Context) {
    const user = {
      id: 100,
    };
    ctx.body = { user };
  }
}
