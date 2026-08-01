export type PluginStatus =
  | 'registered'
  | 'installed'
  | 'enabled'
  | 'disabled'
  | 'failed';

export interface PluginDefinition {
  id: string;
  key: string;
  name: string;
  version: string;
  publisher: string;
  status: PluginStatus;
  capabilities: string[];
  permissions: string[];
  installedAt?: string;
  enabledAt?: string;
  metadata: Record<string, unknown>;
}

export type DeploymentStatus =
  | 'planned'
  | 'running'
  | 'successful'
  | 'failed'
  | 'rolled-back';

export interface DeploymentRecord {
  id: string;
  environment: string;
  version: string;
  status: DeploymentStatus;
  services: string[];
  startedAt?: string;
  completedAt?: string;
  rollbackOf?: string;
  metadata: Record<string, unknown>;
}

export interface DashboardWidget {
  id: string;
  key: string;
  title: string;
  category:
    | 'platform'
    | 'intelligence'
    | 'security'
    | 'operations'
    | 'extensions';
  value: number | string | boolean;
  status:
    | 'normal'
    | 'warning'
    | 'critical'
    | 'unknown';
  updatedAt: string;
}

export interface OperationsRunbook {
  id: string;
  key: string;
  name: string;
  steps: string[];
  enabled: boolean;
  createdAt: string;
}