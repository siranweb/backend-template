import * as jose from 'jose';
import { TextEncoder } from 'node:util';
import { IJWTService, CreateTokenParams, IsValidParams, DecryptResult } from './types';

export class JwtService implements IJWTService {
  async createToken(params: CreateTokenParams): Promise<string> {
    const encodedSecret = new TextEncoder().encode(params.secret);
    const alg = 'HS256';

    return new jose.SignJWT(params.payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(params.issuer)
      .setAudience(params.audience)
      .setExpirationTime(params.expirationTime)
      .sign(encodedSecret);
  }

  async isValid(params: IsValidParams): Promise<boolean> {
    const encodedSecret = new TextEncoder().encode(params.secret);

    try {
      await jose.jwtVerify(params.token, encodedSecret, {
        issuer: params.issuer,
        audience: params.audience,
      });
    } catch (e) {
      return false;
    }

    return true;
  }

  async decrypt(params: IsValidParams): Promise<DecryptResult> {
    const encodedSecret = new TextEncoder().encode(params.secret);

    let result;
    try {
      result = await jose.jwtDecrypt(params.token, encodedSecret, {
        issuer: params.issuer,
        audience: params.audience,
      });
    } catch (e) {
      throw new Error('Unable to decrypt JWT');
    }

    return {
      payload: result.payload,
      header: result.protectedHeader,
    };
  }
}
