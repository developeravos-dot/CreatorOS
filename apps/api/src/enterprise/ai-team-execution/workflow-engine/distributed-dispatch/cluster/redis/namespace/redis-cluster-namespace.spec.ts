import {
  RedisClusterNamespace,
} from './redis-cluster-namespace';

describe(
  'RedisClusterNamespace',
  () => {
    it(
      'creates a deterministic namespace',
      () => {
        const namespace =
          new RedisClusterNamespace({
            application:
              'CreatorOS',
            environment:
              'Production',
            clusterId:
              'Primary Cluster',
          });

        expect(namespace.prefix)
          .toBe(
            'creatoros:production:primary-cluster:cluster:v1',
          );
      },
    );

    it(
      'qualifies and strips keys',
      () => {
        const namespace =
          new RedisClusterNamespace({
            application:
              'creatoros',
            environment:
              'test',
            clusterId:
              'cluster-one',
          });

        const key =
          namespace.qualify(
            'nodes',
            'node-a',
          );

        expect(
          namespace.contains(key),
        ).toBe(true);

        expect(
          namespace.strip(key),
        ).toBe(
          'nodes:node-a',
        );
      },
    );

    it(
      'rejects foreign keys',
      () => {
        const namespace =
          new RedisClusterNamespace({
            application:
              'creatoros',
            environment:
              'test',
            clusterId:
              'cluster-one',
          });

        expect(() =>
          namespace.strip(
            'another:key',
          ),
        ).toThrow(
          'does not belong',
        );
      },
    );
  },
);