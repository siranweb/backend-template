import { Scheduler } from '@/lib/scheduler';
import { IScheduler } from '@/lib/scheduler/types/scheduler.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';

export function makeScheduler(logger: ILogger): IScheduler {
  const scheduler = new Scheduler(logger);

  scheduler.add('* * * * *', 'Test scheduler', () => {
    console.log('I am test scheduler');
  });

  return scheduler;
}
