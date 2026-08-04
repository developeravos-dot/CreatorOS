import {
  createEmptyClusterMetrics,
} from './cluster.models';

describe(
  'Cluster models',
  () => {
    it(
      'creates empty cluster metrics',
      () => {
        const collectedAt =
          new Date(
            '2026-08-04T08:00:00.000Z',
          );

        const metrics =
          createEmptyClusterMetrics(
            collectedAt,
          );

        expect(metrics).toEqual({
          nodeJoins: 0,
          nodeRemovals: 0,
          leaderElections: 0,
          leaderFailovers: 0,
          lockAcquisitions: 0,
          lockConflicts: 0,
          ownershipAssignments: 0,
          ownershipTransfers: 0,
          ownershipRecoveries: 0,
          schedulerClaims: 0,
          duplicateExecutionsPrevented: 0,
          collectedAt,
        });
      },
    );

    it(
      'returns an independent collection date',
      () => {
        const source =
          new Date(
            '2026-08-04T08:00:00.000Z',
          );

        const metrics =
          createEmptyClusterMetrics(
            source,
          );

        expect(
          metrics.collectedAt,
        ).not.toBe(source);

        expect(
          metrics.collectedAt,
        ).toEqual(source);
      },
    );
  },
);