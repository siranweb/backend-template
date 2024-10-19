import { pino, Logger as PinoLogger, LoggerOptions as PinoLoggerOptions } from 'pino';
import { ILogger, LoggerOptions } from '@/lib/logger/types/logger.interface';
import { IRequestStorage } from '@/infrastructure/shared/types/request-storage.interface';
import { IConfig, NodeEnv } from '@/infrastructure/shared/types/config.interface';

export class Logger implements ILogger {
  private context: string;
  private readonly pinoLogger: PinoLogger;

  constructor(
    private readonly requestStorage: IRequestStorage,
    private readonly config: IConfig,
    options: LoggerOptions = {},
  ) {
    this.context = options.context ?? '';

    const level = this.config.nodeEnv === NodeEnv.DEVELOPMENT ? 'trace' : 'info';
    const pretty = config.nodeEnv === NodeEnv.DEVELOPMENT;

    const pinoConfig: PinoLoggerOptions = {
      level,
      formatters: {
        level: (label: string) => ({
          level: label,
        }),
      },
    };

    if (pretty) {
      pinoConfig.transport = {
        target: 'pino-pretty',
      };
    }

    pinoConfig.mixin = () => {
      return {
        requestId: this.requestStorage!.getStore()?.requestId,
      };
    };

    this.pinoLogger = pino(pinoConfig);
  }

  public setContext(context: string): void {
    this.context = context;
  }

  public child(context: string): ILogger {
    return new Logger(this.requestStorage, this.config, { context });
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
    return this.withContext(message);
  }

  private withContext(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }

  private getPlainError(error: object): object {
    const plainError: object = { ...error };
    // @ts-ignore
    Object.getOwnPropertyNames(error).forEach((name) => (plainError[name] = error[name]));
    return plainError;
  }
}
