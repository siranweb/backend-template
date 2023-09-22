import winston, { format } from 'winston';
import dayjs from 'dayjs';
import chalk from 'chalk';
import { Config, NodeEnv } from '@/infra/config';
import { IAppLogger } from '@/infra/loggers/types';
import { APP_LOGS_FILEPATH, COMBINED_LOGS_FILEPATH } from '@/infra/loggers/constants';

type Context = Record<any, any>;

interface Info {
  type: string;
  timestamp: string;
  message: string;
  context?: Context;
}

export class AppLogger implements IAppLogger {
  private readonly logger: winston.Logger;

  constructor(config: Pick<Config, 'nodeEnv'>) {
    this.logger = winston.createLogger();

    if (config.nodeEnv === NodeEnv.DEVELOPMENT) {
      this.logger.add(this.makeAppConsoleTransport());
    }

    if (config.nodeEnv === NodeEnv.PRODUCTION) {
      this.logger.add(this.makeCombinedFileTransport());
      this.logger.add(this.makeAppFileTransport());
    }
  }

  info(message: string, context?: Context) {
    this.logger.log({
      level: 'info',
      timestamp: dayjs().utc(),
      message,
      context,
    });
  }

  warn(message: string, context?: Context) {
    this.logger.log({
      level: 'warn',
      timestamp: dayjs().utc(),
      message,
      context,
    });
  }

  error(message: string, context?: Context) {
    this.logger.log({
      level: 'error',
      timestamp: dayjs().utc(),
      message,
      context,
    });
  }

  private getConsolePrintCallback(): (info: Info) => string {
    return (info: Info) => {
      let str = `[${info.timestamp}]`;
      str += ` ${this.getColoredLogType(info.type)}`;
      str += ` ${info.message}`;
      if (info.context) {
        str += ` ${JSON.stringify(info.context)}`;
      }

      return str;
    };
  }

  private getColoredLogType(type: string): string {
    if (['error'].includes(type)) {
      return chalk.red(type);
    }
    if (['warn'].includes(type)) {
      return chalk.yellow(type);
    }
    if (['info'].includes(type)) {
      return chalk.blue(type);
    }
    return type;
  }

  private makeAppConsoleTransport() {
    const printClb = this.getConsolePrintCallback();
    return new winston.transports.Console({
      level: 'silly',
      format: format.combine(
        format.timestamp({
          format: () => dayjs().format('HH:mm:ss.SSS'),
        }),
        // @ts-ignore
        format.printf(printClb),
      ),
    });
  }

  private makeCombinedFileTransport() {
    return new winston.transports.DailyRotateFile({
      level: 'info',
      filename: COMBINED_LOGS_FILEPATH,
      frequency: '7d',
    });
  }

  private makeAppFileTransport() {
    return new winston.transports.DailyRotateFile({
      level: 'info',
      filename: APP_LOGS_FILEPATH,
      frequency: '7d',
    });
  }
}