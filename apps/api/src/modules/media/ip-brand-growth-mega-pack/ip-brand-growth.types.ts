export type IpGrowthStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed';

export interface IpGrowthBrief {
  title: string;
  brandName: string;
  propertyType: string;
  concept: string;
  audience: string;
  markets?: string[];
  languages?: string[];
  platforms?: string[];
  revenueObjectives?: string[];
  partnershipObjectives?: string[];
  licensingObjectives?: string[];
  budget?: number;
  timeHorizonMonths?: number;
}

export interface IpAsset {
  id: string;
  name: string;
  category: string;
  description: string;
  ownershipStatus: string;
  registrationPriority: number;
  territories: string[];
  evidenceRequirements: string[];
  protectionActions: string[];
}

export interface FranchisePlan {
  universeName: string;
  expansionPaths: Array<{
    name: string;
    format: string;
    audience: string;
    dependency: string;
    priority: number;
  }>;
  canonRules: string[];
  continuityRules: string[];
}

export interface BrandEvolutionPlan {
  currentPosition: string;
  targetPosition: string;
  brandPillars: string[];
  visualEvolutionRules: string[];
  voiceEvolutionRules: string[];
  experiments: string[];
}

export interface MarketingPlan {
  campaigns: Array<{
    name: string;
    objective: string;
    audience: string;
    channels: string[];
    message: string;
    successMetrics: string[];
  }>;
  launchSequence: string[];
}

export interface GrowthPlan {
  loops: Array<{
    name: string;
    trigger: string;
    action: string;
    result: string;
    reinforcement: string;
  }>;
  milestones: Array<{
    month: number;
    objective: string;
    metric: string;
    target: number;
  }>;
}

export interface MonetizationPlan {
  revenueStreams: Array<{
    name: string;
    model: string;
    priority: number;
    dependencies: string[];
    risks: string[];
  }>;
  portfolioRules: string[];
}

export interface PartnershipPlan {
  targets: Array<{
    category: string;
    valueExchange: string;
    idealProfile: string;
    proposalAssets: string[];
    riskControls: string[];
  }>;
  approvalRules: string[];
}

export interface LicensingPlan {
  packages: Array<{
    name: string;
    rights: string[];
    territories: string[];
    termMonths: number;
    exclusivity: string;
    royaltyModel: string;
    approvalRequirements: string[];
  }>;
  controls: string[];
}

export interface IpBrandGrowthProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: IpGrowthStatus;
  brief: IpGrowthBrief;
  ipAssets: IpAsset[];
  franchise: FranchisePlan;
  brandEvolution: BrandEvolutionPlan;
  marketing: MarketingPlan;
  growth: GrowthPlan;
  monetization: MonetizationPlan;
  partnerships: PartnershipPlan;
  licensing: LicensingPlan;
  quality: {
    scores: Record<string, number>;
    failures: string[];
    approved: boolean;
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    auditTrail: Array<{
      at: string;
      actor: string;
      action: string;
      details?: Record<string, unknown>;
    }>;
  };
}