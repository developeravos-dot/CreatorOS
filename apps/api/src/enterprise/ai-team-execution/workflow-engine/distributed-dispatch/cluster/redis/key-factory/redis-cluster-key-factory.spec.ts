import {
  RedisClusterNamespace,
} from '../namespace';
import {
  RedisClusterKeyFactory,
} from './redis-cluster-key-factory';

describe(
  'RedisClusterKeyFactory',
  () => {
    function createFactory():
      RedisClusterKeyFactory {
      return new RedisClusterKeyFactory(
        new RedisClusterNamespace({
          application:
            'creatoros',
          environment:
            'test',
          clusterId:
            'cluster-one',
        }),
      );
    }

    it(
      'creates deterministic node keys',
      () => {
        const factory =
          createFactory();

        expect(
          factory.node('node-a'),
        ).toBe(
          factory.node('node-a'),
        );

        expect(
          factory.node('node-a'),
        ).not.toBe(
          factory.node('node-b'),
        );
      },
    );

    it(
      'encodes arbitrary identifiers safely',
      () => {
        const factory =
          createFactory();

        const key =
          factory.lock(
            'workflow:one/مرحبا',
          );

        expect(key)
          .not.toContain(
            'workflow:one/مرحبا',
          );

        expect(key)
          .toContain(
            ':locks:',
          );
      },
    );

    it(
      'creates ownership and scheduler keys',
      () => {
        const factory =
          createFactory();

        expect(
          factory.ownership(
            'workflow-execution',
            'execution-one',
          ),
        ).toContain(
          ':ownership:',
        );

        expect(
          factory.schedulerClaim(
            'schedule-one:run-one',
          ),
        ).toContain(
          ':scheduler:claims:',
        );
      },
    );

    it(
      'rejects empty identifiers',
      () => {
        const factory =
          createFactory();

        expect(() =>
          factory.node('   '),
        ).toThrow(
          'nodeId is required',
        );
      },
    );
  },
);