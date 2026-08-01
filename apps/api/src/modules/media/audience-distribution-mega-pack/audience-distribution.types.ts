export type DistributionStatus =
  | 'draft'
  | 'awaiting-human-approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed';

export interface DistributionBrief {
  title: string;
  contentType: string;
  topic: string;
  audience: string;
  ageGroup: string;
  sourceLanguage?: string;
  targetLanguages?: string[];
  targetCultures?: string[];
  targetMarkets?: string[];
  platforms?: string[];
  durationSeconds?: number;
  releaseWindow?: string;
  riskTolerance?: number;
  objectives?: string[];
}

export interface TrendSignal {
  id: string;
  topic: string;
  market: string;
  momentum: number;
  saturation: number;
  relevance: number;
  originalityOpportunity: number;
  recommendation: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  needs: string[];
  motivations: string[];
  barriers: string[];
  preferredFormats: string[];
  retentionTriggers: string[];
}

export interface PublishingPlan {
  platforms: Array<{
    platform: string;
    format: string;
    cadence: string;
    titleStrategy: string;
    metadataStrategy: string;
    releasePriority: number;
  }>;
  schedule: Array<{
    order: number;
    platform: string;
    action: string;
    timing: string;
  }>;
  experiments: string[];
}

export interface LocalizationPlan {
  sourceLanguage: string;
  targets: Array<{
    language: string;
    translationMode: string;
    dubbingMode: string;
    subtitleMode: string;
    status: string;
  }>;
  preservationRules: string[];
}

export interface CulturalReview {
  markets: Array<{
    market: string;
    sensitivities: string[];
    adaptationRules: string[];
    opportunityNotes: string[];
    riskScore: number;
  }>;
  globalRules: string[];
}

export interface ContentQualityReview {
  scores: Record<string, number>;
  failures: string[];
  approved: boolean;
}

export interface ContentSafetyReview {
  riskScore: number;
  flags: string[];
  requiredActions: string[];
  safeForDistribution: boolean;
}

export interface AudienceDistributionProgram {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: DistributionStatus;
  brief: DistributionBrief;
  trends: TrendSignal[];
  audienceSegments: AudienceSegment[];
  publishing: PublishingPlan;
  localization: LocalizationPlan;
  culturalReview: CulturalReview;
  quality: ContentQualityReview;
  safety: ContentSafetyReview;
  analytics: {
    metrics: Record<string, number>;
    alerts: string[];
    learnings: string[];
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