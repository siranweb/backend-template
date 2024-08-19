import { pino, Logger as PinoLogger, LoggerOptions as PinoLoggerOptions } from 'pino';
import { ILogger, LoggerOptions } from '@/infrastructure/logger/types/logger.interface';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';

export class Logger implements ILogger {
  private context: string;
  private readonly pinoLogger: PinoLogger;
  private readonly requestStorage?: IRequestStorage;

  constructor(options: LoggerOptions = {}) {
    this.context = options.context ?? '';
    this.requestStorage = options.requestStorage;

    const pinoConfig: PinoLoggerOptions = {
      level: options.level ?? 'info',
      formatters: {
        level: (label: string) => ({
          level: label,
        }),
      },
    };
    if (options.pretty) {
      pinoConfig.transport = {
        target: 'pino-pretty',
      };
    }

    if (this.requestStorage) {
      pinoConfig.mixin = () => {
        return {
          requestId: this.requestStorage!.getStore()?.requestId,
        };
      };
    }

    this.pinoLogger = pino(pinoConfig);
  }

  public setContext(context: string): void {
    this.context = context;
  }

  public trace(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.trace(data, this.prepareMessage(message));
  }

  public debug(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.debug(data, this.prepareMessage(message));
  }

  public info(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.info(data, this.prepareMessage(message));
  }

  public warn(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.warn(data, this.prepareMessage(message));
  }

  public error(error: Error, message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.error(
      { ...data, error: this.getPlainError(error) },
      this.prepareMessage(message),
    );
  }

  public fatal(error: Error, message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.fatal({ ...data, error }, this.prepareMessage(message));
  }

  private prepareMessage(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }

  private getPlainError(error: object): object {
    const plainError: object = { ...error };
    // @ts-ignore
    Object.getOwnPropertyNames(error).forEach((name) => (plainError[name] = error[name]));
    return plainError;
  }
}
