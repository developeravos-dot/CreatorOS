export type MigrationEntityType =
  | 'character'
  | 'environment'
  | 'prop';

export type MigrationTestStatus =
  | 'draft'
  | 'running'
  | 'passed'
  | 'warning'
  | 'failed'
  | 'approved'
  | 'rejected';

export interface ProviderMigrationScores {
  identity: number;
  colors: number;
  proportions: number;
  signatureElements: number;
  style: number;
  continuity: number;
  total: number;
}

export interface ProviderMigrationTest {
  migrationTestId: string;

  worldId: string;
  bibleId: string;

  entityType: MigrationEntityType;
  entityId: string;
  entityName: string;

  currentProviderId: string;
  candidateProviderId: string;

  workload:
    | 'character-reference'
    | 'character-expression'
    | 'character-pose'
    | 'environment-reference'
    | 'prop-reference'
    | 'storyboard-frame';

  scores: ProviderMigrationScores;

  thresholds: {
    minimumIdentity: number;
    minimumColors: number;
    minimumProportions: number;
    minimumSignatureElements: number;
    minimumStyle: number;
    minimumContinuity: number;
    minimumTotal: number;
  };

  status: MigrationTestStatus;

  productionAllowed: boolean;
  rollbackProviderId: string;

  failures: string[];
  warnings: string[];

  humanApprovalRequired: boolean;
  approvedByHuman: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ProviderEntityLock {
  lockId: string;

  worldId: string;
  entityType: MigrationEntityType;
  entityId: string;
  entityName: string;

  workload: string;

  providerId: string;
  migrationTestId: string;

  locked: boolean;

  fallbackProviderId?: string;

  createdAt: string;
  updatedAt: string;
}
