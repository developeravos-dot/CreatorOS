import { Injectable } from '@nestjs/common';

export interface RuntimeProductionSnapshot {
  readonly desiredWorkers: number;
  readonly scalingDirection:
    | 'scale-up'
    | 'scale-down'
    | 'steady';
  readonly circuitState:
    | 'closed'
    | 'open'
    | 'half-open';
  readonly pressure:
    | 'normal'
    | 'throttled'
    | 'rejected';
  readonly healingActions:
    readonly string[];
  readonly metrics:
    Readonly<Record<string, number>>;
  readonly generatedAt: Date;
}

@Injectable()
export class RuntimeProductionService {
  private failures = 0;
  private circuitState:
    'closed' | 'open' | 'half-open' =
      'closed';

  private readonly metrics =
    new Map<string, number>();

  planCapacity(input: {
    readonly activeWorkers: number;
    readonly concurrencyPerWorker: number;
    readonly running: number;
    readonly queued: number;
    readonly targetUtilization: number;
    readonly maximumStep: number;
  }): RuntimeProductionSnapshot {
    const demand =
      input.running + input.queued;

    const safeCapacity =
      input.concurrencyPerWorker *
      input.targetUtilization;

    const rawDesired = Math.max(
      1,
      Math.ceil(demand / safeCapacity),
    );

    const delta = Math.max(
      -input.maximumStep,
      Math.min(
        input.maximumStep,
        rawDesired - input.activeWorkers,
      ),
    );

    const desiredWorkers =
      input.activeWorkers + delta;

    const pressureRatio =
      input.queued /
      Math.max(
        1,
        input.activeWorkers *
          input.concurrencyPerWorker,
      );

    const pressure =
      pressureRatio >= 1
        ? 'rejected'
        : pressureRatio >= 0.8
          ? 'throttled'
          : 'normal';

    const healingActions: string[] = [];

    if (pressure === 'rejected') {
      healingActions.push('rebalance');
    }

    if (this.circuitState === 'open') {
      healingActions.push(
        'isolate-dependency',
      );
    }

    this.metrics.set(
      'runtime.desired_workers',
      desiredWorkers,
    );

    this.metrics.set(
      'runtime.queue_pressure',
      pressureRatio,
    );

    return {
      desiredWorkers,
      scalingDirection:
        delta > 0
          ? 'scale-up'
          : delta < 0
            ? 'scale-down'
            : 'steady',
      circuitState:
        this.circuitState,
      pressure,
      healingActions,
      metrics:
        Object.fromEntries(
          this.metrics,
        ),
      generatedAt: new Date(),
    };
  }

  recordFailure(
    threshold = 3,
  ): void {
    this.failures += 1;

    if (this.failures >= threshold) {
      this.circuitState = 'open';
    }
  }

  recordSuccess(): void {
    this.failures = 0;
    this.circuitState = 'closed';
  }

  authorize(input: {
    readonly tenantId: string;
    readonly permissions:
      readonly string[];
    readonly requiredPermission: string;
    readonly requestedResources: number;
    readonly maximumResources: number;
  }): boolean {
    return (
      input.tenantId.trim().length > 0 &&
      input.permissions.includes(
        input.requiredPermission,
      ) &&
      input.requestedResources <=
        input.maximumResources
    );
  }
}
