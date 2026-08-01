export type InitiativeStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'simulating'
  | 'executing'
  | 'scaling'
  | 'paused'
  | 'completed'
  | 'rejected';

export interface AutonomousInitiativeInput {
  name: string;
  objective: string;
  owner: string;
  initiativeType:
    | 'growth'
    | 'acquisition'
    | 'partnership'
    | 'market-entry'
    | 'product'
    | 'platform'
    | 'licensing'
    | 'efficiency';
  markets?: string[];
  partners?: string[];
  budget?: number;
  expectedReturn?: number;
  strategicFit?: number;
  readiness?: number;
  complexity?: number;
  risk?: number;
  timeHorizonMonths?: number;
}

export interface ScenarioResult {
  name: string;
  probability: number;
  expectedValue: number;
  riskAdjustedValue: number;
  assumptions: string[];
  recommendation: string;
}

export interface AutonomousInitiative {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: InitiativeStatus;
  input: AutonomousInitiativeInput;
  council: {
    recommendation: 'reject' | 'observe' | 'approve-pilot' | 'prioritize';
    confidence: number;
    votes: Array<{
      agent: string;
      vote: string;
      rationale: string;
    }>;
  };
  digitalTwin: {
    baselineValue: number;
    projectedValue: number;
    variables: Record<string, number>;
  };
  scenarios: ScenarioResult[];
  knowledge: {
    concepts: string[];
    dependencies: string[];
    lessons: string[];
  };
  acquisition: {
    targetProfile: string[];
    diligenceChecklist: string[];
    recommendation: string;
  };
  negotiation: {
    objectives: string[];
    fallbackPositions: string[];
    approvalRequired: boolean;
  };
  marketplace: {
    offerings: string[];
    demandSignals: string[];
    matches: string[];
  };
  ecosystem: {
    partners: string[];
    capabilities: string[];
    networkEffects: string[];
  };
  execution: {
    workstreams: string[];
    milestones: string[];
    blockers: string[];
  };
  observability: {
    metrics: Record<string, number>;
    alerts: string[];
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditTrail: string[];
  };
}