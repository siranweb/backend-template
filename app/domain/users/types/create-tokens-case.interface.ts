import { TokenPair } from '@/domain/users/types/shared';

export interface ICreateTokensCase {
  execute(userId: string): Promise<TokenPair>;
}
