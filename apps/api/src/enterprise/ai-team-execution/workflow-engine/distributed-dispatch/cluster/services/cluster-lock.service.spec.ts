import {
  ClusterLockService,
} from './cluster-lock.service';

describe(
  'ClusterLockService',
  () => {
    it(
      'acquires and renews a lock',
      () => {
        const service =
          new ClusterLockService();

        const lock =
          service.acquire({
            resourceKey:
              'workflow:one',
            ownerNodeId:
              'node-a',
            leaseDurationMs:
              60_000,
            now:
              new Date(
                '2026-08-04T08:00:00.000Z',
              ),
          });

        const renewed =
          service.renew(
            'workflow:one',
            'node-a',
            lock.fencingToken,
            60_000,
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(
          renewed.state,
        ).toBe('renewed');

        expect(
          renewed.expiresAt,
        ).toEqual(
          new Date(
            '2026-08-04T08:01:30.000Z',
          ),
        );
      },
    );

    it(
      'prevents conflicting owners',
      () => {
        const service =
          new ClusterLockService();

        service.acquire({
          resourceKey:
            'workflow:one',
          ownerNodeId:
            'node-a',
          leaseDurationMs:
            60_000,
        });

        expect(() =>
          service.acquire({
            resourceKey:
              'workflow:one',
            ownerNodeId:
              'node-b',
            leaseDurationMs:
              60_000,
          }),
        ).toThrow(
          'owned by node',
        );
      },
    );

    it(
      'validates fencing tokens',
      () => {
        const service =
          new ClusterLockService();

        const lock =
          service.acquire({
            resourceKey:
              'workflow:one',
            ownerNodeId:
              'node-a',
            leaseDurationMs:
              60_000,
          });

        expect(() =>
          service.release(
            'workflow:one',
            'node-a',
            lock.fencingToken + 1,
          ),
        ).toThrow(
          'Invalid fencing token',
        );
      },
    );

    it(
      'expires stale locks',
      () => {
        const service =
          new ClusterLockService();

        service.acquire({
          resourceKey:
            'workflow:one',
          ownerNodeId:
            'node-a',
          leaseDurationMs:
            60_000,
          now:
            new Date(
              '2026-08-04T08:00:00.000Z',
            ),
        });

        const expired =
          service.expire(
            new Date(
              '2026-08-04T08:01:00.000Z',
            ),
          );

        expect(expired)
          .toHaveLength(1);

        expect(
          expired[0]?.state,
        ).toBe('expired');
      },
    );

    it(
      'increments fencing tokens',
      () => {
        const service =
          new ClusterLockService();

        const first =
          service.acquire({
            resourceKey:
              'workflow:one',
            ownerNodeId:
              'node-a',
            leaseDurationMs: 1,
            now:
              new Date(
                '2026-08-04T08:00:00.000Z',
              ),
          });

        service.expire(
          new Date(
            '2026-08-04T08:00:00.001Z',
          ),
        );

        const second =
          service.acquire({
            resourceKey:
              'workflow:one',
            ownerNodeId:
              'node-b',
            leaseDurationMs:
              60_000,
            now:
              new Date(
                '2026-08-04T08:00:01.000Z',
              ),
          });

        expect(
          second.fencingToken,
        ).toBeGreaterThan(
          first.fencingToken,
        );
      },
    );
  },
);