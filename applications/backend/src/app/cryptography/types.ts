export interface ICryptography {
  hash(input: string, salt: string, saltRounds: number): Promise<string>;
  random(length: number): string;
}
