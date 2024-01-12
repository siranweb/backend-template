import { Context, Handler } from '@/lib/web-sockets';
import { ValidateAccessTokenAction } from '@/app/users/auth/actions/validate-access-token.action';
import { parseCookie } from '@/utils/cookie';

export class AuthChainHandler {
  constructor(private readonly validateAccessTokenAction: ValidateAccessTokenAction) {}

  public async handle(ctx: Context, next: Handler): Promise<void> {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    const isTokenProvided = !!cookieObj.accessToken;
    if (!isTokenProvided) {
      return;
    }

    const isTokenValid = await this.validateAccessTokenAction.execute(cookieObj.accessToken);
    if (!isTokenValid) {
      return;
    }

    next(ctx);
  }
}
