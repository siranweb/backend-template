import { createError, getCookie, H3Event } from 'h3';
import { ACCESS_TOKEN_NAME } from '@/infrastructure/web-server/constants';
import { NextHandlerFunc, IChainHandler } from '@/infrastructure/web-server/types/shared';
import { IValidateAccessTokenCase } from '@/domain/users/types/cases.interfaces';

export class Auth implements IChainHandler {
  constructor(private readonly validateAccessTokenCase: IValidateAccessTokenCase) {}

  async handle(event: H3Event, next: NextHandlerFunc): Promise<void> {
    const accessToken = getCookie(event, ACCESS_TOKEN_NAME);

    if (!accessToken) {
      throw createError({
        statusCode: 401,
      });
    }

    const isTokenValid = await this.validateAccessTokenCase.execute(accessToken);
    if (!isTokenValid) {
      throw createError({
        statusCode: 403,
      });
    }

    return next(event);
  }
}
