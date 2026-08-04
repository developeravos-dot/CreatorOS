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
  ClusterSchedulerService,
} from './cluster-scheduler.service';

describe(
  'ClusterSchedulerService',
  () => {
    function setup(): {
      readonly scheduler:
        ClusterSchedulerService;
      readonly election:
        ClusterLeaderElectionService;
      readonly membership:
        ClusterMembershipService;
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

      return {
        scheduler:
          new ClusterSchedulerService(
            election,
            new ClusterLockService(),
          ),
        election,
        membership,
      };
    }

    it(
      'allows leader-only schedule claims',
      () => {
        const {
          scheduler,
        } = setup();

        const claim =
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

        expect(claim.nodeId)
          .toBe('node-a');

        expect(
          claim.fencingToken,
        ).toBeGreaterThan(0);
      },
    );

    it(
      'rejects non-leader claims',
      () => {
        const {
          scheduler,
        } = setup();

        expect(() =>
          scheduler.claim({
            scheduleId:
              'schedule-one',
            nodeId:
              'node-b',
            executionKey:
              'schedule-one:run-one',
            leaseDurationMs:
              60_000,
            now:
              new Date(
                '2026-08-04T08:00:10.000Z',
              ),
          }),
        ).toThrow(
          'Only the active cluster leader',
        );
      },
    );

    it(
      'prevents duplicate execution claims',
      () => {
        const {
          scheduler,
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

        expect(() =>
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
                '2026-08-04T08:00:20.000Z',
              ),
          }),
        ).toThrow(
          'already claimed',
        );

        expect(
          scheduler
            .getMetrics()
            .duplicateExecutionsPrevented,
        ).toBe(1);
      },
    );

    it(
      'renews and completes claims',
      () => {
        const {
          scheduler,
        } = setup();

        const claim =
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

        const renewed =
          scheduler.renew(
            claim.executionKey,
            claim.nodeId,
            claim.fencingToken,
            60_000,
            new Date(
              '2026-08-04T08:00:30.000Z',
            ),
          );

        expect(
          renewed.expiresAt,
        ).toEqual(
          new Date(
            '2026-08-04T08:01:30.000Z',
          ),
        );

        const completed =
          scheduler.complete(
            claim.executionKey,
            claim.nodeId,
            claim.fencingToken,
            new Date(
              '2026-08-04T08:00:40.000Z',
            ),
          );

        expect(
          completed.completedAt,
        ).not.toBeNull();
      },
    );

    it(
      'expires stale claims',
      () => {
        const {
          scheduler,
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

        const expired =
          scheduler.expire(
            new Date(
              '2026-08-04T08:01:10.000Z',
            ),
          );

        expect(expired)
          .toHaveLength(1);

        expect(
          scheduler.get(
            'schedule-one:run-one',
            new Date(
              '2026-08-04T08:01:10.000Z',
            ),
          ),
        ).toBeNull();
      },
    );
  },
);