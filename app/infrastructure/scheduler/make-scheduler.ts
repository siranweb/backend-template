import { Scheduler } from '@/lib/scheduler';
import { IScheduler } from '@/lib/scheduler/types/scheduler.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { injectLogger } from '@/infrastructure/shared/shared.module';

export function makeScheduler(logger: ILogger = injectLogger(Scheduler.name)): IScheduler {
  return new Scheduler(logger);
}
