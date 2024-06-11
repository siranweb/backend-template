import { CronConfig, IScheduler } from '@/infrastructure/scheduler/types/scheduler.interface';
import { CronJob } from 'cron';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';

export class Scheduler implements IScheduler {
  private jobs: CronJob[] = [];

  constructor(private readonly logger: ILogger) {}

  public add(cron: string, name: string, action: () => any, config: CronConfig = {}): void {
    const job = CronJob.from({
      cronTime: cron,
      onTick: () => {
        const timestamp = Date.now();
        this.logger.info(`${name} was launched on ${new Date(timestamp).toLocaleString()}.`);
        action();
      },
      start: false,
      runOnInit: config.onInit,
    });

    this.jobs.push(job);
  }

  public start() {
    this.jobs.forEach((job) => job.start());
    this.logger.info(`Scheduler was started.`);
  }
}
