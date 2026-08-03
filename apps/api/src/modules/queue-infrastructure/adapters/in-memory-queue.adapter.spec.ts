import {
  ConflictException,
} from '@nestjs/common';
import {
  InMemoryQueueAdapter,
} from './in-memory-queue.adapter';

describe('InMemoryQueueAdapter', () => {
  let adapter: InMemoryQueueAdapter;

  beforeEach(() => {
    adapter = new InMemoryQueueAdapter();
  });

  afterEach(async () => {
    await adapter.close();
  });

  it('adds and retrieves jobs', async () => {
    const created = await adapter.add(
      'workflow',
      'execute',
      {
        executionId: 'execution-1',
      },
      {
        jobId: 'job-1',
        attempts: 3,
        priority: 'high',
      },
    );

    expect(created).toEqual(
      expect.objectContaining({
        id: 'job-1',
        queueName: 'workflow',
        name: 'execute',
        status: 'waiting',
        maxAttempts: 3,
        priority: 'high',
      }),
    );

    expect(
      await adapter.getJob('workflow', 'job-1'),
    ).toEqual(created);
  });

  it('creates delayed jobs', async () => {
    const job = await adapter.add(
      'workflow',
      'execute-later',
      {},
      {
        delayMs: 30_000,
      },
    );

    expect(job.status).toBe('delayed');
  });

  it('rejects duplicate job identifiers', async () => {
    await adapter.add(
      'workflow',
      'execute',
      {},
      {
        jobId: 'duplicate',
      },
    );

    await expect(
      adapter.add(
        'workflow',
        'execute',
        {},
        {
          jobId: 'duplicate',
        },
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('pauses and resumes queues', async () => {
    await adapter.pauseQueue('workflow');

    expect(adapter.isPaused('workflow')).toBe(
      true,
    );

    await adapter.resumeQueue('workflow');

    expect(adapter.isPaused('workflow')).toBe(
      false,
    );
  });

  it('drains queue jobs', async () => {
    await adapter.add(
      'workflow',
      'first',
      {},
    );

    await adapter.add(
      'workflow',
      'second',
      {},
    );

    await expect(
      adapter.drainQueue('workflow'),
    ).resolves.toBe(2);

    expect(adapter.listJobs('workflow')).toEqual(
      [],
    );
  });

  it('returns defensive job copies', async () => {
    const created = await adapter.add(
      'workflow',
      'execute',
      {
        nested: {
          value: 'original',
        },
      },
    );

    (
      created.payload.nested as
        | Record<string, unknown>
        | undefined
    )!.value = 'changed';

    expect(
      (
        (
          await adapter.getJob(
            'workflow',
            created.id,
          )
        )?.payload.nested as
          | Record<string, unknown>
          | undefined
      )?.value,
    ).toBe('original');
  });

  it('reports provider health', async () => {
    const health = await adapter.getHealth();

    expect(health).toEqual(
      expect.objectContaining({
        provider: 'memory',
        status: 'healthy',
        connected: true,
      }),
    );
  });
});
