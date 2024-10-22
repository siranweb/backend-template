import { ILogger } from '@/lib/logger/types/logger.interface';
import { IInvalidateRefreshTokenCase } from '@/core/users/types/invalidate-refresh-token-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { inject } from 'di-wise';
import { usersModuleTokens } from '../users.module';
import { injectLogger } from '@/infrastructure/shared/shared.module';

export class InvalidateRefreshTokenCase implements IInvalidateRefreshTokenCase {
  constructor(
    private readonly logger: ILogger = injectLogger(InvalidateRefreshTokenCase.name),
    private readonly usersRepository: IUsersRepository = inject(usersModuleTokens.usersRepository),
  ) {}
  async execute(token: string): Promise<void> {
    this.logger.info('Starting refresh token invalidating.');

    await this.usersRepository.storeInvalidRefreshToken(token);

    this.logger.info('Refresh token wasd invalidated.');
  }
}
