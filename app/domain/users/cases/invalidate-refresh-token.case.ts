import { IUsersRepository } from '../types/cases.interfaces';
import { IInvalidateRefreshTokenCase } from '@/domain/users/types/cases.interfaces';

export class InvalidateRefreshTokenCase implements IInvalidateRefreshTokenCase {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(token: string): Promise<void> {
    await this.usersRepository.storeInvalidRefreshToken(token);
  }
}
