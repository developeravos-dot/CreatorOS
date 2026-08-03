import {
  QueueJob,
  QueueJobOptions,
  QueueProviderHealth,
} from './queue.contracts';

describe('queue contracts', () => {
  it('supports strongly typed queue jobs', () => {
    const job: QueueJob<{
      executionId: string;
    }> = {
      id: 'job-1',
      queueName: 'workflow-execution',
      name: 'execute-workflow',
      payload: {
        executionId: 'execution-1',
      },
      status: 'waiting',
      attemptsMade: 0,
      maxAttempts: 3,
      priority: 'high',
      createdAt: new Date('2026-08-04T00:00:00.000Z'),
      processedAt: null,
      completedAt: null,
      failedAt: null,
      error: null,
      metadata: {},
    };

    expect(job.payload.executionId).toBe('execution-1');
    expect(job.status).toBe('waiting');
  });

  it('supports retry and cleanup options', () => {
    const options: QueueJobOptions = {
      attempts: 5,
      priority: 'critical',
      backoff: {
        type: 'exponential',
        delayMs: 1_000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    };

    expect(options.backoff).toEqual({
      type: 'exponential',
      delayMs: 1_000,
    });
  });

  it('supports queue provider health responses', () => {
    const health: QueueProviderHealth = {
      provider: 'bullmq',
      status: 'healthy',
      connected: true,
      latencyMs: 4,
      checkedAt: new Date('2026-08-04T00:00:00.000Z'),
      details: {
        redis: 'connected',
      },
    };

    expect(health.connected).toBe(true);
    expect(health.provider).toBe('bullmq');
  });
});
