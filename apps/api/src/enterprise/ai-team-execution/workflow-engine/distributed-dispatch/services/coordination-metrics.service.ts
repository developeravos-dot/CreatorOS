import {
  Injectable,
} from '@nestjs/common';

import {
  DynamicRebalancingService,
  type DynamicRebalancingMetrics,
} from './dynamic-rebalancing.service';
import {
  FailoverRoutingService,
  type FailoverRoutingMetrics,
} from './failover-routing.service';
import {
  HealthBasedSchedulingService,
  type HealthSchedulingMetrics,
} from './health-based-scheduling.service';
import {
  LoadBalancerService,
  type LoadBalancerMetrics,
} from './load-balancer.service';
import {
  QueueAffinityService,
  type QueueAffinityMetrics,
} from './queue-affinity.service';
import {
  WorkerDrainingService,
  type WorkerDrainingMetrics,
} from './worker-draining.service';

export type CoordinationHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'unhealthy';

export interface CoordinationMetricSummary {
  readonly totalRoutingOperations: number;
  readonly successfulRoutingOperations: number;
  readonly failedRoutingOperations: number;
  readonly routingSuccessRate: number;
  readonly activeAffinityBindings: number;
  readonly activeDrains: number;
  readonly rebalancingActions: number;
  readonly jobsPlannedForMovement: number;
}

export interface CoordinationMetricsSnapshot {
  readonly status:
    CoordinationHealthStatus;
  readonly summary:
    CoordinationMetricSummary;
  readonly loadBalancer:
    LoadBalancerMetrics;
  readonly affinity:
    QueueAffinityMetrics;
  readonly failover:
    FailoverRoutingMetrics;
  readonly draining:
    WorkerDrainingMetrics;
  readonly healthScheduling:
    HealthSchedulingMetrics;
  readonly rebalancing:
    DynamicRebalancingMetrics;
  readonly warnings:
    readonly string[];
  readonly collectedAt: Date;
}

@Injectable()
export class CoordinationMetricsService {
  constructor(
    private readonly loadBalancer:
      LoadBalancerService,
    private readonly affinity:
      QueueAffinityService,
    private readonly failover:
      FailoverRoutingService,
    private readonly draining:
      WorkerDrainingService,
    private readonly healthScheduling:
      HealthBasedSchedulingService,
    private readonly rebalancing:
      DynamicRebalancingService,
  ) {}

  collect(
    collectedAt =
      new Date(),
  ): CoordinationMetricsSnapshot {
    const now =
      new Date(collectedAt);

    const loadBalancer =
      this.loadBalancer.getMetrics(
        now,
      );

    const affinity =
      this.affinity.getMetrics(
        now,
      );

    const failover =
      this.failover.getMetrics(
        now,
      );

    const draining =
      this.draining.getMetrics(
        now,
      );

    const healthScheduling =
      this.healthScheduling.getMetrics(
        now,
      );

    const rebalancing =
      this.rebalancing.getMetrics(
        now,
      );

    const totalRoutingOperations =
      loadBalancer.totalSelections +
      failover.totalRoutes +
      healthScheduling.totalSchedules;

    const successfulRoutingOperations =
      loadBalancer.successfulSelections +
      failover.primarySelections +
      failover.failoverSelections +
      healthScheduling.successfulSchedules;

    const failedRoutingOperations =
      loadBalancer.failedSelections +
      failover.failedRoutes +
      healthScheduling.failedSchedules;

    const routingSuccessRate =
      totalRoutingOperations > 0
        ? this.round(
            successfulRoutingOperations /
            totalRoutingOperations,
          )
        : 1;

    const warnings =
      this.createWarnings({
        loadBalancer,
        affinity,
        failover,
        draining,
        healthScheduling,
        rebalancing,
        routingSuccessRate,
      });

    return {
      status:
        this.resolveStatus(
          routingSuccessRate,
          warnings,
        ),
      summary: {
        totalRoutingOperations,
        successfulRoutingOperations,
        failedRoutingOperations,
        routingSuccessRate,
        activeAffinityBindings:
          affinity.activeBindings,
        activeDrains:
          draining.activeDrains,
        rebalancingActions:
          rebalancing.totalActions,
        jobsPlannedForMovement:
          rebalancing
            .totalJobsPlannedForMovement,
      },
      loadBalancer:
        this.cloneLoadBalancerMetrics(
          loadBalancer,
        ),
      affinity: {
        ...affinity,
        collectedAt:
          new Date(
            affinity.collectedAt,
          ),
      },
      failover:
        this.cloneFailoverMetrics(
          failover,
        ),
      draining: {
        ...draining,
        collectedAt:
          new Date(
            draining.collectedAt,
          ),
      },
      healthScheduling:
        this.cloneHealthMetrics(
          healthScheduling,
        ),
      rebalancing: {
        ...rebalancing,
        collectedAt:
          new Date(
            rebalancing.collectedAt,
          ),
      },
      warnings: [
        ...warnings,
      ],
      collectedAt: now,
    };
  }

  private createWarnings(
    metrics: {
      readonly loadBalancer:
        LoadBalancerMetrics;
      readonly affinity:
        QueueAffinityMetrics;
      readonly failover:
        FailoverRoutingMetrics;
      readonly draining:
        WorkerDrainingMetrics;
      readonly healthScheduling:
        HealthSchedulingMetrics;
      readonly rebalancing:
        DynamicRebalancingMetrics;
      readonly routingSuccessRate:
        number;
    },
  ): readonly string[] {
    const warnings:
      string[] = [];

    if (
      metrics.routingSuccessRate <
      0.8
    ) {
      warnings.push(
        'routing_success_rate_low',
      );
    }

    if (
      metrics.failover.failedRoutes >
      0
    ) {
      warnings.push(
        'failover_routes_failed',
      );
    }

    if (
      metrics.draining.timedOutDrains >
      0
    ) {
      warnings.push(
        'worker_drains_timed_out',
      );
    }

    if (
      metrics.draining.activeJobsRemaining >
      0
    ) {
      warnings.push(
        'active_jobs_remaining_on_draining_workers',
      );
    }

    if (
      metrics.healthScheduling
        .failedSchedules >
      0
    ) {
      warnings.push(
        'health_based_scheduling_failed',
      );
    }

    if (
      metrics.affinity.expiredBindings >
      0
    ) {
      warnings.push(
        'expired_affinity_bindings_detected',
      );
    }

    return warnings.sort();
  }

  private resolveStatus(
    routingSuccessRate: number,
    warnings:
      readonly string[],
  ): CoordinationHealthStatus {
    if (
      routingSuccessRate < 0.5 ||
      warnings.includes(
        'worker_drains_timed_out',
      )
    ) {
      return 'unhealthy';
    }

    if (
      routingSuccessRate < 0.9 ||
      warnings.length > 0
    ) {
      return 'degraded';
    }

    return 'healthy';
  }

  private cloneLoadBalancerMetrics(
    metrics:
      LoadBalancerMetrics,
  ): LoadBalancerMetrics {
    return {
      ...metrics,
      selectionsByStrategy: {
        ...metrics
          .selectionsByStrategy,
      },
      selectionsByWorker: {
        ...metrics
          .selectionsByWorker,
      },
      collectedAt:
        new Date(
          metrics.collectedAt,
        ),
    };
  }

  private cloneFailoverMetrics(
    metrics:
      FailoverRoutingMetrics,
  ): FailoverRoutingMetrics {
    return {
      ...metrics,
      selectionsByWorker: {
        ...metrics
          .selectionsByWorker,
      },
      attemptsByStrategy: {
        ...metrics
          .attemptsByStrategy,
      },
      collectedAt:
        new Date(
          metrics.collectedAt,
        ),
    };
  }

  private cloneHealthMetrics(
    metrics:
      HealthSchedulingMetrics,
  ): HealthSchedulingMetrics {
    return {
      ...metrics,
      workerSelections: {
        ...metrics.workerSelections,
      },
      collectedAt:
        new Date(
          metrics.collectedAt,
        ),
    };
  }

  private round(
    value: number,
  ): number {
    return Math.round(
      value * 1000,
    ) / 1000;
  }
}