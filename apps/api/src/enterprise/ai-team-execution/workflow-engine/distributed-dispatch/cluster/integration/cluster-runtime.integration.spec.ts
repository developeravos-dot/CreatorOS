import {
  ClusterCoordinationStateService,
  ClusterJobOwnershipService,
  ClusterLeaderElectionService,
  ClusterLockService,
  ClusterMembershipService,
  ClusterMonitoringService,
  ClusterSchedulerService,
} from '../services';

describe(
  'Distributed cluster runtime integration',
  () => {
    const baseTime =
      new Date(
        '2026-08-04T08:00:00.000Z',
      );

    function addMilliseconds(
      milliseconds: number,
    ): Date {
      return new Date(
        baseTime.getTime() +
        milliseconds,
      );
    }

    function registerNode(
      membership:
        ClusterMembershipService,
      nodeId: string,
      processId: number,
      maximumConcurrency: number,
    ): void {
      membership.register({
        nodeId,
        instanceId:
          `${nodeId}-instance`,
        host:
          `${nodeId}.internal`,
        processId,
        capabilities: {
          queues: [
            'workflow-execution',
            'workflow-step',
            'workflow-retry',
          ],
          jobTypes: [
            'workflow.execute',
            'workflow.step.execute',
            'workflow.retry.execute',
          ],
          maximumConcurrency,
          labels: {
            region: 'primary',
          },
        },
        now: baseTime,
      });
    }

    function setup() {
      const membership =
        new ClusterMembershipService();

      registerNode(
        membership,
        'node-a',
        100,
        8,
      );

      registerNode(
        membership,
        'node-b',
        101,
        6,
      );

      registerNode(
        membership,
        'node-c',
        102,
        4,
      );

      const election =
        new ClusterLeaderElectionService(
          membership,
        );

      const locks =
        new ClusterLockService();

      const coordinationState =
        new ClusterCoordinationStateService();

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

      const monitoring =
        new ClusterMonitoringService(
          membership,
          election,
          locks,
          ownership,
          scheduler,
        );

      return {
        membership,
        election,
        locks,
        coordinationState,
        scheduler,
        ownership,
        monitoring,
      };
    }

    it(
      'runs leader-only scheduling across multiple nodes',
      () => {
        const runtime =
          setup();

        const leader =
          runtime.election
            .electDeterministically(
              1,
              [
                'node-a',
                'node-b',
                'node-c',
              ],
              300_000,
              baseTime,
            );

        expect(leader.nodeId)
          .toBe('node-a');

        const claim =
          runtime.scheduler.claim({
            scheduleId:
              'daily-workflow',
            nodeId:
              leader.nodeId,
            executionKey:
              'daily-workflow:2026-08-04',
            leaseDurationMs:
              120_000,
            now:
              addMilliseconds(
                10_000,
              ),
          });

        expect(claim.nodeId)
          .toBe('node-a');

        expect(
          claim.fencingToken,
        ).toBeGreaterThan(0);

        expect(() =>
          runtime.scheduler.claim({
            scheduleId:
              'daily-workflow',
            nodeId:
              'node-b',
            executionKey:
              'daily-workflow:2026-08-04:secondary',
            leaseDurationMs:
              120_000,
            now:
              addMilliseconds(
                11_000,
              ),
          }),
        ).toThrow(
          'Only the active cluster leader',
        );

        const completed =
          runtime.scheduler.complete(
            claim.executionKey,
            claim.nodeId,
            claim.fencingToken,
            addMilliseconds(
              20_000,
            ),
          );

        expect(
          completed.completedAt,
        ).toEqual(
          addMilliseconds(
            20_000,
          ),
        );
      },
    );

    it(
      'prevents duplicate distributed executions',
      () => {
        const runtime =
          setup();

        runtime.election.elect({
          candidateNodeId:
            'node-a',
          term: 1,
          eligibleNodeIds: [
            'node-a',
            'node-b',
            'node-c',
          ],
          now: baseTime,
        }, 300_000);

        runtime.scheduler.claim({
          scheduleId:
            'schedule-one',
          nodeId:
            'node-a',
          executionKey:
            'schedule-one:run-one',
          leaseDurationMs:
            120_000,
          now:
            addMilliseconds(
              10_000,
            ),
        });

        expect(() =>
          runtime.scheduler.claim({
            scheduleId:
              'schedule-one',
            nodeId:
              'node-a',
            executionKey:
              'schedule-one:run-one',
            leaseDurationMs:
              120_000,
            now:
              addMilliseconds(
                20_000,
              ),
          }),
        ).toThrow(
          'already claimed',
        );

        expect(
          runtime.scheduler
            .getMetrics(
              addMilliseconds(
                21_000,
              ),
            )
            .duplicateExecutionsPrevented,
        ).toBe(1);
      },
    );

    it(
      'fails over leadership and recovers lost-node ownership',
      () => {
        const runtime =
          setup();

        const originalLeader =
          runtime.election.elect({
            candidateNodeId:
              'node-a',
            term: 1,
            eligibleNodeIds: [
              'node-a',
              'node-b',
              'node-c',
            ],
            now: baseTime,
          }, 300_000);

        expect(
          originalLeader.nodeId,
        ).toBe('node-a');

        const firstOwnership =
          runtime.ownership.assign({
            resourceType:
              'workflow-execution',
            resourceId:
              'execution-one',
            ownerNodeId:
              'node-a',
            leaseDurationMs:
              180_000,
            now:
              addMilliseconds(
                10_000,
              ),
          });

        const secondOwnership =
          runtime.ownership.assign({
            resourceType:
              'workflow-execution',
            resourceId:
              'execution-two',
            ownerNodeId:
              'node-a',
            leaseDurationMs:
              180_000,
            now:
              addMilliseconds(
                11_000,
              ),
          });

        expect(
          firstOwnership.ownerNodeId,
        ).toBe('node-a');

        expect(
          secondOwnership.ownerNodeId,
        ).toBe('node-a');

        runtime.membership.markOffline(
          'node-a',
          addMilliseconds(
            30_000,
          ),
        );

        const replacementLeader =
          runtime.election.failover(
            [
              'node-a',
              'node-b',
              'node-c',
            ],
            300_000,
            addMilliseconds(
              31_000,
            ),
          );

        expect(
          replacementLeader.nodeId,
        ).toBe('node-b');

        expect(
          replacementLeader.term,
        ).toBe(2);

        const recovered =
          runtime.ownership
            .recoverLostNode(
              'node-a',
              'node-b',
              180_000,
              addMilliseconds(
                32_000,
              ),
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

        expect(
          recovered.every(
            (ownership) =>
              ownership.state ===
              'recovered',
          ),
        ).toBe(true);

        expect(
          recovered.every(
            (ownership) =>
              ownership
                .previousOwnerNodeId ===
              'node-a',
          ),
        ).toBe(true);

        const claim =
          runtime.scheduler.claim({
            scheduleId:
              'post-failover',
            nodeId:
              replacementLeader.nodeId,
            executionKey:
              'post-failover:run-one',
            leaseDurationMs:
              120_000,
            now:
              addMilliseconds(
                40_000,
              ),
          });

        expect(claim.nodeId)
          .toBe('node-b');
      },
    );

    it(
      'coordinates shared state through optimistic versioning',
      () => {
        const runtime =
          setup();

        const initial =
          runtime.coordinationState.set({
            key:
              'cluster:scheduler-cursor',
            value: {
              sequence: 1,
            },
            ownerNodeId:
              'node-a',
            now: baseTime,
          });

        const updated =
          runtime.coordinationState
            .compareAndSet(
              initial.key,
              initial.version,
              {
                sequence: 2,
              },
              'node-a',
              addMilliseconds(
                1_000,
              ),
            );

        expect(initial.version)
          .toBe(1);

        expect(updated.version)
          .toBe(2);

        expect(() =>
          runtime.coordinationState
            .compareAndSet(
              initial.key,
              1,
              {
                sequence: 3,
              },
              'node-b',
              addMilliseconds(
                2_000,
              ),
            ),
        ).toThrow(
          'version conflict',
        );
      },
    );

    it(
      'produces global cluster health after failover and recovery',
      () => {
        const runtime =
          setup();

        runtime.election.elect({
          candidateNodeId:
            'node-a',
          term: 1,
          eligibleNodeIds: [
            'node-a',
            'node-b',
            'node-c',
          ],
          now: baseTime,
        }, 300_000);

        runtime.ownership.assign({
          resourceType:
            'job',
          resourceId:
            'job-one',
          ownerNodeId:
            'node-a',
          leaseDurationMs:
            180_000,
          now:
            addMilliseconds(
              10_000,
            ),
        });

        runtime.membership.markOffline(
          'node-a',
          addMilliseconds(
            30_000,
          ),
        );

        runtime.election.failover(
          [
            'node-a',
            'node-b',
            'node-c',
          ],
          300_000,
          addMilliseconds(
            31_000,
          ),
        );

        runtime.ownership
          .recoverLostNode(
            'node-a',
            'node-b',
            180_000,
            addMilliseconds(
              32_000,
            ),
          );

        const snapshot =
          runtime.monitoring.collect(
            addMilliseconds(
              40_000,
            ),
          );

        expect(
          snapshot.health
            .leaderNodeId,
        ).toBe('node-b');

        expect(
          snapshot.health.status,
        ).toBe('degraded');

        expect(
          snapshot.health.warnings,
        ).toContain(
          'cluster_nodes_offline',
        );

        expect(
          snapshot.metrics
            .leaderFailovers,
        ).toBeGreaterThanOrEqual(1);

        expect(
          snapshot.metrics
            .ownershipRecoveries,
        ).toBe(1);
      },
    );
  },
);