import {
  Injectable,
} from '@nestjs/common';

import type {
  EnterpriseDecision,
} from '../contracts';

@Injectable()
export class EnterpriseDecisionEngineService {
  private readonly decisions =
    new Map<
      string,
      EnterpriseDecision
    >();

  recommend(input: {
    readonly decisionId: string;
    readonly objective: string;
    readonly candidates:
      readonly {
        readonly action: string;
        readonly benefit: number;
        readonly cost: number;
        readonly risk: number;
        readonly confidence: number;
      }[];
    readonly humanApprovalThreshold?: number;
    readonly now?: Date;
  }): EnterpriseDecision {
    const ranked =
      input.candidates
        .map((candidate) => ({
          ...candidate,
          action:
            candidate.action.trim(),
          score:
            candidate.benefit -
            candidate.cost -
            candidate.risk,
        }))
        .filter(
          (candidate) =>
            candidate.action.length > 0,
        )
        .sort(
          (left, right) =>
            right.score -
            left.score,
        );

    if (
      !input.decisionId.trim() ||
      !input.objective.trim() ||
      ranked.length === 0 ||
      this.decisions.has(
        input.decisionId.trim(),
      )
    ) {
      throw new Error(
        'Valid unique enterprise decision input is required.',
      );
    }

    const selected = ranked[0]!;

    const decision:
      EnterpriseDecision = {
        decisionId:
          input.decisionId.trim(),
        objective:
          input.objective.trim(),
        action:
          selected.action,
        score:
          selected.score,
        confidence:
          Math.max(
            0,
            Math.min(
              1,
              selected.confidence,
            ),
          ),
        status: 'recommended',
        requiresHumanApproval:
          selected.risk >=
            (
              input.humanApprovalThreshold ??
              50
            ) ||
          selected.confidence < 0.7,
        rationale: [
          'benefit=' +
            selected.benefit,
          'cost=' +
            selected.cost,
          'risk=' +
            selected.risk,
          'score=' +
            selected.score,
        ],
        createdAt: new Date(
          input.now ?? new Date(),
        ),
        resolvedAt: null,
      };

    this.decisions.set(
      decision.decisionId,
      decision,
    );

    return this.clone(decision);
  }

  resolve(
    decisionId: string,
    approved: boolean,
    now = new Date(),
  ): EnterpriseDecision {
    const current =
      this.decisions.get(
        decisionId.trim(),
      );

    if (!current) {
      throw new Error(
        'Enterprise decision was not found.',
      );
    }

    const resolved:
      EnterpriseDecision = {
        ...current,
        status: approved
          ? 'approved'
          : 'rejected',
        resolvedAt: new Date(now),
      };

    this.decisions.set(
      current.decisionId,
      resolved,
    );

    return this.clone(resolved);
  }

  markExecuted(
    decisionId: string,
    now = new Date(),
  ): EnterpriseDecision {
    const current =
      this.decisions.get(
        decisionId.trim(),
      );

    if (
      !current ||
      current.status !== 'approved'
    ) {
      throw new Error(
        'Only approved decisions can be executed.',
      );
    }

    const executed:
      EnterpriseDecision = {
        ...current,
        status: 'executed',
        resolvedAt: new Date(now),
      };

    this.decisions.set(
      current.decisionId,
      executed,
    );

    return this.clone(executed);
  }

  list():
    readonly EnterpriseDecision[] {
    return [...this.decisions.values()]
      .map((decision) =>
        this.clone(decision),
      );
  }

  private clone(
    decision:
      EnterpriseDecision,
  ): EnterpriseDecision {
    return {
      ...decision,
      rationale: [
        ...decision.rationale,
      ],
      createdAt: new Date(
        decision.createdAt,
      ),
      resolvedAt:
        decision.resolvedAt
          ? new Date(
              decision.resolvedAt,
            )
          : null,
    };
  }
}
