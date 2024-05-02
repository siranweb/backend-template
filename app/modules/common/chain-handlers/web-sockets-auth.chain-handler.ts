import { Context, Handler } from '@/lib/web-sockets';
import { parseCookie } from '@/modules/common/utils/cookie';
import { IValidateAccessTokenCase } from '@/modules/users/domain/types';

export class WebSocketsAuthChainHandler {
  constructor(private readonly validateAccessTokenCase: IValidateAccessTokenCase) {}

  public async handle(ctx: Context, next: Handler): Promise<void> {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    const isTokenProvided = !!cookieObj.accessToken;
    if (!isTokenProvided) {
      return;
    }

    const isTokenValid = await this.validateAccessTokenCase.execute(cookieObj.accessToken);
    if (!isTokenValid) {
      return;
    }

    next(ctx);
  }
}
