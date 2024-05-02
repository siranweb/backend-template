import { IncomingMessage } from 'node:http';
import { IBodyParser } from '../types/body-parser.interface';

export class BodyParser implements IBodyParser {
  public async getStringBody(req: IncomingMessage): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let body = '';
      req.on('readable', () => {
        const value = req.read();
        if (value) {
          body += value;
        }
      });
      req.on('end', () => resolve(body));
      req.on('error', (error) => reject(error));
    });
  }

  public parseJSON(data: string): any {
    return JSON.parse(data);
  }
}
