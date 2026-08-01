import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { CREATOROS_QUEUE } from './queue.constants';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly queue: Queue;

  constructor(config: ConfigService) {
    const redisUrl =
      config.get<string>('REDIS_URL') ??
      process.env.REDIS_URL ??
      'redis://localhost:6379';

    this.queue = new Queue(CREATOROS_QUEUE, {
      connection: {
        url: redisUrl,
      },
    });
  }

  add(name: string, payload: unknown) {
    return this.queue.add(name, payload, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 500,
      removeOnFail: 1000,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close();
  }
}