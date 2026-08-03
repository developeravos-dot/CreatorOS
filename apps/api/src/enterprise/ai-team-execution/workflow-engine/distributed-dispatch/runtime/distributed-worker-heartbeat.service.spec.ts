import {
  DistributedWorkerHeartbeatService,
} from './distributed-worker-heartbeat.service';
import {
  DistributedWorkerLeaseService,
} from './distributed-worker-lease.service';

describe('DistributedWorkerHeartbeatService', () => {
  let leases: DistributedWorkerLeaseService;
  let service:
    DistributedWorkerHeartbeatService;

  beforeEach(() => {
    leases =
      new DistributedWorkerLeaseService();

    service =
      new DistributedWorkerHeartbeatService(
        leases,
      );
  });

  it('records worker heartbeats', () => {
    leases.acquire(
      'workflow-worker',
      'node-1',
    );

    const heartbeat = service.record(
      'workflow-worker',
      'node-1',
      'running',
      {
        activeJobs: 2,
        completedJobs: 10,
      },
    );

    expect(heartbeat).toEqual(
      expect.objectContaining({
        workerName: 'workflow-worker',
        status: 'running',
        activeJobs: 2,
        completedJobs: 10,
      }),
    );
  });

  it('requires an active lease', () => {
    expect(() =>
      service.record(
        'workflow-worker',
        'node-1',
        'running',
      ),
    ).toThrow('does not have an active lease');
  });

  it('aggregates worker metrics', () => {
    leases.acquire(
      'workflow-worker',
      'node-1',
    );

    service.record(
      'workflow-worker',
      'node-1',
      'running',
      {
        activeJobs: 1,
        completedJobs: 5,
        failedJobs: 1,
      },
    );

    expect(service.getMetrics()).toEqual(
      expect.objectContaining({
        registeredWorkers: 1,
        runningWorkers: 1,
        activeLeases: 1,
        activeJobs: 1,
        completedJobs: 5,
        failedJobs: 1,
      }),
    );
  });
});
