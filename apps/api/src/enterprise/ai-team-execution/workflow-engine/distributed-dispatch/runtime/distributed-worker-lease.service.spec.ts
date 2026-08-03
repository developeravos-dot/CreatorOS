import {
  DistributedWorkerLeaseService,
} from './distributed-worker-lease.service';

describe('DistributedWorkerLeaseService', () => {
  let service: DistributedWorkerLeaseService;

  beforeEach(() => {
    jest.useFakeTimers();

    jest.setSystemTime(
      new Date('2026-08-04T00:00:00.000Z'),
    );

    service =
      new DistributedWorkerLeaseService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('acquires and renews leases', () => {
    const acquired = service.acquire(
      'workflow-worker',
      'node-1',
      30_000,
    );

    expect(acquired.ownerId).toBe('node-1');

    jest.setSystemTime(
      new Date('2026-08-04T00:00:10.000Z'),
    );

    const renewed = service.renew(
      'workflow-worker',
      'node-1',
    );

    expect(renewed.expiresAt).toEqual(
      new Date('2026-08-04T00:00:40.000Z'),
    );
  });

  it('prevents multiple owners', () => {
    service.acquire(
      'workflow-worker',
      'node-1',
    );

    expect(() =>
      service.acquire(
        'workflow-worker',
        'node-2',
      ),
    ).toThrow('already has an active lease');
  });

  it('expires leases', () => {
    service.acquire(
      'workflow-worker',
      'node-1',
      1_000,
    );

    jest.setSystemTime(
      new Date('2026-08-04T00:00:01.001Z'),
    );

    expect(
      service.hasActiveLease(
        'workflow-worker',
      ),
    ).toBe(false);
  });

  it('releases leases', () => {
    service.acquire(
      'workflow-worker',
      'node-1',
    );

    expect(
      service.release(
        'workflow-worker',
        'node-1',
      ),
    ).toBe(true);
  });
});
