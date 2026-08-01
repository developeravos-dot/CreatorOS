export type ConsistencyEntityType =
  | 'character'
  | 'environment'
  | 'prop';

export type ConsistencyValidationStatus =
  | 'passed'
  | 'warning'
  | 'failed';

export interface CanonicalIdentityFingerprint {
  fingerprintId: string;

  worldId: string;
  bibleId: string;

  entityType: ConsistencyEntityType;

  entityId: string;
  entityName: string;

  canonicalValues: {
    identityDescription: string;
    primaryColors: string[];
    proportions: string[];
    signatureElements: string[];
    continuityKeys: string[];
    identityLockPrompt: string;
    negativePrompt: string;
  };

  fingerprintHash: string;

  locked: boolean;
  version: number;

  createdAt: string;
  updatedAt: string;
}

export interface VisualGenerationSnapshot {
  snapshotId: string;

  worldId: string;
  bibleId: string;

  entityType: ConsistencyEntityType;

  entityId: string;
  entityName: string;

  providerId: string;

  prompt: string;
  negativePrompt: string;

  continuityKeys: string[];

  outputAssetId?: string;
  outputLocation?: string;

  extractedValues: {
    identityDescription?: string;
    colors?: string[];
    proportions?: string[];
    signatureElements?: string[];
  };

  createdAt: string;
}

export interface ConsistencyDeviation {
  field:
    | 'identity'
    | 'colors'
    | 'proportions'
    | 'signature-elements'
    | 'continuity-keys'
    | 'prompt-lock';

  severity:
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';

  expected: string[];
  actual: string[];

  score: number;
  explanation: string;

  recommendedRepair: string;
}

export interface VisualConsistencyValidation {
  validationId: string;

  worldId: string;
  bibleId: string;

  entityType: ConsistencyEntityType;

  entityId: string;
  entityName: string;

  fingerprintId: string;
  snapshotId: string;

  status: ConsistencyValidationStatus;

  scores: {
    identityScore: number;
    colorScore: number;
    proportionScore: number;
    signatureElementScore: number;
    continuityKeyScore: number;
    totalScore: number;
  };

  deviations: ConsistencyDeviation[];

  repairRequired: boolean;

  repairedPrompt?: string;
  repairedNegativePrompt?: string;

  humanApprovalRequired: boolean;

  createdAt: string;
}

export interface CharacterConsistencyStatus {
  success: boolean;

  engine: string;
  version: string;

  phase: string;
  status: 'operational';

  architecture: {
    canonicalFingerprintEngine: boolean;
    identityLockEngine: boolean;
    colorConsistencyEngine: boolean;
    proportionConsistencyEngine: boolean;
    signatureElementValidator: boolean;
    promptRepairEngine: boolean;
    providerIndependentValidation: boolean;
    humanApprovalGate: boolean;
    permanentConsistencyStorage: boolean;
  };

  thresholds: {
    minimumPassingScore: number;
    warningScore: number;
    criticalIdentityScore: number;
  };
}
