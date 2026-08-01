export type OpportunityStatus =
  | 'detected'
  | 'under-evaluation'
  | 'awaiting-human-approval'
  | 'approved'
  | 'experimenting'
  | 'scaling'
  | 'paused'
  | 'rejected';

export type OpportunityType =
  | 'content-format'
  | 'market'
  | 'platform'
  | 'language'
  | 'audience'
  | 'partnership'
  | 'licensing'
  | 'commerce'
  | 'technology';

export interface OpportunitySignalInput {
  title: string;
  description: string;
  source: string;
  type: OpportunityType;
  markets?: string[];
  platforms?: string[];
  languages?: string[];
  audience?: string;
  evidence?: string[];
  urgency?: number;
  strategicFit?: number;
  commercialPotential?: number;
  originality?: number;
  executionReadiness?: number;
  risk?: number;
}

export interface OpportunityScore {
  urgency: number;
  strategicFit: number;
  commercialPotential: number;
  originality: number;
  executionReadiness: number;
  risk: number;
  total: number;
  recommendation: 'reject' | 'observe' | 'experiment' | 'prioritize';
}

export interface ContentInvestmentCase {
  thesis: string;
  expectedBenefits: string[];
  requiredCapabilities: string[];
  experimentPlan: string[];
  scalePlan: string[];
  stopConditions: string[];
  investmentReadiness: number;
}

export interface GrowthPlaybook {
  growthLoops: string[];
  acquisitionRoutes: string[];
  retentionRoutes: string[];
  monetizationRoutes: string[];
  expansionRoutes: string[];
  governanceGates: string[];
}

export interface MediaOpportunity {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OpportunityStatus;
  input: OpportunitySignalInput;
  score: OpportunityScore;
  investmentCase: ContentInvestmentCase;
  growthPlaybook: GrowthPlaybook;
  approvals: {
    approved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
  experiment: {
    launched: boolean;
    hypothesis?: string;
    successMetric?: string;
    targetValue?: number;
    actualValue?: number;
  };
  learning: Array<{
    at: string;
    signal: string;
    value: number;
    decision: string;
  }>;
}