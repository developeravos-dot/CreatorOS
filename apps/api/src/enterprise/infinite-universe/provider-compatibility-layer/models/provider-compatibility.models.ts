export type CompatibleProviderId =
  | 'manual-export'
  | 'mock-image'
  | string;

export type ProviderWorkload =
  | 'character-reference'
  | 'character-expression'
  | 'character-pose'
  | 'environment-reference'
  | 'prop-reference'
  | 'storyboard-frame';

export type ProviderApprovalStatus =
  | 'unverified'
  | 'sandbox'
  | 'approved'
  | 'restricted'
  | 'rejected';

export interface ProviderCompatibilityProfile {
  profileId: string;

  providerId: CompatibleProviderId;
  displayName: string;

  available: boolean;
  configured: boolean;

  approvalStatus:
    ProviderApprovalStatus;

  executionMode:
    | 'manual-export'
    | 'simulation'
    | 'external-api';

  supportedWorkloads:
    ProviderWorkload[];

  capabilities: {
    textToImage: boolean;
    referenceImageInput: boolean;
    negativePrompt: boolean;
    multipleImages: boolean;
    transparentBackground: boolean;
    deterministicSeed: boolean;
  };

  strengths: string[];
  weaknesses: string[];
  limitations: string[];

  compatibility: {
    characterReference: number;
    characterExpression: number;
    characterPose: number;
    environmentReference: number;
    propReference: number;
    storyboardFrame: number;
    overall: number;
  };

  recommendedSettings: {
    width: number;
    height: number;
    imageCount: number;

    referenceStrength?: number;
    styleStrength?: number;
    guidanceScale?: number;
    seed?: number;
  };

  governance: {
    sandboxRequired: boolean;
    migrationTestRequired: boolean;
    humanApprovalRequired: boolean;
    productionAllowed: boolean;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ProviderResolutionDecision {
  workload: ProviderWorkload;

  requestedProviderId?: string;
  resolvedProviderId: string;

  profileId: string;

  allowed: boolean;

  score: number;
  reason: string;

  fallbackProviderIds: string[];

  migrationGateRequired: boolean;
  humanApprovalRequired: boolean;
}

export interface ProviderCompatibilityStatus {
  success: boolean;

  engine:
    'CreatorOS Provider Compatibility Layer';

  version: '1.0.0';

  phase:
    'Provider-Neutral Compatibility Foundation';

  status: 'operational';

  architecture: {
    unifiedProviderInterface: boolean;
    providerProfileEngine: boolean;
    workloadCapabilityMapping: boolean;
    providerResolutionEngine: boolean;
    fallbackProviderSelection: boolean;
    migrationGateIntegrationReady: boolean;
    hybridProviderReady: boolean;
    providerLockReady: boolean;
  };
}
