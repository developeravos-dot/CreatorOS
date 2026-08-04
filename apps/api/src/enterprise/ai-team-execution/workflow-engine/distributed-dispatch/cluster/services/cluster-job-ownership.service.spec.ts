import {
  ClusterJobOwnershipService,
} from './cluster-job-ownership.service';
import {
  ClusterLockService,
} from './cluster-lock.service';
import {
  ClusterMembershipService,
} from './cluster-membership.service';

describe(
  'ClusterJobOwnershipService',
  () => {
    function setup(): {
      readonly service:
        ClusterJobOwnershipService;
      readonly membership:
        ClusterMembershipService;
    } {
      const membership =
        new ClusterMembershipService();

      for (
        const [
          nodeId,
          processId,
        ]
        of [
          ['node-a', 100],
          ['node-b', 101],
          ['node-c', 102],
        ] as const
      ) {
        membership.register({
          nodeId,
          instanceId:
            `${nodeId}-instance`,
          host:
            `${nodeId}.internal`,
          processId,
          capabilities: {
            queues: [
              'workflow-step',
            ],
            jobTypes: [
              'workflow.execute',
            ],
            maximumConcurrency: 4,
            labels: {},
          },
          now:
            new Date(
              '2026-08-04T08:00:00.000Z',
            ),
        });
      }

      return {
        service:
          new ClusterJobOwnershipService(
            membership,
            new ClusterLockService(),
          ),
        membership,
      };
    }

    it(
      'assigns and renews job ownership',
      () => {
        const {
          service,
        } = setup();

        const ownership =
          service.assign({
            resourceType:
              'workflow-execution',
            resourceId:
              'execution-one',
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
            ownership.resourceType,
            ownership.resourceId,
            ownership.ownerNodeId,
            ownership.fencingToken,
            60_000,
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(renewed.state)
          .toBe('renewed');

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
      'prevents ownership conflicts',
      () => {
        const {
          service,
        } = setup();

        service.assign({
          resourceType:
            'workflow-execution',
          resourceId:
            'execution-one',
          ownerNodeId:
            'node-a',
          leaseDurationMs:
            60_000,
        });

        expect(() =>
          service.assign({
            resourceType:
              'workflow-execution',
            resourceId:
              'execution-one',
            ownerNodeId:
              'node-b',
            leaseDurationMs:
              60_000,
          }),
        ).toThrow(
          'is owned by node',
        );
      },
    );

    it(
      'transfers ownership between active nodes',
      () => {
        const {
          service,
        } = setup();

        const ownership =
          service.assign({
            resourceType:
              'workflow-execution',
            resourceId:
              'execution-one',
            ownerNodeId:
              'node-a',
            leaseDurationMs:
              60_000,
          });

        const transferred =
          service.transfer(
            ownership.resourceType,
            ownership.resourceId,
            'node-a',
            ownership.fencingToken,
            'node-b',
            60_000,
          );

        expect(
          transferred.ownerNodeId,
        ).toBe('node-b');

        expect(
          transferred
            .previousOwnerNodeId,
        ).toBe('node-a');

        expect(
          transferred.state,
        ).toBe('transferred');

        expect(
          transferred.fencingToken,
        ).toBeGreaterThan(
          ownership.fencingToken,
        );
      },
    );

    it(
      'recovers ownership from an offline node',
      () => {
        const {
          service,
          membership,
        } = setup();

        service.assign({
          resourceType:
            'workflow-execution',
          resourceId:
            'execution-one',
          ownerNodeId:
            'node-a',
          leaseDurationMs:
            60_000,
        });

        membership.markOffline(
          'node-a',
        );

        const recovered =
          service.recover(
            'workflow-execution',
            'execution-one',
            'node-b',
            60_000,
          );

        expect(
          recovered.ownerNodeId,
        ).toBe('node-b');

        expect(
          recovered
            .previousOwnerNodeId,
        ).toBe('node-a');

        expect(recovered.state)
          .toBe('recovered');
      },
    );

    it(
      'recovers every ownership held by a lost node',
      () => {
        const {
          service,
          membership,
        } = setup();

        service.assign({
          resourceType: 'job',
          resourceId: 'job-one',
          ownerNodeId: 'node-a',
          leaseDurationMs:
            60_000,
        });

        service.assign({
          resourceType: 'job',
          resourceId: 'job-two',
          ownerNodeId: 'node-a',
          leaseDurationMs:
            60_000,
        });

        membership.markOffline(
          'node-a',
        );

        const recovered =
          service.recoverLostNode(
            'node-a',
            'node-b',
            60_000,
          );

        expect(recovered)
          .toHaveLength(2);

        expect(
          recovered.every(
            (ownership) =>
              ownership.ownerNodeId ===
              'node-b',
          ),
        ).toBe(true);
      },
    );

    it(
      'expires ownership leases',
      () => {
        const {
          service,
        } = setup();

        service.assign({
          resourceType: 'job',
          resourceId: 'job-one',
          ownerNodeId: 'node-a',
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
      'returns independent ownership snapshots',
      () => {
        const {
          service,
        } = setup();

        service.assign({
          resourceType: 'job',
          resourceId: 'job-one',
          ownerNodeId: 'node-a',
          leaseDurationMs:
            60_000,
          metadata: {
            source: 'test',
          },
        });

        const first =
          service.get(
            'job',
            'job-one',
          );

        const second =
          service.get(
            'job',
            'job-one',
          );

        expect(first)
          .toEqual(second);

        expect(first)
          .not.toBe(second);

        expect(first?.metadata)
          .not.toBe(
            second?.metadata,
          );
      },
    );
  },
);