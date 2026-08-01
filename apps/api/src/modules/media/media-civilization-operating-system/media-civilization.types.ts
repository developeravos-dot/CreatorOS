export type CivilizationProgramStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'designing'
  | 'piloting'
  | 'operating'
  | 'scaling'
  | 'paused'
  | 'completed'
  | 'rejected';

export interface CivilizationProgramInput {
  name: string;
  vision: string;
  owner: string;
  civilizationDomain:
    | 'digital-city'
    | 'media-economy'
    | 'knowledge'
    | 'culture'
    | 'education'
    | 'commerce'
    | 'governance'
    | 'identity'
    | 'community'
    | 'infrastructure';
  regions?: string[];
  languages?: string[];
  communities?: string[];
  platforms?: string[];
  budget?: number;
  populationTarget?: number;
  strategicFit?: number;
  readiness?: number;
  sustainability?: number;
  inclusion?: number;
  economicPotential?: number;
  culturalImpact?: number;
  risk?: number;
  timeHorizonYears?: number;
}

export interface CivilizationProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CivilizationProgramStatus;
  input: CivilizationProgramInput;
  constitution: {
    principles: string[];
    rights: string[];
    obligations: string[];
    humanFinalAuthority: true;
  };
  digitalCity: {
    districts: string[];
    services: string[];
    infrastructure: string[];
  };
  economy: {
    currencies: string[];
    markets: string[];
    revenueModels: string[];
    projectedEconomicValue: number;
  };
  identity: {
    passportModel: string;
    trustLayers: string[];
    reputationSignals: string[];
  };
  ipCivilization: {
    assets: string[];
    families: string[];
    licensingModels: string[];
    provenanceRules: string[];
  };
  knowledge: {
    institutions: string[];
    learningSystems: string[];
    memorySystems: string[];
  };
  culture: {
    culturalPrograms: string[];
    preservationSystems: string[];
    creationSystems: string[];
  };
  governance: {
    councils: string[];
    decisionGates: string[];
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditTrail: string[];
  };
  community: {
    communities: string[];
    participationModels: string[];
    safetySystems: string[];
  };
  commerce: {
    marketplaces: string[];
    partnerNetworks: string[];
    tradeFlows: string[];
  };
  sustainability: {
    indicators: Record<string, number>;
    commitments: string[];
    risks: string[];
  };
  resilience: {
    scenarios: Array<{
      name: string;
      severity: number;
      resilienceScore: number;
      mitigation: string;
    }>;
  };
  diplomacy: {
    relationships: string[];
    agreements: string[];
    expansionPaths: string[];
  };
  execution: {
    workstreams: Array<{
      name: string;
      ownerAgent: string;
      milestone: string;
      status: 'queued' | 'active' | 'completed' | 'blocked';
    }>;
    milestones: string[];
    blockers: string[];
  };
  observability: {
    metrics: Record<string, number>;
    alerts: string[];
    recommendations: string[];
  };
}