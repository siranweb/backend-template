import { TokenPair } from '@/core/users/types/shared';

export interface ICreateTokensCase {
  execute(userId: string): Promise<TokenPair>;
}
