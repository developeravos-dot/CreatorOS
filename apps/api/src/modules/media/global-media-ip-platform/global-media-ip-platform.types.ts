export type GlobalMediaAssetStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'distribution-ready'
  | 'commercially-active'
  | 'paused'
  | 'retired';

export type MarketTier = 'primary' | 'growth' | 'experimental';
export type RevenueModel =
  | 'advertising'
  | 'sponsorship'
  | 'affiliate'
  | 'subscription'
  | 'digital-product'
  | 'licensing'
  | 'commerce'
  | 'format-rights';

export interface GlobalMediaAssetInput {
  name: string;
  assetType: string;
  description: string;
  sourceProjectId?: string;
  originLanguage: string;
  targetLanguages?: string[];
  targetMarkets?: string[];
  platforms?: string[];
  audience: string;
  ageGroup?: string;
  objectives?: string[];
}

export interface IntellectualPropertyBlueprint {
  ipId: string;
  canonicalTitle: string;
  assetClass: string;
  ownershipStatus: 'AVOS-owned';
  rightsRegistry: Array<{ territory: string; media: string[]; status: 'reserved' | 'active' }>;
  derivativePaths: string[];
  franchiseArchitecture: string[];
  characterBible: string[];
  worldBible: string[];
  continuityRules: string[];
  protectionGates: string[];
  valuationSignals: string[];
}

export interface DistributionMarketPlan {
  market: string;
  tier: MarketTier;
  languages: string[];
  platforms: string[];
  releaseWindows: string[];
  adaptationLevel: 'translation' | 'localization' | 'cultural-remake';
  complianceGates: string[];
  discoveryStrategy: string[];
  crossChannelRoutes: string[];
  readinessScore: number;
}

export interface DistributionBlueprint {
  globalReleaseMode: 'phased';
  markets: DistributionMarketPlan[];
  contentSupplyChain: string[];
  localizationCouncil: string[];
  publishingControls: string[];
  performanceFeedbackLoop: string[];
}

export interface MonetizationBlueprint {
  models: Array<{
    model: RevenueModel;
    enabled: boolean;
    readinessScore: number;
    requirements: string[];
  }>;
  offerLadder: string[];
  pricingIntelligence: string[];
  revenueAllocation: string[];
  profitabilityGates: string[];
  reinvestmentRules: string[];
}

export interface PartnershipBlueprint {
  partnerCategories: string[];
  licensingPackages: string[];
  dealStages: string[];
  dueDiligence: string[];
  negotiationCouncil: string[];
  approvalGates: string[];
}

export interface AudienceNetworkBlueprint {
  audienceGraph: string[];
  exchangeRules: string[];
  communityLoops: string[];
  retentionSystems: string[];
  privacyControls: string[];
}

export interface GlobalMediaAsset {
  id: string;
  status: GlobalMediaAssetStatus;
  createdAt: string;
  updatedAt: string;
  input: GlobalMediaAssetInput;
  intellectualProperty: IntellectualPropertyBlueprint;
  distribution: DistributionBlueprint;
  monetization: MonetizationBlueprint;
  partnerships: PartnershipBlueprint;
  audienceNetwork: AudienceNetworkBlueprint;
  approvals: {
    strategyApproved: boolean;
    commercialApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
  };
  performance: {
    reach: number;
    engagement: number;
    retention: number;
    revenue: number;
    licensingInterest: number;
  };
  learning: Array<{
    at: string;
    source: string;
    signal: string;
    value: number;
    action: string;
  }>;
}