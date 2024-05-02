import { IUsersRepository } from '../types';
import { IInvalidateRefreshTokenCase } from '@/modules/users/domain/types';

export class InvalidateRefreshTokenCase implements IInvalidateRefreshTokenCase {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(token: string): Promise<void> {
    await this.usersRepository.storeInvalidRefreshToken(token);
  }
}
