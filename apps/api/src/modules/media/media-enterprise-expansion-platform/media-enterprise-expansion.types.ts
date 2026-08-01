export type AssetStage =
  | 'idea'
  | 'validated'
  | 'production'
  | 'distributed'
  | 'monetized'
  | 'licensed'
  | 'scaled'
  | 'archived';

export interface MediaAssetInput {
  title: string;
  concept: string;
  category: string;
  owner: string;
  sourceOpportunityId?: string;
  targetAudiences?: string[];
  targetMarkets?: string[];
  languages?: string[];
  platforms?: string[];
  rightsOwner?: string;
  strategicScore?: number;
  revenuePotential?: number;
  scalability?: number;
  originality?: number;
  risk?: number;
}

export interface MediaAsset {
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: AssetStage;
  input: MediaAssetInput;
  ip: {
    fingerprint: string;
    universe: string;
    extensions: string[];
    rightsStatus: 'unverified' | 'verified' | 'restricted';
  };
  localization: {
    markets: string[];
    languages: string[];
    adaptations: string[];
  };
  licensing: {
    readiness: number;
    models: string[];
    approved: boolean;
  };
  partnerships: {
    candidates: string[];
    active: string[];
  };
  commerce: {
    products: string[];
    channels: string[];
  };
  revenue: {
    models: string[];
    forecast: number;
    realized: number;
  };
  governance: {
    humanApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    risks: string[];
  };
  history: Array<{
    at: string;
    action: string;
    actor: string;
  }>;
}

export interface PortfolioDashboard {
  totalAssets: number;
  byStage: Record<string, number>;
  totalForecastRevenue: number;
  totalRealizedRevenue: number;
  licensingReady: number;
  globallyLocalized: number;
  humanApproved: number;
  priorityAssets: Array<{
    id: string;
    title: string;
    score: number;
    stage: AssetStage;
  }>;
}