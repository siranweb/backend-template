import { CronConfig, IScheduler, OnTriggerClb } from '@/lib/scheduler/types/scheduler.interface';
import { CronJob } from 'cron';

export class Scheduler implements IScheduler {
  private onTriggerClb?: OnTriggerClb;

  public add(cron: string, name: string, action: () => any, config: CronConfig = {}): void {
    CronJob.from({
      cronTime: cron,
      onTick: () => {
        const timestamp = Date.now();
        if (this.onTriggerClb) {
          this.onTriggerClb({
            timestamp,
            name,
          });
        }
        action();
      },
      start: true,
      runOnInit: config.onInit,
    });
  }

  public onTrigger(clb: OnTriggerClb): void {
    this.onTriggerClb = clb;
  }
}
