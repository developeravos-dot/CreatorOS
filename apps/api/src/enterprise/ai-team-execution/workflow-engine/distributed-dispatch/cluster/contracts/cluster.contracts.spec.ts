import {
  CLUSTER_LOCK_STATES,
  CLUSTER_MEMBERSHIP_EVENT_TYPES,
  CLUSTER_NODE_ROLES,
  CLUSTER_NODE_STATES,
  CLUSTER_OWNERSHIP_STATES,
} from './cluster.contracts';

describe(
  'Cluster contracts',
  () => {
    it(
      'defines canonical node roles',
      () => {
        expect(
          CLUSTER_NODE_ROLES,
        ).toEqual([
          'leader',
          'follower',
          'candidate',
          'observer',
        ]);
      },
    );

    it(
      'defines canonical node states',
      () => {
        expect(
          CLUSTER_NODE_STATES,
        ).toEqual([
          'joining',
          'active',
          'degraded',
          'draining',
          'offline',
          'removed',
        ]);
      },
    );

    it(
      'defines membership events without duplicates',
      () => {
        expect(
          new Set(
            CLUSTER_MEMBERSHIP_EVENT_TYPES,
          ).size,
        ).toBe(
          CLUSTER_MEMBERSHIP_EVENT_TYPES.length,
        );
      },
    );

    it(
      'defines lock and ownership states',
      () => {
        expect(
          CLUSTER_LOCK_STATES,
        ).toContain('acquired');

        expect(
          CLUSTER_OWNERSHIP_STATES,
        ).toContain('recovered');
      },
    );
  },
);