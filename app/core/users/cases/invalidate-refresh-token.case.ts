import { ILogger } from '@/lib/logger/types/logger.interface';
import { IInvalidateRefreshTokenCase } from '@/core/users/types/invalidate-refresh-token-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';

export class InvalidateRefreshTokenCase implements IInvalidateRefreshTokenCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
  ) {}
  async execute(token: string): Promise<void> {
    this.logger.info('Starting refresh token invalidating.');

    await this.usersRepository.storeInvalidRefreshToken(token);

    this.logger.info('Refresh token wasd invalidated.');
  }
}
