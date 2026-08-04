import {
  ClusterJobOwnershipService,
} from './cluster-job-ownership.service';
import {
  ClusterLeaderElectionService,
} from './cluster-leader-election.service';
import {
  ClusterLockService,
} from './cluster-lock.service';
import {
  ClusterMembershipService,
} from './cluster-membership.service';
import {
  ClusterMonitoringService,
} from './cluster-monitoring.service';
import {
  ClusterSchedulerService,
} from './cluster-scheduler.service';

describe(
  'ClusterMonitoringService',
  () => {
    function setup(): {
      readonly monitoring:
        ClusterMonitoringService;
      readonly membership:
        ClusterMembershipService;
      readonly election:
        ClusterLeaderElectionService;
      readonly scheduler:
        ClusterSchedulerService;
      readonly ownership:
        ClusterJobOwnershipService;
    } {
      const membership =
        new ClusterMembershipService();

      membership.register({
        nodeId: 'node-a',
        instanceId:
          'node-a-instance',
        host:
          'node-a.internal',
        processId: 100,
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

      membership.register({
        nodeId: 'node-b',
        instanceId:
          'node-b-instance',
        host:
          'node-b.internal',
        processId: 101,
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

      const election =
        new ClusterLeaderElectionService(
          membership,
        );

      election.elect(
        {
          candidateNodeId:
            'node-a',
          term: 1,
          eligibleNodeIds: [
            'node-a',
            'node-b',
          ],
          now:
            new Date(
              '2026-08-04T08:00:00.000Z',
            ),
        },
        120_000,
      );

      const locks =
        new ClusterLockService();

      const scheduler =
        new ClusterSchedulerService(
          election,
          locks,
        );

      const ownership =
        new ClusterJobOwnershipService(
          membership,
          locks,
        );

      return {
        monitoring:
          new ClusterMonitoringService(
            membership,
            election,
            locks,
            ownership,
            scheduler,
          ),
        membership,
        election,
        scheduler,
        ownership,
      };
    }

    it(
      'reports a healthy active cluster',
      () => {
        const {
          monitoring,
        } = setup();

        const snapshot =
          monitoring.collect(
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(
          snapshot.health.status,
        ).toBe('healthy');

        expect(
          snapshot.health
            .leaderNodeId,
        ).toBe('node-a');

        expect(
          snapshot.health
            .activeNodes,
        ).toBe(2);

        expect(
          snapshot.health.warnings,
        ).toEqual([]);
      },
    );

    it(
      'reports degraded health when a node is offline',
      () => {
        const {
          monitoring,
          membership,
        } = setup();

        membership.markOffline(
          'node-b',
        );

        const snapshot =
          monitoring.collect(
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(
          snapshot.health.status,
        ).toBe('degraded');

        expect(
          snapshot.health.warnings,
        ).toContain(
          'cluster_nodes_offline',
        );
      },
    );

    it(
      'reports unhealthy health when the leader is missing',
      () => {
        const {
          monitoring,
          election,
        } = setup();

        election.revoke(
          'test',
          new Date(
            '2026-08-04T08:00:30.000Z',
          ),
        );

        const snapshot =
          monitoring.collect(
            new Date(
              '2026-08-04T08:00:31.000Z',
            ),
          );

        expect(
          snapshot.health.status,
        ).toBe('unhealthy');

        expect(
          snapshot.health.warnings,
        ).toContain(
          'cluster_leader_missing',
        );
      },
    );

    it(
      'aggregates scheduler and ownership metrics',
      () => {
        const {
          monitoring,
          scheduler,
          ownership,
        } = setup();

        scheduler.claim({
          scheduleId:
            'schedule-one',
          nodeId:
            'node-a',
          executionKey:
            'schedule-one:run-one',
          leaseDurationMs:
            60_000,
          now:
            new Date(
              '2026-08-04T08:00:10.000Z',
            ),
        });

        ownership.assign({
          resourceType:
            'workflow-execution',
          resourceId:
            'execution-one',
          ownerNodeId:
            'node-b',
          leaseDurationMs:
            60_000,
          now:
            new Date(
              '2026-08-04T08:00:10.000Z',
            ),
        });

        const snapshot =
          monitoring.collect(
            new Date(
              '2026-08-04T08:00:20.000Z',
            ),
          );

        expect(
          snapshot.health
            .activeSchedulerClaims,
        ).toBe(1);

        expect(
          snapshot.health
            .activeOwnerships,
        ).toBe(1);

        expect(
          snapshot.metrics
            .schedulerClaims,
        ).toBe(1);

        expect(
          snapshot.metrics
            .ownershipAssignments,
        ).toBe(1);
      },
    );

    it(
      'returns independent monitoring snapshots',
      () => {
        const {
          monitoring,
        } = setup();

        const first =
          monitoring.collect(
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        const second =
          monitoring.collect(
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(first)
          .toEqual(second);

        expect(first)
          .not.toBe(second);

        expect(first.health)
          .not.toBe(
            second.health,
          );

        expect(first.metrics)
          .not.toBe(
            second.metrics,
          );
      },
    );
  },
);