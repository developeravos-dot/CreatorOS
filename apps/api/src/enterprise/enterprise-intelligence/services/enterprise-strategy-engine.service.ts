import {
  Injectable,
} from '@nestjs/common';

import type {
  EnterpriseStrategy,
} from '../contracts';

@Injectable()
export class EnterpriseStrategyEngineService {
  create(input: {
    readonly strategyId: string;
    readonly objective: string;
    readonly horizon:
      EnterpriseStrategy['horizon'];
    readonly candidateActions:
      readonly {
        readonly action: string;
        readonly impact: number;
        readonly risk: number;
      }[];
    readonly now?: Date;
  }): EnterpriseStrategy {
    const ranked =
      [...input.candidateActions]
        .map((candidate) => ({
          ...candidate,
          action:
            candidate.action.trim(),
          utility:
            candidate.impact -
            candidate.risk,
        }))
        .filter(
          (candidate) =>
            candidate.action.length > 0,
        )
        .sort(
          (left, right) =>
            right.utility -
            left.utility,
        );

    if (
      !input.strategyId.trim() ||
      !input.objective.trim() ||
      ranked.length === 0
    ) {
      throw new Error(
        'Valid strategy input is required.',
      );
    }

    const selected =
      ranked.slice(0, 5);

    return {
      strategyId:
        input.strategyId.trim(),
      objective:
        input.objective.trim(),
      horizon: input.horizon,
      actions:
        selected.map(
          (candidate) =>
            candidate.action,
        ),
      expectedImpact:
        selected.reduce(
          (total, candidate) =>
            total +
            candidate.impact,
          0,
        ) / selected.length,
      riskScore:
        selected.reduce(
          (total, candidate) =>
            total +
            candidate.risk,
          0,
        ) / selected.length,
      createdAt: new Date(
        input.now ?? new Date(),
      ),
    };
  }
}
