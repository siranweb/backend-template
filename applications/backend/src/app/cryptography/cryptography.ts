import crypto from 'node:crypto';
import { ICryptography } from './types';

export class Cryptography implements ICryptography {
  async hash(input: string, salt: string, saltRounds: number = 1000): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(input, salt, saltRounds, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey.toString('hex'));
        }
      });
    });
  }

  random(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
