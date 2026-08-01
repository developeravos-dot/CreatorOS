export type SponsorshipOpportunityStatus =
  | 'discovered'
  | 'qualified'
  | 'recommended'
  | 'contacted'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'rejected';

export type SponsorshipFitLevel =
  | 'exceptional'
  | 'strong'
  | 'moderate'
  | 'weak';

export type SponsorshipRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface SponsorshipAudienceProfile {
  countries: string[];
  languages: string[];
  ageRanges: string[];
  interests: string[];
  estimatedReach: number;
  engagementRate: number;
}

export interface SponsorshipChannelProfile {
  channelId: string;
  channelName: string;
  platforms: string[];
  categories: string[];
  audience: SponsorshipAudienceProfile;
  averageViews: number;
  publishingFrequencyPerMonth: number;
  brandSafetyScore: number;
  contentQualityScore: number;
}

export interface SponsorProfile {
  sponsorId: string;
  companyName: string;
  website?: string;
  industries: string[];
  targetCountries: string[];
  targetLanguages: string[];
  targetAgeRanges: string[];
  targetInterests: string[];
  preferredPlatforms: string[];
  preferredContentCategories: string[];
  estimatedBudgetMin: number;
  estimatedBudgetMax: number;
  currency: string;
  brandSafetyRequirements: string[];
  prohibitedTopics: string[];
  contactName?: string;
  contactEmail?: string;
  notes?: string;
}

export interface SponsorshipScoreBreakdown {
  audienceMatch: number;
  categoryMatch: number;
  geographyMatch: number;
  platformMatch: number;
  engagementQuality: number;
  brandSafety: number;
  budgetCompatibility: number;
  contentQuality: number;
  strategicValue: number;
}

export interface SponsorshipOpportunity {
  opportunityId: string;
  sponsor: SponsorProfile;
  channel: SponsorshipChannelProfile;
  status: SponsorshipOpportunityStatus;
  fitLevel: SponsorshipFitLevel;
  riskLevel: SponsorshipRiskLevel;
  score: number;
  scoreBreakdown: SponsorshipScoreBreakdown;
  recommendedPrice: number;
  minimumAcceptablePrice: number;
  maximumPotentialPrice: number;
  currency: string;
  recommendedFormats: string[];
  valueProposition: string[];
  risks: string[];
  negotiationPoints: string[];
  nextBestAction: string;
  requiresHumanApproval: boolean;
  createdAt: string;
  updatedAt: string;
}
