import {
  REDIS_CLUSTER_ENTITY_TYPES,
} from './redis-cluster-store.contracts';

describe(
  'Redis cluster store contracts',
  () => {
    it(
      'defines every production cluster entity type',
      () => {
        expect(
          REDIS_CLUSTER_ENTITY_TYPES,
        ).toEqual([
          'node',
          'membership-event',
          'leader',
          'lock',
          'coordination-state',
          'scheduler-claim',
          'ownership',
          'metric',
        ]);
      },
    );

    it(
      'does not contain duplicate entity types',
      () => {
        expect(
          new Set(
            REDIS_CLUSTER_ENTITY_TYPES,
          ).size,
        ).toBe(
          REDIS_CLUSTER_ENTITY_TYPES.length,
        );
      },
    );
  },
);