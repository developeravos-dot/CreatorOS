import {
  ClusterLeaderElectionService,
} from './cluster-leader-election.service';
import {
  ClusterMembershipService,
} from './cluster-membership.service';

describe(
  'ClusterLeaderElectionService',
  () => {
    function registerNode(
      membership:
        ClusterMembershipService,
      nodeId: string,
      maximumConcurrency: number,
    ): void {
      membership.register({
        nodeId,
        instanceId:
          `${nodeId}-instance`,
        host:
          `${nodeId}.internal`,
        processId: 100,
        capabilities: {
          queues: [
            'workflow-step',
          ],
          jobTypes: [
            'workflow.execute',
          ],
          maximumConcurrency,
          labels: {},
        },
        now:
          new Date(
            '2026-08-04T08:00:00.000Z',
          ),
      });
    }

    it(
      'elects an eligible active leader',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-a',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        const leader =
          service.elect(
            {
              candidateNodeId:
                'node-a',
              term: 1,
              eligibleNodeIds: [
                'node-a',
              ],
              now:
                new Date(
                  '2026-08-04T08:00:00.000Z',
                ),
            },
            60_000,
          );

        expect(leader.nodeId)
          .toBe('node-a');

        expect(
          membership
            .require('node-a')
            .role,
        ).toBe('leader');
      },
    );

    it(
      'elects deterministically by capacity then node id',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-b',
          8,
        );

        registerNode(
          membership,
          'node-a',
          8,
        );

        registerNode(
          membership,
          'node-c',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        const leader =
          service.electDeterministically(
            1,
            [
              'node-a',
              'node-b',
              'node-c',
            ],
          );

        expect(leader.nodeId)
          .toBe('node-a');
      },
    );

    it(
      'rejects stale election terms',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-a',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        service.elect({
          candidateNodeId:
            'node-a',
          term: 1,
          eligibleNodeIds: [
            'node-a',
          ],
        });

        expect(() =>
          service.elect({
            candidateNodeId:
              'node-a',
            term: 1,
            eligibleNodeIds: [
              'node-a',
            ],
          }),
        ).toThrow(
          'greater than current term',
        );
      },
    );

    it(
      'renews the active leader lease',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-a',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        service.elect(
          {
            candidateNodeId:
              'node-a',
            term: 1,
            eligibleNodeIds: [
              'node-a',
            ],
            now:
              new Date(
                '2026-08-04T08:00:00.000Z',
              ),
          },
          60_000,
        );

        const renewed =
          service.renew(
            'node-a',
            1,
            60_000,
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(
          renewed.leaseExpiresAt,
        ).toEqual(
          new Date(
            '2026-08-04T08:01:30.000Z',
          ),
        );
      },
    );

    it(
      'expires a stale leader lease',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-a',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        service.elect(
          {
            candidateNodeId:
              'node-a',
            term: 1,
            eligibleNodeIds: [
              'node-a',
            ],
            now:
              new Date(
                '2026-08-04T08:00:00.000Z',
              ),
          },
          60_000,
        );

        expect(
          service.getLeader(
            new Date(
              '2026-08-04T08:01:01.000Z',
            ),
          ),
        ).toBeNull();

        expect(
          membership
            .require('node-a')
            .role,
        ).toBe('follower');
      },
    );

    it(
      'fails over to another active node',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-a',
          8,
        );

        registerNode(
          membership,
          'node-b',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        service.elect({
          candidateNodeId:
            'node-a',
          term: 1,
          eligibleNodeIds: [
            'node-a',
            'node-b',
          ],
        });

        membership.markOffline(
          'node-a',
        );

        const leader =
          service.failover([
            'node-a',
            'node-b',
          ]);

        expect(leader.nodeId)
          .toBe('node-b');

        expect(leader.term)
          .toBe(2);
      },
    );

    it(
      'records election metrics',
      () => {
        const membership =
          new ClusterMembershipService();

        registerNode(
          membership,
          'node-a',
          4,
        );

        const service =
          new ClusterLeaderElectionService(
            membership,
          );

        service.elect({
          candidateNodeId:
            'node-a',
          term: 1,
          eligibleNodeIds: [
            'node-a',
          ],
        });

        service.renew(
          'node-a',
          1,
        );

        const metrics =
          service.getMetrics();

        expect(metrics.elections)
          .toBe(1);

        expect(metrics.renewals)
          .toBe(1);

        expect(metrics.currentTerm)
          .toBe(1);
      },
    );
  },
);