export type MediaGovernanceStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected';

export type ProductionStyle =
  | 'realistic'
  | 'cinematic'
  | 'animation'
  | 'anime'
  | 'hybrid';

export interface AuditEntry {
  at: string;
  actor: string;
  action: string;
  details?: Record<string, unknown>;
}

export interface HumanGovernance {
  humanApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  auditTrail: AuditEntry[];
}

export interface CreativeBrief {
  title: string;
  contentType: string;
  audience: string;
  ageGroup: string;
  platform: string;
  languages?: string[];
  cultures?: string[];
  durationSeconds?: number;
  objective?: string;
  tone?: string;
  budget?: number;
  deadline?: string;
  constraints?: string[];
}

export interface ProductionScene {
  id: string;
  order: number;
  purpose: string;
  durationSeconds: number;
  script: string;
  visualPrompt: string;
  negativePrompt: string[];
  camera: {
    shot: string;
    lens: string;
    movement: string;
    framing: string;
  };
  lighting: {
    setup: string;
    mood: string;
    colorTemperature: string;
  };
  sound: {
    dialogue: string;
    ambience: string[];
    effects: string[];
    musicCue: string;
  };
  continuity: {
    characters: string[];
    wardrobe: string[];
    props: string[];
    environment: string;
  };
  status: 'planned' | 'generating' | 'review' | 'approved' | 'rejected';
}

export interface CreativeProductionProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: MediaGovernanceStatus;
  brief: CreativeBrief;
  intelligence: {
    audienceProfile: Record<string, unknown>;
    platformProfile: Record<string, unknown>;
    culturalProfile: Record<string, unknown>;
    riskProfile: string[];
  };
  creativeStrategy: {
    selectedStyle: ProductionStyle;
    styleRationale: string[];
    storyArchitecture: string[];
    visualLanguage: string[];
    emotionalArc: string[];
  };
  modelRouting: {
    scriptModels: string[];
    reasoningModels: string[];
    imageModels: string[];
    videoModels: string[];
    voiceModels: string[];
    musicModels: string[];
    editingModels: string[];
    fallbackRoutes: Record<string, string[]>;
  };
  council: Array<{
    agent: string;
    responsibility: string;
    decisionAuthority: string[];
    currentDecision: string;
  }>;
  characterBible: Array<{
    name: string;
    role: string;
    appearance: string[];
    personality: string[];
    voiceProfile: string;
    continuityFingerprint: string;
  }>;
  worldBible: {
    locations: string[];
    geographyRules: string[];
    architectureRules: string[];
    colorRules: string[];
    lightingRules: string[];
  };
  scenes: ProductionScene[];
  quality: {
    gates: string[];
    scores: Record<string, number>;
    failures: string[];
    approved: boolean;
  };
  localization: {
    languages: string[];
    cultures: string[];
    adaptationRules: string[];
    localizedVersions: Array<{
      language: string;
      culture?: string;
      status: string;
    }>;
  };
  learning: {
    feedbackSignals: string[];
    retainedLessons: string[];
    futureRecommendations: string[];
  };
  governance: HumanGovernance;
}

export interface BrandBrief {
  requestedName?: string;
  contentType: string;
  audience: string;
  ageGroup: string;
  platform: string;
  languages?: string[];
  cultures?: string[];
  positioning?: string;
  parentBrand?: string;
  market?: string;
  competitors?: string[];
}

export interface BrandProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: MediaGovernanceStatus;
  brief: BrandBrief;
  strategy: {
    recommendedName: string;
    alternatives: string[];
    purpose: string;
    promise: string;
    positioning: string;
    personality: string[];
    values: string[];
    differentiation: string[];
    audiencePerceptionTarget: string[];
  };
  verbalIdentity: {
    tagline: string;
    tone: string[];
    vocabulary: string[];
    forbiddenLanguage: string[];
    messagePillars: string[];
    sampleMessages: string[];
  };
  visualIdentity: {
    logoSystem: string[];
    symbolDirection: string;
    wordmarkDirection: string;
    profileImageDirection: string;
    bannerDirection: string;
    palette: Array<{
      name: string;
      hex: string;
      usage: string;
    }>;
    typography: Array<{
      role: string;
      direction: string;
    }>;
    iconography: string[];
    imagery: string[];
    motionIdentity: string[];
    soundIdentity: string[];
  };
  thumbnailSystem: {
    grid: string[];
    titleRules: string[];
    faceRules: string[];
    contrastRules: string[];
    seriesCodes: string[];
    platformVariants: string[];
  };
  brandBook: {
    chapters: string[];
    approvedRules: string[];
    forbiddenUses: string[];
  };
  assets: Array<{
    id: string;
    type: string;
    name: string;
    version: string;
    status: 'planned' | 'generated' | 'approved' | 'deprecated';
    locale?: string;
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    season: string;
    concept: string;
    status: string;
  }>;
  localization: {
    languages: string[];
    cultures: string[];
    rules: string[];
  };
  intelligence: {
    consistencyScore: number;
    recognitionScore: number;
    differentiationScore: number;
    growthRecommendations: string[];
  };
  governance: HumanGovernance;
}

export interface EcosystemBrief {
  name: string;
  objective: string;
  channels?: string[];
  projects?: string[];
  markets?: string[];
  languages?: string[];
  budget?: number;
  growthTarget?: number;
  riskTolerance?: number;
}

export interface MediaEcosystemProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: MediaGovernanceStatus;
  brief: EcosystemBrief;
  constitution: {
    principles: string[];
    strategicRules: string[];
    prohibitedActions: string[];
  };
  organization: {
    teams: Array<{
      name: string;
      mission: string;
      agents: string[];
      dependencies: string[];
    }>;
    councils: string[];
    humanAuthority: string[];
  };
  lifecycle: {
    stages: string[];
    currentStage: string;
    progress: number;
    nextActions: string[];
  };
  network: {
    channels: Array<{
      name: string;
      status: string;
      audienceRole: string;
      strategicRole: string;
    }>;
    projects: Array<{
      name: string;
      status: string;
      ipPotential: number;
    }>;
    audienceFlows: string[];
    dataFlows: string[];
    opportunityFlows: string[];
  };
  intelligence: {
    trendSignals: string[];
    opportunitySignals: string[];
    riskSignals: string[];
    recommendations: string[];
  };
  publishing: {
    platforms: string[];
    schedules: Record<string, string>;
    localizationQueue: string[];
    distributionRules: string[];
  };
  marketing: {
    campaigns: string[];
    audienceSegments: string[];
    crossPromotionRules: string[];
    growthExperiments: string[];
  };
  monetization: {
    revenueStreams: string[];
    products: string[];
    partnerships: string[];
    licenses: string[];
    projections: Record<string, number>;
  };
  portfolio: Array<{
    id: string;
    title: string;
    stage: string;
    valueScore: number;
    riskScore: number;
    expansionPaths: string[];
  }>;
  investment: {
    totalBudget: number;
    allocations: Record<string, number>;
    priorityQueue: string[];
    blockedAllocations: string[];
  };
  analytics: {
    metrics: Record<string, number>;
    alerts: string[];
    learnings: string[];
  };
  governance: HumanGovernance;
}