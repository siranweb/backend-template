import { LevelWithSilentOrString } from 'pino';
import { IRequestStorage } from '@/infrastructure/request-storage/types/request-storage.interface';

export interface ILogger {
  /**
   * Setting logger context. Used in prefix
   */
  setContext(context: string): void;
  /**
   * Used to trace the path of code execution within a program
   * @example logger.trace('Entering createUserCase.execute() function.');
   */
  trace(message: string, data?: Record<string, any>): void;
  /**
   * Used to help developers in debugging. Usually answers "WHY that happens?"
   * @example logger.debug('User creation skipped because already exists.');
   */
  debug(message: string, data?: Record<string, any>): void;
  /**
   * Used to capture application events. Usually answers "WHAT happens?"
   * @example logger.info('Starting user creating.');
   */
  info(message: string, data?: Record<string, any>): void;
  /**
   * Used to show that something needs attention. Similar to error, but function can continue it's work
   * @example logger.warn('User with id 123 trying to log in with 10 attempts.');
   * @example logger.warn('Option "message" is deprecated. Use "statusMessage" instead.');
   */
  warn(message: string, data?: Record<string, any>): void;
  /**
   * Used to capture errors. After error function can't continue it's work
   * @example logger.error(error, 'Failed to create new user.');
   */
  error(error: Error, message: string, data?: Record<string, any>): void;
  /**
   * Used to capture fatal errors that shutdowns application (or it's part)
   * @example logger.fatal(error, 'Application is out of free disk space.');
   */
  fatal(error: Error, message: string, data?: Record<string, any>): void;
}

export type LoggerOptions = {
  pretty?: boolean;
  context?: string;
  level?: LevelWithSilentOrString;
  requestStorage?: IRequestStorage;
};
