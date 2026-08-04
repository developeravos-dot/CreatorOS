import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseOptimizationAction {
  readonly actionId: string;
  readonly type:
    | 'scale'
    | 'rebalance'
    | 'throttle'
    | 'isolate'
    | 'optimize-cost';
  readonly priority: number;
  readonly reason: string;
  readonly requiresApproval: boolean;
}

@Injectable()
export class EnterpriseSelfOptimizationService {
  plan(input: {
    readonly costUtilization: number;
    readonly performanceScore: number;
    readonly failureProbability: number;
    readonly capacityDelta: number;
  }): readonly EnterpriseOptimizationAction[] {
    const actions:
      EnterpriseOptimizationAction[] = [];

    if (input.failureProbability >= 0.65) {
      actions.push({
        actionId:
          'isolate-risky-dependency',
        type: 'isolate',
        priority: 100,
        reason:
          'Failure probability exceeds safe threshold.',
        requiresApproval: true,
      });
    }

    if (input.capacityDelta > 0) {
      actions.push({
        actionId:
          'scale-capacity-up',
        type: 'scale',
        priority: 90,
        reason:
          'Predicted demand exceeds current capacity.',
        requiresApproval: false,
      });
    }

    if (input.performanceScore < 60) {
      actions.push({
        actionId:
          'rebalance-workloads',
        type: 'rebalance',
        priority: 80,
        reason:
          'Performance score is degraded.',
        requiresApproval: false,
      });
    }

    if (input.costUtilization > 1.1) {
      actions.push({
        actionId:
          'optimize-enterprise-cost',
        type: 'optimize-cost',
        priority: 70,
        reason:
          'Cost utilization exceeds budget policy.',
        requiresApproval: true,
      });
    }

    if (actions.length === 0) {
      actions.push({
        actionId:
          'maintain-current-state',
        type: 'throttle',
        priority: 0,
        reason:
          'No optimization action is required.',
        requiresApproval: false,
      });
    }

    return actions.sort(
      (left, right) =>
        right.priority -
        left.priority,
    );
  }
}
