import { H3Error, H3Event } from 'h3';

export interface IRequestLogger {
  request(event: H3Event): Promise<void>;
  finished(event: H3Event): void;
  error(error: H3Error, event: H3Event): void;
}
