import { IncomingMessage } from 'node:http';

export class BodyParser {
  public async getStringBody(req: IncomingMessage): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let body = '';
      req.on('readable', () => (body += req.read()));
      req.on('end', () => resolve(body));
      req.on('error', (error) => reject(error));
    });
  }

  public parseJSON(data: string): any {
    return JSON.parse(data);
  }
}
