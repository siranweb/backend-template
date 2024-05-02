import { IncomingMessage } from 'node:http';

export interface IBodyParser {
  getStringBody(req: IncomingMessage): Promise<string>;
  parseJSON(data: string): any;
}
