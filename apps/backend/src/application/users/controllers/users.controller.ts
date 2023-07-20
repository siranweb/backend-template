import Koa from 'koa';
import { Controller, Endpoint } from '@/infra/api/decorators';
import { getUserSchema } from '../schemas/users.schemas';

@Controller('users')
export class UsersController {

  @Endpoint('GET', '/:id')
  async getUser(ctx: Koa.Context) {
    const parsed = getUserSchema.parse(ctx);
    const user = {
      id: parsed.params.id,
    };

    if (Math.random() > 0.5) {
      throw new Error('This is error example')
    }

    ctx.body = { user };
  }

  @Endpoint('POST', '/')
  async createUser(ctx: Koa.Context) {
    const user = {
      id: 100,
    };
    ctx.body = { user };
  }
}
