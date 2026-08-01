export type ProgramStatus =
  | 'draft'
  | 'awaiting-approval'
  | 'approved'
  | 'production'
  | 'distribution'
  | 'monetization'
  | 'scaling'
  | 'paused'
  | 'completed'
  | 'rejected';

export interface GlobalMediaProgramInput {
  name: string;
  vision: string;
  category: string;
  owner: string;
  audience: string[];
  markets: string[];
  languages: string[];
  platforms: string[];
  budget?: number;
  strategicFit?: number;
  originality?: number;
  revenuePotential?: number;
  scalability?: number;
  readiness?: number;
  risk?: number;
}

export interface GlobalMediaProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ProgramStatus;
  input: GlobalMediaProgramInput;
  strategy: {
    thesis: string;
    objectives: string[];
    priorities: string[];
    score: number;
  };
  intelligence: {
    opportunities: string[];
    threats: string[];
    marketSignals: string[];
    audienceSignals: string[];
  };
  production: {
    blueprint: string[];
    pipeline: string[];
    qualityGates: string[];
  };
  distribution: {
    channels: string[];
    marketRoutes: string[];
    localizationRoutes: string[];
  };
  audience: {
    segments: string[];
    acquisitionLoops: string[];
    retentionLoops: string[];
    communityLoops: string[];
  };
  advertising: {
    campaignTypes: string[];
    optimizationLoops: string[];
    controls: string[];
  };
  monetization: {
    models: string[];
    forecast: number;
    realized: number;
  };
  rights: {
    fingerprint: string;
    rightsStatus: 'pending' | 'verified' | 'restricted';
    licensingModels: string[];
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    gates: string[];
  };
  security: {
    controls: string[];
    incidents: string[];
  };
  quality: {
    score: number;
    checks: string[];
  };
  risk: {
    score: number;
    controls: string[];
  };
  learning: Array<{
    at: string;
    metric: string;
    value: number;
    decision: string;
  }>;
  history: Array<{
    at: string;
    actor: string;
    action: string;
  }>;
}