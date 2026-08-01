export type NexusStatus =
  | 'draft'
  | 'analyzing'
  | 'awaiting-human-approval'
  | 'approved'
  | 'planning'
  | 'executing'
  | 'optimizing'
  | 'paused'
  | 'completed'
  | 'rejected';

export type EvidenceQuality = 'weak' | 'moderate' | 'strong' | 'verified';

export interface MetaIntelligenceInput {
  name: string;
  objective: string;
  owner: string;
  domain:
    | 'content'
    | 'audience'
    | 'platform'
    | 'market'
    | 'technology'
    | 'revenue'
    | 'operations'
    | 'partnership'
    | 'ip'
    | 'risk';
  markets?: string[];
  projects?: string[];
  capabilities?: string[];
  signals?: Array<{
    source: string;
    statement: string;
    confidence: number;
    recency: number;
    relevance: number;
  }>;
  budget?: number;
  expectedReturn?: number;
  strategicFit?: number;
  urgency?: number;
  readiness?: number;
  complexity?: number;
  risk?: number;
  timeHorizonMonths?: number;
}

export interface NexusScenario {
  name: 'defensive' | 'balanced' | 'offensive' | 'transformational';
  probability: number;
  outcomeScore: number;
  valueScore: number;
  riskScore: number;
  recommendation: string;
}

export interface MetaIntelligenceCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: NexusStatus;
  input: MetaIntelligenceInput;

  knowledgeFabric: {
    entities: string[];
    relationships: Array<{ from: string; to: string; type: string }>;
    canonicalFacts: string[];
  };

  worldModel: {
    currentState: Record<string, number>;
    externalForces: string[];
    assumptions: string[];
  };

  semanticMemory: {
    concepts: string[];
    memories: string[];
    relatedCaseIds: string[];
    lessons: string[];
  };

  crossProjectIntelligence: {
    projects: string[];
    sharedCapabilities: string[];
    reusableAssets: string[];
    dependencyRisks: string[];
  };

  opportunityGraph: {
    opportunities: Array<{
      id: string;
      title: string;
      score: number;
      dependencies: string[];
    }>;
  };

  innovation: {
    hypotheses: Array<{
      id: string;
      statement: string;
      confidence: number;
      experimentId?: string;
    }>;
    experiments: Array<{
      id: string;
      name: string;
      metric: string;
      successThreshold: number;
      status: 'proposed' | 'approved' | 'running' | 'completed' | 'failed';
      result?: number;
    }>;
  };

  evidence: {
    items: Array<{
      source: string;
      statement: string;
      score: number;
      quality: EvidenceQuality;
    }>;
    aggregateScore: number;
  };

  scenarios: NexusScenario[];

  trendIntelligence: {
    macro: string[];
    micro: string[];
    momentumScore: number;
  };

  enterpriseDna: {
    principles: string[];
    strengths: string[];
    constraints: string[];
    genomeVector: Record<string, number>;
  };

  digitalOrganization: {
    executiveCouncil: Array<{
      agent: string;
      role: string;
      vote: 'support' | 'challenge' | 'abstain';
      rationale: string;
    }>;
    teams: Array<{
      name: string;
      agents: string[];
      mission: string;
    }>;
  };

  capabilityEvolution: {
    existing: string[];
    missing: string[];
    recommended: string[];
    maturityScore: number;
  };

  optimization: {
    resourceAllocation: Record<string, number>;
    optimizationActions: string[];
    expectedEfficiencyGain: number;
  };

  simulationGrid: {
    scenarios: NexusScenario[];
    stressTests: Array<{
      name: string;
      severity: number;
      resilienceScore: number;
      mitigation: string;
    }>;
  };

  eventCorrelation: {
    events: string[];
    correlations: Array<{
      eventA: string;
      eventB: string;
      strength: number;
    }>;
  };

  predictiveRadar: {
    opportunities: string[];
    risks: string[];
    opportunityScore: number;
    riskScore: number;
  };

  adaptiveWorkflow: {
    stages: string[];
    currentStage: string;
    nextActions: string[];
    blockers: string[];
  };

  reasoning: {
    conclusions: string[];
    contradictions: string[];
    validationChecks: string[];
  };

  portfolio: {
    strategicContribution: number;
    diversificationContribution: number;
    capitalEfficiency: number;
    priorityScore: number;
  };

  ecosystem: {
    partners: string[];
    networkEffects: string[];
    expansionPaths: string[];
  };

  autonomousPlan: {
    workstreams: Array<{
      name: string;
      ownerAgent: string;
      milestone: string;
      status: 'queued' | 'active' | 'completed' | 'blocked';
    }>;
    milestones: string[];
    decisionGates: string[];
  };

  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    finalAuthority: 'human';
    auditTrail: string[];
  };

  commandNexus: {
    metrics: Record<string, number>;
    alerts: string[];
    recommendations: string[];
  };
}