import {
  createEmptyDistributedWorkerMetrics,
  DistributedWorkerLease,
} from './distributed-worker.models';

describe('distributed worker models', () => {
  it('creates empty runtime metrics', () => {
    const collectedAt = new Date(
      '2026-08-04T00:00:00.000Z',
    );

    expect(
      createEmptyDistributedWorkerMetrics(
        collectedAt,
      ),
    ).toEqual({
      registeredWorkers: 0,
      runningWorkers: 0,
      degradedWorkers: 0,
      stoppedWorkers: 0,
      activeLeases: 0,
      expiredLeases: 0,
      activeJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      collectedAt,
    });
  });

  it('models worker leases', () => {
    const lease: DistributedWorkerLease = {
      workerName: 'workflow-worker',
      ownerId: 'node-1',
      acquiredAt: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
      renewedAt: new Date(
        '2026-08-04T00:00:00.000Z',
      ),
      expiresAt: new Date(
        '2026-08-04T00:00:30.000Z',
      ),
      leaseDurationMs: 30_000,
    };

    expect(lease.workerName).toBe(
      'workflow-worker',
    );

    expect(lease.leaseDurationMs).toBe(30_000);
  });
});
