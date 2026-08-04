import {
  RedisClusterTtl,
} from './redis-cluster-ttl';

describe(
  'RedisClusterTtl',
  () => {
    const now =
      new Date(
        '2026-08-04T10:00:00.000Z',
      );

    it(
      'calculates expiration and remaining ttl',
      () => {
        const expiresAt =
          RedisClusterTtl.expiresAt(
            60_000,
            now,
          );

        expect(expiresAt)
          .toEqual(
            new Date(
              '2026-08-04T10:01:00.000Z',
            ),
          );

        expect(
          RedisClusterTtl.remaining(
            expiresAt,
            new Date(
              '2026-08-04T10:00:30.000Z',
            ),
          ),
        ).toBe(30_000);
      },
    );

    it(
      'recognizes the exact expiration boundary',
      () => {
        const expiresAt =
          new Date(
            '2026-08-04T10:01:00.000Z',
          );

        expect(
          RedisClusterTtl.isExpired(
            expiresAt,
            expiresAt,
          ),
        ).toBe(true);
      },
    );

    it(
      'supports records without ttl',
      () => {
        expect(
          RedisClusterTtl.expiresAt(
            null,
            now,
          ),
        ).toBeNull();

        expect(
          RedisClusterTtl.remaining(
            null,
            now,
          ),
        ).toBeNull();
      },
    );

    it(
      'rejects invalid ttl values',
      () => {
        expect(() =>
          RedisClusterTtl.normalize(
            0,
          ),
        ).toThrow(
          'positive integer',
        );
      },
    );

    it(
      'rejects expiration dates in the past',
      () => {
        expect(() =>
          RedisClusterTtl.requireFuture(
            new Date(
              '2026-08-04T09:59:59.000Z',
            ),
            now,
          ),
        ).toThrow(
          'must be in the future',
        );
      },
    );
  },
);