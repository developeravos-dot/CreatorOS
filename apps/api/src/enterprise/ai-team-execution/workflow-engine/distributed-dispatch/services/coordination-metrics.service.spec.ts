import type {
  DynamicRebalancingService,
} from './dynamic-rebalancing.service';
import type {
  FailoverRoutingService,
} from './failover-routing.service';
import type {
  HealthBasedSchedulingService,
} from './health-based-scheduling.service';
import type {
  LoadBalancerService,
} from './load-balancer.service';
import type {
  QueueAffinityService,
} from './queue-affinity.service';
import type {
  WorkerDrainingService,
} from './worker-draining.service';
import {
  CoordinationMetricsService,
} from './coordination-metrics.service';

describe(
  'CoordinationMetricsService',
  () => {
    const collectedAt =
      new Date(
        '2026-08-04T10:00:00.000Z',
      );

    function setup(
      overrides?: {
        failedSelections?: number;
        failedRoutes?: number;
        failedSchedules?: number;
        timedOutDrains?: number;
        activeJobsRemaining?: number;
        expiredBindings?: number;
      },
    ): CoordinationMetricsService {
      const loadBalancer = {
        getMetrics:
          jest.fn(() => ({
            totalSelections: 10,
            successfulSelections:
              10 -
              (
                overrides
                  ?.failedSelections ??
                0
              ),
            failedSelections:
              overrides
                ?.failedSelections ??
              0,
            selectionsByStrategy: {
              least_loaded: 10,
              round_robin: 0,
              weighted: 0,
              capacity_aware: 0,
              health_aware: 0,
            },
            selectionsByWorker: {
              'worker-a': 10,
            },
            lastSelectedWorkerName:
              'worker-a',
            collectedAt,
          })),
      } as unknown as
        LoadBalancerService;

      const affinity = {
        getMetrics:
          jest.fn(() => ({
            totalBindings: 4,
            activeBindings: 4,
            expiredBindings:
              overrides
                ?.expiredBindings ??
              0,
            affinityHits: 5,
            affinityMisses: 1,
            affinityCreates: 1,
            affinityRebinds: 0,
            affinityRemovals: 0,
            collectedAt,
          })),
      } as unknown as
        QueueAffinityService;

      const failover = {
        getMetrics:
          jest.fn(() => ({
            totalRoutes: 2,
            primarySelections: 1,
            failoverSelections:
              overrides
                ?.failedRoutes
                ? 0
                : 1,
            failedRoutes:
              overrides
                ?.failedRoutes ??
              0,
            totalAttempts: 2,
            averageAttemptsPerRoute: 1,
            selectionsByWorker: {
              'worker-a': 1,
            },
            attemptsByStrategy: {
              least_loaded: 1,
              round_robin: 0,
              weighted: 0,
              capacity_aware: 0,
              health_aware: 1,
            },
            collectedAt,
          })),
      } as unknown as
        FailoverRoutingService;

      const draining = {
        getMetrics:
          jest.fn(() => ({
            totalDrainRequests: 1,
            activeDrains: 0,
            completedDrains: 1,
            cancelledDrains: 0,
            forcedDrains: 0,
            timedOutDrains:
              overrides
                ?.timedOutDrains ??
              0,
            activeJobsRemaining:
              overrides
                ?.activeJobsRemaining ??
              0,
            affinityBindingsRemoved: 2,
            collectedAt,
          })),
      } as unknown as
        WorkerDrainingService;

      const healthScheduling = {
        getMetrics:
          jest.fn(() => ({
            totalSchedules: 3,
            successfulSchedules:
              3 -
              (
                overrides
                  ?.failedSchedules ??
                0
              ),
            failedSchedules:
              overrides
                ?.failedSchedules ??
              0,
            healthySelections: 3,
            degradedSelections: 0,
            workerSelections: {
              'worker-a': 3,
            },
            collectedAt,
          })),
      } as unknown as
        HealthBasedSchedulingService;

      const rebalancing = {
        getMetrics:
          jest.fn(() => ({
            totalPlans: 2,
            balancedPlans: 1,
            rebalancingPlans: 1,
            totalActions: 2,
            totalJobsPlannedForMovement: 4,
            collectedAt,
          })),
      } as unknown as
        DynamicRebalancingService;

      return new CoordinationMetricsService(
        loadBalancer,
        affinity,
        failover,
        draining,
        healthScheduling,
        rebalancing,
      );
    }

    it(
      'aggregates coordination metrics',
      () => {
        const service =
          setup();

        const snapshot =
          service.collect(
            collectedAt,
          );

        expect(
          snapshot.status,
        ).toBe('healthy');

        expect(
          snapshot.summary
            .totalRoutingOperations,
        ).toBe(15);

        expect(
          snapshot.summary
            .successfulRoutingOperations,
        ).toBe(15);

        expect(
          snapshot.summary
            .failedRoutingOperations,
        ).toBe(0);

        expect(
          snapshot.summary
            .routingSuccessRate,
        ).toBe(1);

        expect(
          snapshot.summary
            .activeAffinityBindings,
        ).toBe(4);

        expect(
          snapshot.summary
            .jobsPlannedForMovement,
        ).toBe(4);
      },
    );

    it(
      'returns degraded status when warnings exist',
      () => {
        const service =
          setup({
            failedRoutes: 1,
          });

        const snapshot =
          service.collect();

        expect(
          snapshot.status,
        ).toBe('degraded');

        expect(
          snapshot.warnings,
        ).toContain(
          'failover_routes_failed',
        );
      },
    );

    it(
      'returns unhealthy status for timed-out drains',
      () => {
        const service =
          setup({
            timedOutDrains: 1,
          });

        const snapshot =
          service.collect();

        expect(
          snapshot.status,
        ).toBe('unhealthy');

        expect(
          snapshot.warnings,
        ).toContain(
          'worker_drains_timed_out',
        );
      },
    );

    it(
      'reports remaining jobs on draining workers',
      () => {
        const service =
          setup({
            activeJobsRemaining: 3,
          });

        const snapshot =
          service.collect();

        expect(
          snapshot.warnings,
        ).toContain(
          'active_jobs_remaining_on_draining_workers',
        );
      },
    );

    it(
      'reports expired affinity bindings',
      () => {
        const service =
          setup({
            expiredBindings: 2,
          });

        const snapshot =
          service.collect();

        expect(
          snapshot.warnings,
        ).toContain(
          'expired_affinity_bindings_detected',
        );
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const service =
          setup();

        const first =
          service.collect();

        const second =
          service.collect();

        expect(first)
          .not.toBe(second);

        expect(
          first.summary,
        ).not.toBe(
          second.summary,
        );

        expect(
          first.loadBalancer
            .selectionsByWorker,
        ).not.toBe(
          second.loadBalancer
            .selectionsByWorker,
        );
      },
    );
  },
);