import { ILogger } from '@/lib/logger/types/logger.interface';
import { getQuery, getRouterParams, H3Error, H3Event, readBody } from 'h3';
import { IRequestLogger } from '@/lib/web-server/types/request-logger.interface';
import { injectLogger } from '@/infrastructure/shared/shared.module';

export class RequestLogger implements IRequestLogger {
  constructor(private readonly logger: ILogger = injectLogger(RequestLogger.name)) {}

  public async request(event: H3Event): Promise<void> {
    let body;
    if (['PATCH', 'POST', 'PUT', 'DELETE'].includes(event.method)) {
      body = await readBody(event);
    }
    const params = getRouterParams(event);
    const query = getQuery(event);
    this.logger.info(`${event.method} ${event.path}`, { params, query, body });
  }

  public finished(event: H3Event): void {
    this.logger.info(`Finished ${event.method} ${event.path}`);
  }

  public error(error: H3Error, event: H3Event): void {
    this.logger.error(error, `${event.method} ${event.path}`);
  }
}
