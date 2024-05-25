import { Scheduler } from '@/lib/scheduler';
import { makeLogger } from '@/infrastructure/logger/make-logger';

const logger = makeLogger(Scheduler.name);
const scheduler = new Scheduler();
scheduler.onTrigger((ctx) =>
  logger.info(`${ctx.name} was launched on ${new Date(ctx.timestamp).toLocaleString()}`),
);

export async function startScheduler() {
  scheduler.add('* * * * *', 'Test scheduler', () => {
    console.log('I am test scheduler');
  });
}
