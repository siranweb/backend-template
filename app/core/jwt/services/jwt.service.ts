import * as jose from 'jose';
import { TextEncoder } from 'node:util';
import {
  CreateTokenParams,
  IJWTService,
  VerifyParams,
  VerifyResult,
} from '../types/jwt-service.interface';

export class JwtService implements IJWTService {
  async createToken(params: CreateTokenParams): Promise<string> {
    const encodedSecret = new TextEncoder().encode(params.secret);
    const alg = 'HS256';

    return new jose.SignJWT(params.payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime(params.expirationTime)
      .sign(encodedSecret);
  }

  async verify(params: VerifyParams): Promise<VerifyResult> {
    const encodedSecret = new TextEncoder().encode(params.secret);
    const { payload } = await jose.jwtVerify(params.token, encodedSecret);
    return { payload };
  }
}
