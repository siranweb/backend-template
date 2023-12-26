import { IAction } from '@/infra/common/types';
import { IUsersRepository } from '@/app/users/shared/types';

export class InvalidateRefreshToken implements IAction {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(token: string): Promise<string> {
    return this.usersRepository.storeInvalidRefreshToken(token);
  }
}
