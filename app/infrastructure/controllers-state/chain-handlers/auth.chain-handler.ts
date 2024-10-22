import { createError, getCookie, H3Event } from 'h3';
import { ACCESS_TOKEN_NAME } from '@/common/constants/web';
import { NextHandlerFunc } from '@/common/types/controller.types';
import { IChainHandler } from '@/infrastructure/controllers-state/types/chain-handler.interface';
import { IValidateTokenCase } from '@/core/users/types/validate-token.interface';
import { inject } from 'di-wise';
import { usersModuleTokens } from '@/core/users/users.module';

export class AuthChainHandler implements IChainHandler {
  constructor(
    private readonly validateTokenCase: IValidateTokenCase = inject(
      usersModuleTokens.validateTokenCase,
    ),
  ) {}

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
