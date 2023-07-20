import winston from 'winston';
import { format } from 'winston';
import chalk from 'chalk';
import { Config, NodeEnv } from '@/infra/config';
import dayjs from 'dayjs';
import { ApiLogger } from '@/infra/api/types';
import { TransformableInfo } from 'logform';

enum RequestStatus {
  IN_PROGRESS = 'in progress',
  FINISHED = 'finished',
  FAILED = 'failed',
}

interface ApiInfo extends TransformableInfo {
  status: RequestStatus,
  method: string,
  url: string,
  ms?: number,
  error?: string,
}

export class DefaultApiLogger implements ApiLogger {
  private readonly logger: winston.Logger;

  constructor(config: Pick<Config, 'nodeEnv'>) {
    this.logger = winston.createLogger();

    if (config.nodeEnv === NodeEnv.DEVELOPMENT) {
      this.logger.add(this.makeApiConsoleTransport());
    }

    // if (config.nodeEnv === NodeEnv.PRODUCTION) {
    if (true) {
      this.logger.add(this.makeApiFileTransport());
    }
  }

  request(method: string, url: string) {
    this.logger.log({
      level: 'http',
      status: RequestStatus.IN_PROGRESS,
      method,
      url,
      message: 'Request to API',
    });
  }

  finished(method: string, url: string, ms: number) {
    this.logger.log({
      level: 'http',
      status: RequestStatus.FINISHED,
      method,
      url,
      message: 'Request to API',
      ms,
    });
  }

  failed(method: string, url: string, ms: number, error: string) {
    this.logger.log({
      level: 'http',
      status: RequestStatus.FAILED,
      method,
      url,
      message: 'Request to API',
      ms,
      error,
    });
  }

  private makeApiConsoleTransport() {
    const printClb = (info: ApiInfo) => {
      let str = `[${info.timestamp}]`;
      if (info.status === RequestStatus.IN_PROGRESS) {
        str += ` (${chalk.yellow(info.status)})`;
      } else if (info.status === RequestStatus.FINISHED) {
        str += ` (${chalk.green(info.status)})`;
      } else if (info.status === RequestStatus.FAILED) {
        str += ` (${chalk.red(info.status)})`;
      }
      str += ` ${chalk.blue(info.method)} ${info.url}`;

      if (info.ms) {
        str += ` - ${info.ms}ms`;
      }

      if (info.error) {
        str += ` - Error: ${info.error}`;
      }

      return str;
    }
    return new winston.transports.Console({
      level: 'http',
      format: format.combine(
        format.timestamp({
          format: () => dayjs().format('HH:mm:ss.SSS'),
        }),
        // @ts-ignore
        format.printf(printClb),
      ),
    });
  }

  private makeApiFileTransport() {
    return new winston.transports.File({
      level: 'http',
      filename: 'logs/combined.log',
    });
  }
}
