export type ValidationStatus =
  | 'pending'
  | 'passed'
  | 'failed';

export interface ProductionCheck {
  id: string;
  key: string;
  name: string;
  status: ValidationStatus;
  critical: boolean;
  message: string;
  checkedAt: string;
}

export interface ReleaseManifest {
  id: string;
  version: string;
  environment: string;
  commit: string;
  artifacts: string[];
  checks: ProductionCheck[];
  approved: boolean;
  createdAt: string;
}

export interface BackupRecord {
  id: string;
  name: string;
  scope: string[];
  status:
    | 'created'
    | 'verified'
    | 'failed'
    | 'restored';
  createdAt: string;
  verifiedAt?: string;
  restoredAt?: string;
  metadata: Record<string, unknown>;
}

export interface DiagnosticSnapshot {
  id: string;
  status:
    | 'healthy'
    | 'degraded'
    | 'unhealthy';
  components: Record<string, string>;
  readinessScore: number;
  generatedAt: string;
}