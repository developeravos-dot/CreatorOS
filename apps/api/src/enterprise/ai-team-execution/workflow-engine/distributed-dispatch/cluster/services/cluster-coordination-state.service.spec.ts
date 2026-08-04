import {
  ClusterCoordinationStateService,
} from './cluster-coordination-state.service';

describe(
  'ClusterCoordinationStateService',
  () => {
    it(
      'stores and versions shared state',
      () => {
        const service =
          new ClusterCoordinationStateService();

        const first =
          service.set({
            key:
              'scheduler:cursor',
            value: {
              cursor: 1,
            },
          });

        const second =
          service.compareAndSet(
            'scheduler:cursor',
            first.version,
            {
              cursor: 2,
            },
          );

        expect(first.version)
          .toBe(1);

        expect(second.version)
          .toBe(2);
      },
    );

    it(
      'rejects version conflicts',
      () => {
        const service =
          new ClusterCoordinationStateService();

        service.set({
          key:
            'scheduler:cursor',
          value: 1,
        });

        expect(() =>
          service.compareAndSet(
            'scheduler:cursor',
            0,
            2,
          ),
        ).toThrow(
          'version conflict',
        );
      },
    );

    it(
      'expires state entries',
      () => {
        const service =
          new ClusterCoordinationStateService();

        service.set({
          key:
            'temporary',
          value: true,
          ttlMs: 60_000,
          now:
            new Date(
              '2026-08-04T08:00:00.000Z',
            ),
        });

        expect(
          service.get(
            'temporary',
            new Date(
              '2026-08-04T08:01:00.000Z',
            ),
          ),
        ).toBeNull();
      },
    );

    it(
      'returns immutable state snapshots',
      () => {
        const service =
          new ClusterCoordinationStateService();

        service.set({
          key: 'state',
          value: {
            nested: {
              count: 1,
            },
          },
        });

        const first =
          service.get('state');

        const second =
          service.get('state');

        expect(first)
          .toEqual(second);

        expect(first)
          .not.toBe(second);

        expect(first?.value)
          .not.toBe(
            second?.value,
          );
      },
    );
  },
);