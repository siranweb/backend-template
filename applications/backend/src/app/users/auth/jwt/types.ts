export interface IJWTService {
  createToken(params: CreateTokenParams): Promise<string>;
  verify(params: VerifyParams): Promise<VerifyResult>;
}

export interface CreateTokenParams {
  payload: Record<string, any>;
  secret: string;
  expirationTime: string; // 2h, 10m, etc.
}

export interface VerifyParams {
  token: string;
  secret: string;
}

export interface VerifyResult {
  payload: Record<string, any>;
}
