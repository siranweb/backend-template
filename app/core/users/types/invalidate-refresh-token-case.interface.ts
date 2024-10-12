export interface IInvalidateRefreshTokenCase {
  execute(token: string): Promise<void>;
}
