export type IntelligenceCaseStatus =
  | 'detected'
  | 'analyzing'
  | 'awaiting-human-decision'
  | 'approved'
  | 'executing'
  | 'learning'
  | 'paused'
  | 'closed'
  | 'rejected';

export interface IntelligenceSignalInput {
  title: string;
  summary: string;
  source: string;
  domain:
    | 'trend'
    | 'competitor'
    | 'audience'
    | 'market'
    | 'technology'
    | 'platform'
    | 'revenue'
    | 'risk'
    | 'content';
  markets?: string[];
  platforms?: string[];
  competitors?: string[];
  confidence?: number;
  urgency?: number;
  impact?: number;
  novelty?: number;
  strategicFit?: number;
  executionReadiness?: number;
  risk?: number;
}

export interface IntelligenceCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: IntelligenceCaseStatus;
  input: IntelligenceSignalInput;
  radar: {
    signalStrength: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
  };
  forecast: {
    horizonDays: number;
    probability: number;
    upside: number;
    downside: number;
    expectedValue: number;
  };
  competitors: {
    monitored: string[];
    movements: string[];
    gaps: string[];
  };
  decisions: {
    recommendedAction: string;
    alternatives: string[];
    assumptions: string[];
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
  portfolio: {
    strategicContribution: number;
    diversificationContribution: number;
    capitalEfficiency: number;
  };
  futureSimulation: {
    scenarios: Array<{
      name: string;
      probability: number;
      outcomeScore: number;
      action: string;
    }>;
  };
  memory: {
    facts: string[];
    lessons: string[];
    relatedCases: string[];
  };
  agents: {
    team: string[];
    assignments: Array<{
      agent: string;
      task: string;
      status: 'queued' | 'active' | 'completed' | 'blocked';
    }>;
  };
  observability: {
    metrics: Record<string, number>;
    alerts: string[];
  };
  auditTrail: string[];
}