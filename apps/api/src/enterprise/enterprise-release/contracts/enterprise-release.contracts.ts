export interface EnterpriseReleaseManifest {
  readonly releaseId: string;
  readonly version: string;
  readonly environment:
    | 'staging'
    | 'production';
  readonly image: string;
  readonly replicas: number;
  readonly createdAt: Date;
}

export interface EnterpriseReleaseValidation {
  readonly valid: boolean;
  readonly blockers:
    readonly string[];
  readonly warnings:
    readonly string[];
  readonly checkedAt: Date;
}
