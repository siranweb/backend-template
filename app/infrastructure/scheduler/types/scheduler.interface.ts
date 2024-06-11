export interface IScheduler {
  add(cron: string, name: string, action: () => any, config?: CronConfig): void;
  start(): void;
}

export type CronConfig = {
  /** Run action right on init */
  onInit?: boolean;
  /** Scheduler timezone. Should be provided as TZ identifier */
  timezone?: string;
};

export type TriggerContext = {
  timestamp: number;
  name: string;
};

export type OnTriggerClb = (context: TriggerContext) => any;
