import Koa from 'koa';
import { Controller, Endpoint } from '@/infra/web-server/decorators';
import { getUserSchema } from '../schemas/users.schemas';
import { UserNotFoundError } from '@/application/users/errors/user-not-found.error';

@Controller('users')
export class UsersController {

  @Endpoint('GET', '/:id')
  async getUser(ctx: Koa.Context) {
    const parsed = getUserSchema.parse(ctx);
    ctx.status = 402;
    throw new UserNotFoundError();
    const user = {
      id: parsed.params.id,
    };

    return {
      user
    }
  }

  @Endpoint('POST', '/')
  async createUser(ctx: Koa.Context) {
    const user = {
      id: 100,
    };
    ctx.body = { user };
  }
}
