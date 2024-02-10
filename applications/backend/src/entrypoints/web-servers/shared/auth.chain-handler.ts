import { ApiError, Context, ErrorType, Handler } from '@/lib/web-server';
import { ValidateAccessTokenAction } from '@/app/users/auth/actions/validate-access-token.action';
import { parseCookie } from '@/utils/cookie';

export class AuthChainHandler {
  constructor(private readonly validateAccessTokenAction: ValidateAccessTokenAction) {}

  public async handle(ctx: Context, next: Handler): Promise<void> {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    const isTokenProvided = !!cookieObj.accessToken;
    if (!isTokenProvided) {
      throw new ApiError({
        statusCode: 401,
        type: ErrorType.APP,
      });
    }

    const isTokenValid = await this.validateAccessTokenAction.execute(cookieObj.accessToken);
    if (!isTokenValid) {
      throw new ApiError({
        statusCode: 403,
        type: ErrorType.APP,
      });
    }

    await next(ctx);
  }
}
