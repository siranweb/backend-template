import { Scheduler } from '@/infrastructure/scheduler/index';
import { IScheduler } from '@/infrastructure/scheduler/types/scheduler.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';

export function makeScheduler(logger: ILogger): IScheduler {
  const scheduler = new Scheduler(logger);

  scheduler.add('* * * * *', 'Test scheduler', () => {
    console.log('I am test scheduler');
  });

  return scheduler;
}
