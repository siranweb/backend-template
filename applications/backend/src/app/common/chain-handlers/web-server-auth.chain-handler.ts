import { ApiError, ApiErrorType, Context, HandlerFunc } from '@/lib/web-server';
import { parseCookie } from '@/app/common/utils/cookie';
import { IValidateAccessTokenCase } from '@/app/users/domain/types';

export class WebServerAuthChainHandler {
  constructor(private readonly validateAccessTokenCase: IValidateAccessTokenCase) {}

  public async handle(ctx: Context, next: HandlerFunc): Promise<void> {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    const isTokenProvided = !!cookieObj.accessToken;
    if (!isTokenProvided) {
      throw new ApiError({
        statusCode: 401,
        type: ApiErrorType.APP,
      });
    }

    const isTokenValid = await this.validateAccessTokenCase.execute(cookieObj.accessToken);
    if (!isTokenValid) {
      throw new ApiError({
        statusCode: 403,
        type: ApiErrorType.APP,
      });
    }

    await next(ctx);
  }
}
