import { Controller, Endpoint, Params, Request, Response } from "@/lib/web-server";
import { getUserSchema } from '../schemas/users.schemas';
// import { UserNotFoundError } from '@/app/users/errors/user-not-found.error';

// TODO 'users'
@Controller()
export class UsersController {

  @Endpoint('GET', '/:id')
  async getUser(req: Request, res: Response, params: Params) {
    const parsed = getUserSchema.parse({ params });
    const user = {
      id: parsed.params.id,
    };
    // throw new UserNotFoundError();

    res.end(JSON.stringify({ user }));
  }

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
