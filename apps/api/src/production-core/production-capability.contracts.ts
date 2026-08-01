export type ProductionCapability =
  | 'idea-generation'
  | 'research'
  | 'script-generation'
  | 'video-generation'
  | 'thumbnail-generation'
  | 'thumbnail-editing'
  | 'voice-generation'
  | 'music-generation'
  | 'video-editing'
  | 'publishing-youtube'
  | 'publishing-tiktok'
  | 'analytics-youtube'
  | 'analytics-tiktok';

export type ProductionIntegrationMode =
  | 'api'
  | 'desktop'
  | 'connector'
  | 'manual-assisted'
  | 'local';

export type ProductionCostTier = 'free' | 'low' | 'medium' | 'high';

export interface ProductionToolHealth {
  id: string;
  displayName: string;
  enabled: boolean;
  configured: boolean;
  available: boolean;
  mode: ProductionIntegrationMode;
  costTier: ProductionCostTier;
  qualityScore: number;
  capabilities: ProductionCapability[];
  reason?: string;
}

export interface ProductionSelectionContext {
  capability: ProductionCapability;
  allowPaid?: boolean;
  minimumQuality?: number;
  preferredToolId?: string;
}

export interface ProductionSelectionResult {
  capability: ProductionCapability;
  selectedTool: ProductionToolHealth | null;
  alternatives: ProductionToolHealth[];
  reason: string;
}

export interface ProductionPlanRequest {
  capabilities?: ProductionCapability[];
  allowPaid?: boolean;
  minimumQuality?: number;
  preferredTools?: Partial<Record<ProductionCapability, string>>;
}