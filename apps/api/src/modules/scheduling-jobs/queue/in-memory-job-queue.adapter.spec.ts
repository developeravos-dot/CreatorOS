import {
  InMemoryJobQueueAdapter,
} from './in-memory-job-queue.adapter';

describe(
  'InMemoryJobQueueAdapter',
  () => {
    function createQueue() {
      return new InMemoryJobQueueAdapter(
        'default',
        {
          concurrency: 1,
        },
      );
    }

    it(
      'enqueues queue items',
      () => {
        const queue =
          createQueue();

        const item =
          queue.enqueue({
            id: 'item-one',
            jobId: 'job-one',
            executionId:
              'execution-one',
            queueName:
              'default',
            priority:
              'normal',
            payload: {
              safe: true,
            },
          });

        expect(item.state).toBe(
          'queued',
        );

        expect(queue.list())
          .toHaveLength(1);
      },
    );

    it(
      'orders items by priority',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'low',
          jobId: 'job-low',
          executionId:
            'execution-low',
          queueName:
            'default',
          priority: 'low',
          payload: {},
        });

        queue.enqueue({
          id: 'critical',
          jobId:
            'job-critical',
          executionId:
            'execution-critical',
          queueName:
            'default',
          priority:
            'critical',
          payload: {},
        });

        expect(
          queue.peek()?.id,
        ).toBe('critical');
      },
    );

    it(
      'supports delayed items',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'delayed',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
          delayMs: 60_000,
        });

        expect(
          queue.peek(
            new Date(
              Date.now() +
              30_000,
            ).toISOString(),
          ),
        ).toBeUndefined();

        expect(
          queue.peek(
            new Date(
              Date.now() +
              120_000,
            ).toISOString(),
          )?.id,
        ).toBe('delayed');
      },
    );

    it(
      'dequeues and leases items',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'item-one',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
        });

        const item =
          queue.dequeue({
            workerId:
              'worker-one',
            leaseDurationMs:
              60_000,
          });

        expect(item?.state)
          .toBe('running');

        expect(item?.workerId)
          .toBe('worker-one');

        expect(
          item?.leaseExpiresAt,
        ).toBeDefined();
      },
    );

    it(
      'enforces concurrency',
      () => {
        const queue =
          createQueue();

        for (
          const id of [
            'one',
            'two',
          ]
        ) {
          queue.enqueue({
            id,
            jobId:
              `job-${id}`,
            executionId:
              `execution-${id}`,
            queueName:
              'default',
            priority:
              'normal',
            payload: {},
          });
        }

        expect(
          queue.dequeue({
            workerId:
              'worker-one',
            leaseDurationMs:
              60_000,
          }),
        ).toBeDefined();

        expect(
          queue.dequeue({
            workerId:
              'worker-two',
            leaseDurationMs:
              60_000,
          }),
        ).toBeUndefined();
      },
    );

    it(
      'releases running items',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'item-one',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
        });

        queue.dequeue({
          workerId:
            'worker-one',
          leaseDurationMs:
            60_000,
        });

        const released =
          queue.release(
            'item-one',
          );

        expect(released.state)
          .toBe('queued');

        expect(
          released.workerId,
        ).toBeUndefined();

        expect(
          released.attemptsMade,
        ).toBe(1);
      },
    );

    it(
      'acknowledges completed queue items',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'item-one',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
        });

        queue.dequeue({
          workerId:
            'worker-one',
          leaseDurationMs:
            60_000,
        });

        expect(
          queue.acknowledge(
            'item-one',
          ),
        ).toBe(true);

        expect(queue.list())
          .toHaveLength(0);
      },
    );

    it(
      'supports pause and resume',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'item-one',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
        });

        queue.pause();

        expect(
          queue.dequeue({
            workerId:
              'worker-one',
            leaseDurationMs:
              60_000,
          }),
        ).toBeUndefined();

        queue.resume();

        expect(
          queue.dequeue({
            workerId:
              'worker-one',
            leaseDurationMs:
              60_000,
          }),
        ).toBeDefined();
      },
    );

    it(
      'calculates queue metrics',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'queued',
          jobId:
            'job-queued',
          executionId:
            'execution-queued',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
        });

        queue.enqueue({
          id: 'delayed',
          jobId:
            'job-delayed',
          executionId:
            'execution-delayed',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
          delayMs: 60_000,
        });

        const metrics =
          queue.metrics();

        expect(
          metrics.waiting,
        ).toBe(1);

        expect(
          metrics.delayed,
        ).toBe(1);

        expect(metrics.total)
          .toBe(2);
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const queue =
          createQueue();

        queue.enqueue({
          id: 'item-one',
          jobId: 'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {
            nested: true,
          },
        });

        const first =
          queue.getById(
            'item-one',
          );

        const second =
          queue.getById(
            'item-one',
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(first?.payload)
          .not.toBe(
            second?.payload,
          );
      },
    );
  },
);