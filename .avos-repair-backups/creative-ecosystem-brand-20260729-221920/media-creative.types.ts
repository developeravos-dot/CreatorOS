export type ApprovalStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected';

export interface CreativeProductionInput {
  title: string;
  contentType: string;
  audience: string;
  ageGroup: string;
  platform: string;
  languages?: string[];
  cultures?: string[];
  durationSeconds?: number;
  tone?: string;
  objective?: string;
}

export interface BrandProjectInput {
  name?: string;
  contentType: string;
  audience: string;
  ageGroup: string;
  platform: string;
  languages?: string[];
  cultures?: string[];
  positioning?: string;
  parentBrand?: string;
}

export interface EcosystemProjectInput {
  name: string;
  objective: string;
  channels?: string[];
  projects?: string[];
  markets?: string[];
  languages?: string[];
  budget?: number;
  growthTarget?: number;
  risk?: number;
}

export interface CreativeProductionPlan {
  id: string;
  createdAt: string;
  status: ApprovalStatus;
  input: CreativeProductionInput;
  productionStyle: {
    primary: 'realistic' | 'cinematic' | 'animation' | 'anime' | 'hybrid';
    secondary?: string;
    rationale: string[];
  };
  modelStrategy: {
    script: string[];
    image: string[];
    video: string[];
    voice: string[];
    music: string[];
    editing: string[];
  };
  story: {
    premise: string;
    structure: string[];
    scenes: Array<{
      scene: number;
      purpose: string;
      visualDirection: string;
      camera: string;
      lighting: string;
      audio: string;
    }>;
  };
  visualSystem: {
    palette: string[];
    typography: string[];
    characterRules: string[];
    continuityRules: string[];
  };
  soundSystem: {
    voiceProfile: string;
    musicDirection: string;
    soundDesign: string[];
  };
  productionCouncil: Array<{
    agent: string;
    role: string;
    decision: string;
  }>;
  qualityGates: string[];
  localization: {
    languages: string[];
    cultures: string[];
    rules: string[];
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    auditTrail: string[];
  };
}

export interface BrandIdentity {
  id: string;
  createdAt: string;
  status: ApprovalStatus;
  input: BrandProjectInput;
  naming: {
    recommendedName: string;
    alternatives: string[];
    namingRules: string[];
  };
  positioning: {
    promise: string;
    personality: string[];
    values: string[];
    differentiation: string[];
  };
  visualIdentity: {
    logoDirection: string;
    bannerDirection: string;
    profileDirection: string;
    palette: string[];
    typography: string[];
    iconStyle: string;
    thumbnailSystem: string[];
  };
  verbalIdentity: {
    tone: string[];
    messagePillars: string[];
    tagline: string;
  };
  brandBook: {
    sections: string[];
    consistencyRules: string[];
    forbiddenUses: string[];
  };
  assetLibrary: Array<{
    type: string;
    name: string;
    version: string;
    status: 'planned' | 'approved' | 'deprecated';
  }>;
  campaigns: Array<{
    name: string;
    season: string;
    identityVariant: string;
  }>;
  localization: {
    languages: string[];
    cultures: string[];
    adaptationRules: string[];
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    auditTrail: string[];
  };
}

export interface MediaEcosystem {
  id: string;
  createdAt: string;
  status: ApprovalStatus;
  input: EcosystemProjectInput;
  organization: {
    teams: Array<{
      name: string;
      agents: string[];
      mission: string;
    }>;
    council: string[];
  };
  lifecycle: {
    stages: string[];
    currentStage: string;
    nextActions: string[];
  };
  network: {
    channels: string[];
    projects: string[];
    audienceFlows: string[];
    dataFlows: string[];
    opportunityFlows: string[];
  };
  intelligence: {
    trendSignals: string[];
    expansionRecommendations: string[];
    riskSignals: string[];
  };
  growth: {
    newChannels: string[];
    newLanguages: string[];
    newMarkets: string[];
    campaigns: string[];
    products: string[];
    partnerships: string[];
    licenses: string[];
  };
  ipPortfolio: Array<{
    title: string;
    stage: string;
    valueScore: number;
    expansionPaths: string[];
  }>;
  investment: {
    allocation: Record<string, number>;
    priorityQueue: string[];
  };
  analytics: {
    metrics: Record<string, number>;
    alerts: string[];
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    auditTrail: string[];
  };
}