import { ApiError, Context, ErrorType, WebServerCORHandler } from '@/lib/web-server';
import { ValidateAccessTokenAction } from '../actions/validate-access-token.action';
import { parseCookie } from '@/utils/cookie';

export class AuthWebServerCORHandler extends WebServerCORHandler {
  constructor(private readonly validateAccessTokenAction: ValidateAccessTokenAction) {
    super();
  }

  public async handle(ctx: Context): Promise<void> {
    const cookieObj = parseCookie(ctx.req.headers.cookie);
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

    this.next.handle(ctx);
  }
}
