export interface IValidateTokenCase {
  execute(accessToken: string): Promise<boolean>;
}
