import { TokenPair } from '@/domain/users/types/shared';

export interface IRefreshTokensCase {
  execute(oldRefreshToken: string): Promise<TokenPair>;
}
