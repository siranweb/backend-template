import winston from 'winston';
import 'winston-daily-rotate-file';
import { format } from 'winston';
import chalk from 'chalk';
import { Config, NodeEnv } from '@/infra/config';
import dayjs from 'dayjs';
import { IWebServerLogger } from '../loggers/types';
import { COMBINED_LOGS_FILEPATH, API_LOGS_FILEPATH } from '@/infra/loggers/constants';

enum RequestStatus {
  IN_PROGRESS = 'in progress',
  FINISHED = 'finished',
  FAILED = 'failed',
}

type Context = Record<any, any>;

interface ApiInfo {
  timestamp: string;
  status: RequestStatus;
  method: string;
  url: string;
  ms?: number;
  error?: any;
  context?: Context;
}

export class WebServerLogger implements IWebServerLogger {
  private readonly logger: winston.Logger;

  constructor(config: Pick<Config, 'nodeEnv'>) {
    this.logger = winston.createLogger();

    if (config.nodeEnv === NodeEnv.DEVELOPMENT) {
      this.logger.add(this.makeApiConsoleTransport());
    }

    if (config.nodeEnv === NodeEnv.PRODUCTION) {
      this.logger.add(this.makeCombinedFileTransport());
      this.logger.add(this.makeApiFileTransport());
    }
  }

  request(method: string, url: string, context?: Context) {
    this.logger.log({
      level: 'http',
      timestamp: dayjs().utc(),
      status: RequestStatus.IN_PROGRESS,
      method,
      url,
      message: 'Request to API',
      context: context ?? {},
    });
  }

  finished(method: string, url: string, ms: number, status: number, context?: Context) {
    this.logger.log({
      level: 'http',
      timestamp: dayjs().utc(),
      status: RequestStatus.FINISHED,
      method,
      url,
      message: 'Request to API',
      ms,
      context: context ?? {},
    });
  }

  failed(
    method: string,
    url: string,
    ms: number,
    status: number,
    error: string,
    context?: Context,
  ) {
    this.logger.log({
      level: 'http',
      timestamp: dayjs().utc(),
      status: RequestStatus.FAILED,
      method,
      url,
      message: 'Request to API',
      ms,
      error,
      context: context ?? {},
    });
  }

  private makeApiConsoleTransport() {
    const printClb = this.getConsolePrintCallback();
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

  private getConsolePrintCallback(): (info: ApiInfo) => string {
    return (info: ApiInfo) => {
      let str = `[${info.timestamp}]`;
      str += ` ${this.getColoredRequestStatus(info.status)}`;
      str += `\t${chalk.blue(info.method)} ${info.url}`;

      if (info.ms) {
        str += ` - ${info.ms}ms`;
      }

      if (info.error) {
        str += ` - ${info.error}`;
      }

      return str;
    };
  }

  private getColoredRequestStatus(status: RequestStatus): string {
    if (status === RequestStatus.IN_PROGRESS) {
      return chalk.yellow(status);
    }
    if (status === RequestStatus.FINISHED) {
      return chalk.green(status);
    }
    if (status === RequestStatus.FAILED) {
      return chalk.red(status);
    }
    return '';
  }

  private makeCombinedFileTransport() {
    return new winston.transports.DailyRotateFile({
      level: 'http',
      filename: COMBINED_LOGS_FILEPATH,
      frequency: '7d',
    });
  }

  private makeApiFileTransport() {
    return new winston.transports.DailyRotateFile({
      level: 'http',
      filename: API_LOGS_FILEPATH,
      frequency: '7d',
    });
  }
}
