export type EnterpriseDecisionStatus =
  | 'recommended'
  | 'approved'
  | 'rejected'
  | 'executed';

export interface EnterpriseSignal {
  readonly signalId: string;
  readonly category:
    | 'performance'
    | 'cost'
    | 'capacity'
    | 'risk'
    | 'failure';
  readonly value: number;
  readonly confidence: number;
  readonly observedAt: Date;
}

export interface EnterpriseDecision {
  readonly decisionId: string;
  readonly objective: string;
  readonly action: string;
  readonly score: number;
  readonly confidence: number;
  readonly status:
    EnterpriseDecisionStatus;
  readonly requiresHumanApproval: boolean;
  readonly rationale:
    readonly string[];
  readonly createdAt: Date;
  readonly resolvedAt: Date | null;
}

export interface EnterpriseStrategy {
  readonly strategyId: string;
  readonly objective: string;
  readonly horizon:
    | 'immediate'
    | 'short-term'
    | 'long-term';
  readonly actions:
    readonly string[];
  readonly expectedImpact: number;
  readonly riskScore: number;
  readonly createdAt: Date;
}
