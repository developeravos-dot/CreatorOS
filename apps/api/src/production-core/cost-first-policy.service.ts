import { Injectable } from '@nestjs/common';
import {
  ProductionSelectionContext,
  ProductionSelectionResult,
  ProductionToolHealth,
} from './production-capability.contracts';

@Injectable()
export class CostFirstPolicyService {
  select(
    context: ProductionSelectionContext,
    tools: ProductionToolHealth[],
  ): ProductionSelectionResult {
    const supported = tools.filter((tool) =>
      tool.capabilities.includes(context.capability),
    );

    const usable = supported.filter((tool) => {
      if (!tool.available) {
        return false;
      }

      if (context.allowPaid === false && tool.costTier !== 'free') {
        return false;
      }

      if (
        typeof context.minimumQuality === 'number' &&
        tool.qualityScore < context.minimumQuality
      ) {
        return false;
      }

      return true;
    });

    const ranked = [...usable].sort((left, right) => {
      const preferredLeft = left.id === context.preferredToolId ? -1000 : 0;
      const preferredRight = right.id === context.preferredToolId ? -1000 : 0;

      const leftScore =
        preferredLeft +
        this.costWeight(left.costTier) * 100 -
        left.qualityScore;
      const rightScore =
        preferredRight +
        this.costWeight(right.costTier) * 100 -
        right.qualityScore;

      return leftScore - rightScore;
    });

    const selectedTool = ranked[0] ?? null;

    return {
      capability: context.capability,
      selectedTool,
      alternatives: ranked.slice(1),
      reason: selectedTool
        ? `Selected ${selectedTool.displayName} using Cost-First policy.`
        : 'No enabled and configured tool currently satisfies this capability.',
    };
  }

  private costWeight(costTier: ProductionToolHealth['costTier']): number {
    return {
      free: 0,
      low: 1,
      medium: 2,
      high: 3,
    }[costTier];
  }
}