import { ApiError, ApiErrorType, Context } from '@/lib/web-server';
import { createUserSchema, loginSchema } from './users.schema';
import { IConfig, NodeEnv } from '@/modules/config';
import { buildCookie, parseCookie } from '@/modules/common/utils/cookie';
import { TokenInvalidError } from '@/modules/users/errors/token-invalid.error';
import {
  ICreateAccountCase,
  ICreateTokensByRefreshTokenCase,
  IInvalidateRefreshTokenCase,
  ILoginCase,
} from '@/modules/users/domain/types';
import { createControllerDefinition } from '@/modules/common/definitions/controller/creator';
import { IController } from '@/modules/common/types/controller.interface';
import { IControllerDefinition } from '@/modules/common/types/controller-definition.interface';
import { auth } from '@/di/web-server.di';
import { HttpStatus } from '@/modules/common/types/http-statuses';

const { Handler, Chain, Controller, OpenApiRoute, OpenApiResult, definition } = createControllerDefinition();

@Controller('/users')
export class UsersController implements IController {
  public readonly definition: IControllerDefinition = definition;

  constructor(
    private readonly config: IConfig,
    private readonly createAccountCase: ICreateAccountCase,
    private readonly createTokensByRefreshTokenCase: ICreateTokensByRefreshTokenCase,
    private readonly loginCase: ILoginCase,
    private readonly invalidateRefreshToken: IInvalidateRefreshTokenCase,
  ) {}

  @Handler('POST')
  @OpenApiRoute({
    description: 'Create user and get new token pair',
    body: createUserSchema,
  })
  @OpenApiResult({
    code: HttpStatus.CREATED,
    description: 'Token pair in cookies',
  })
  async createUser(ctx: Context) {
    const body = createUserSchema.parse(ctx.body);
    const result = await this.createAccountCase.execute({
      login: body.login,
      password: body.password,
    });

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(result.accessToken),
      this.getRefreshTokenCookie(result.refreshToken),
    ]);
    ctx.res.statusCode = HttpStatus.CREATED;
    ctx.res.end();
  }

  @Handler('POST', '/tokens')
  @Chain(auth)
  @OpenApiRoute({
    description: 'Get new token pair by refresh token',
  })
  @OpenApiResult({
    description: 'Token pair in cookies',
  })
  async refreshTokens(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    let result;
    try {
      result = await this.createTokensByRefreshTokenCase.execute(cookieObj.refreshToken);
    } catch (e) {
      if (e instanceof TokenInvalidError) {
        throw new ApiError({
          statusCode: 403,
          type: ApiErrorType.APP,
          original: e,
        });
      } else {
        throw e;
      }
    }

    await this.invalidateRefreshToken.execute(cookieObj.refreshToken);

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(result.accessToken),
      this.getRefreshTokenCookie(result.refreshToken),
    ]);
    ctx.res.end();
  }

  @Handler('POST', '/session')
  @OpenApiRoute({
    description: 'Get new token pair (login)',
    body: loginSchema,
  })
  @OpenApiResult({
    description: 'Token pair in cookies',
  })
  async login(ctx: Context) {
    const body = loginSchema.parse(ctx.body);
    const result = await this.loginCase.execute(body.login, body.password);

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(result.accessToken),
      this.getRefreshTokenCookie(result.refreshToken),
    ]);
    ctx.res.end();
  }

  @Handler('DELETE', '/session')
  @OpenApiRoute({
    description: 'Remove token pair from cookie (logout)',
  })
  async logout(ctx: Context) {
    const cookieObj = parseCookie(ctx.req.headers.cookie ?? '');
    if (typeof cookieObj.refreshToken === 'string' && cookieObj.refreshToken) {
      await this.invalidateRefreshToken.execute(cookieObj.refreshToken);
    }

    ctx.res.setHeader('Set-Cookie', [
      this.getAccessTokenCookie(''),
      this.getRefreshTokenCookie(''),
    ]);
    ctx.res.end();
  }

  private getAccessTokenCookie(accessToken: string): string {
    const newCookieObj = {
      accessToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    return buildCookie(newCookieObj);
  }

  private getRefreshTokenCookie(refreshToken: string): string {
    const newCookieObj = {
      refreshToken,
      HttpOnly: true,
      SameSite: 'strict',
      Secure: this.config.nodeEnv === NodeEnv.PRODUCTION,
    };

    return buildCookie(newCookieObj);
  }
}
