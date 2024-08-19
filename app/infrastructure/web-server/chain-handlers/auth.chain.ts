import { createError, getCookie, H3Event } from 'h3';
import { ACCESS_TOKEN_NAME } from '@/infrastructure/web-server/constants';
import { NextHandlerFunc } from '@/infrastructure/web-server/types/shared';
import { IValidateTokenCase } from '@/domain/users/types/validate-token.interface';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

export class AuthChain implements IChainHandler {
  constructor(private readonly validateTokenCase: IValidateTokenCase) {}

  async handle(event: H3Event, next: NextHandlerFunc): Promise<void> {
    const accessToken = getCookie(event, ACCESS_TOKEN_NAME);

    if (!accessToken) {
      throw createError({
        statusCode: 401,
      });
    }

    const isTokenValid = await this.validateTokenCase.execute(accessToken);
    if (!isTokenValid) {
      throw createError({
        statusCode: 403,
      });
    }

    return next(event);
  }
}
