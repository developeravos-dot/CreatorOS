import type {
  RedisClusterStoreClient,
} from '../../distributed-dispatch/cluster/redis';
import type {
  DistributedExecutionLease,
  DistributedExecutionRecord,
} from '../models';
import {
  DistributedRuntimeKeyFactory,
  RedisExecutionEventStore,
  RedisExecutionRuntimeStore,
} from '../redis';

class FakeRedisClient
  implements RedisClusterStoreClient {
  private readonly values =
    new Map<string, string>();

  private readonly counters =
    new Map<string, number>();

  get(
    key: string,
  ): Promise<string | null> {
    return Promise.resolve(
      this.values.get(key) ?? null,
    );
  }

  set(
    key: string,
    value: string,
    ...args: Array<string | number>
  ): Promise<string | null> {
    if (
      args.includes('NX') &&
      this.values.has(key)
    ) {
      return Promise.resolve(null);
    }

    if (
      args.includes('XX') &&
      !this.values.has(key)
    ) {
      return Promise.resolve(null);
    }

    this.values.set(key, value);
    return Promise.resolve('OK');
  }

  del(
    ...keys: string[]
  ): Promise<number> {
    let removed = 0;

    for (const key of keys) {
      if (this.values.delete(key)) {
        removed += 1;
      }
    }

    return Promise.resolve(removed);
  }

  exists(
    key: string,
  ): Promise<number> {
    return Promise.resolve(
      this.values.has(key) ? 1 : 0,
    );
  }

  incr(
    key: string,
  ): Promise<number> {
    const next =
      (this.counters.get(key) ?? 0) + 1;

    this.counters.set(key, next);
    return Promise.resolve(next);
  }

  mget(
    ...keys: string[]
  ): Promise<Array<string | null>> {
    return Promise.resolve(
      keys.map(
        (key) =>
          this.values.get(key) ?? null,
      ),
    );
  }

  scan(
    _cursor: string,
    ...args: Array<string | number>
  ): Promise<[string, string[]]> {
    const matchIndex =
      args.indexOf('MATCH');

    const pattern =
      matchIndex >= 0
        ? String(
            args[matchIndex + 1],
          )
        : '*';

    const prefix =
      pattern.endsWith('*')
        ? pattern.slice(0, -1)
        : pattern;

    return Promise.resolve([
      '0',
      [...this.values.keys()]
        .filter((key) =>
          key.startsWith(prefix),
        )
        .sort(),
    ]);
  }
}

describe(
  'Distributed runtime Redis integration',
  () => {
    const execution: DistributedExecutionRecord = {
      executionId: 'execution-one',
      workflowId: 'workflow-one',
      stepId: 'step-one',
      state: 'running',
      assignedWorkerId: 'worker-a',
      fencingToken: 1,
      attempt: 1,
      trace: {
        correlationId: 'correlation-one',
        traceId: 'trace-one',
        parentTraceId: null,
      },
      payload: {
        value: 1,
      },
      requiredCapabilities: [
        'workflow.execute',
      ],
      createdAt: new Date(
        '2026-08-04T10:00:00.000Z',
      ),
      updatedAt: new Date(
        '2026-08-04T10:00:01.000Z',
      ),
      startedAt: new Date(
        '2026-08-04T10:00:01.000Z',
      ),
      completedAt: null,
      lastError: null,
    };

    it(
      'persists runtime state and leases',
      async () => {
        const client =
          new FakeRedisClient();

        const store =
          new RedisExecutionRuntimeStore(
            client,
            new DistributedRuntimeKeyFactory(
              'creatoros:test-runtime',
            ),
          );

        await store.saveExecution(execution);

        await expect(
          store.getExecution(
            execution.executionId,
          ),
        ).resolves.toEqual(execution);

        const lease:
          DistributedExecutionLease = {
            executionId:
              execution.executionId,
            workerId: 'worker-a',
            fencingToken: 1,
            acquiredAt: new Date(
              '2026-08-04T10:00:01.000Z',
            ),
            expiresAt: new Date(
              '2026-08-04T10:01:01.000Z',
            ),
            releasedAt: null,
          };

        await expect(
          store.acquireLease(
            lease,
            60_000,
          ),
        ).resolves.toBe(true);

        await expect(
          store.acquireLease(
            lease,
            60_000,
          ),
        ).resolves.toBe(false);

        await expect(
          store.releaseLease(
            lease.executionId,
            lease.workerId,
            lease.fencingToken,
          ),
        ).resolves.toBe(true);
      },
    );

    it(
      'persists ordered idempotent execution events',
      async () => {
        const client =
          new FakeRedisClient();

        const store =
          new RedisExecutionEventStore(
            client,
            new DistributedRuntimeKeyFactory(
              'creatoros:test-runtime',
            ),
          );

        const sequence =
          await store.nextSequence(
            'execution-one',
          );

        const event = {
          eventId: 'event-one',
          executionId: 'execution-one',
          type:
            'execution.started' as const,
          sequence,
          occurredAt: new Date(
            '2026-08-04T10:00:01.000Z',
          ),
          payload: {},
        };

        await expect(
          store.append(event),
        ).resolves.toBe(true);

        await expect(
          store.append(event),
        ).resolves.toBe(false);

        await expect(
          store.list('execution-one'),
        ).resolves.toEqual([event]);
      },
    );
  },
);
