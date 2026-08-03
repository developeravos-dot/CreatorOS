import {
  InMemoryJobQueueAdapter,
} from '../queue';
import {
  JobQueueFactoryService,
} from './job-queue-factory.service';

describe(
  'JobQueueFactoryService',
  () => {
    let service:
      JobQueueFactoryService;

    beforeEach(() => {
      service =
        new JobQueueFactoryService();
    });

    it(
      'creates in-memory queues',
      () => {
        const queue =
          service.create(
            'default',
            {
              driver:
                'memory',
              concurrency: 2,
            },
          );

        expect(queue.name).toBe(
          'default',
        );

        expect(
          service.get(
            'default',
          ),
        ).toBe(queue);
      },
    );

    it(
      'rejects duplicate queues',
      () => {
        service.create(
          'default',
        );

        expect(() =>
          service.create(
            'default',
          ),
        ).toThrow(
          'already exists',
        );
      },
    );

    it(
      'registers custom adapters',
      () => {
        const adapter =
          new InMemoryJobQueueAdapter(
            'custom',
          );

        service.register(
          adapter,
        );

        expect(
          service.require(
            'custom',
          ),
        ).toBe(adapter);
      },
    );

    it(
      'aggregates queue metrics',
      () => {
        const first =
          service.create(
            'first',
          );

        const second =
          service.create(
            'second',
          );

        first.enqueue({
          id: 'one',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'first',
          priority:
            'normal',
          payload: {},
        });

        second.enqueue({
          id: 'two',
          jobId: 'job-two',
          executionId:
            'execution-two',
          queueName:
            'second',
          priority:
            'normal',
          payload: {},
          delayMs: 60_000,
        });

        const metrics =
          service
            .aggregateMetrics();

        expect(metrics.waiting)
          .toBe(1);

        expect(metrics.delayed)
          .toBe(1);

        expect(metrics.total)
          .toBe(2);
      },
    );

    it(
      'rejects BullMQ before its adapter is implemented',
      () => {
        expect(() =>
          service.create(
            'bull',
            {
              driver:
                'bullmq',
            },
          ),
        ).toThrow(
          'not implemented',
        );
      },
    );
  },
);