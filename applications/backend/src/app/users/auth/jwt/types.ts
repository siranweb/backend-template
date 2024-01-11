export interface IJWTService {
  createToken(params: CreateTokenParams): Promise<string>;
  isValid(params: IsValidParams): Promise<boolean>;
  decrypt(params: DecryptParams): Promise<DecryptResult>;
}

export interface CreateTokenParams {
  payload: Record<string, any>;
  secret: string;
  expirationTime: string; // 2h, 10m, etc.
  issuer: string;
  audience: string;
}

export interface IsValidParams {
  token: string;
  secret: string;
  issuer: string;
  audience: string;
}

export interface DecryptParams extends IsValidParams {}

export interface DecryptResult {
  payload: Record<string, any>;
  header: Record<string, any>;
}
