import { ApiError, Context, ErrorType, Handler } from '@/lib/web-server';
import { parseCookie } from '@/utils/cookie';
import { IValidateAccessTokenCase } from '@/app/users/domain/types';

export class WebServerAuthChainHandler {
  constructor(private readonly validateAccessTokenCase: IValidateAccessTokenCase) {}

  public async handle(ctx: Context, next: Handler): Promise<void> {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    const isTokenProvided = !!cookieObj.accessToken;
    if (!isTokenProvided) {
      throw new ApiError({
        statusCode: 401,
        type: ErrorType.APP,
      });
    }

    const isTokenValid = await this.validateAccessTokenCase.execute(cookieObj.accessToken);
    if (!isTokenValid) {
      throw new ApiError({
        statusCode: 403,
        type: ErrorType.APP,
      });
    }

    await next(ctx);
  }
}
