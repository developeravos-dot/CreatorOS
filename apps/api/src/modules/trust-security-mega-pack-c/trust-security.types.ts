export type UserStatus =
  | 'active'
  | 'disabled'
  | 'locked';

export interface IdentityUser {
  id: string;
  username: string;
  displayName: string;
  status: UserStatus;
  roleKeys: string[];
  createdAt: string;
}

export interface AccessRole {
  id: string;
  key: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export interface AccessDecision {
  allowed: boolean;
  userId: string;
  permission: string;
  reason: string;
  decidedAt: string;
}

export interface SecurityEvent {
  id: string;
  type:
    | 'authentication'
    | 'authorization'
    | 'threat'
    | 'policy'
    | 'audit';
  severity:
    | 'info'
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';
  source: string;
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SecurityPolicy {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  rules: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetric {
  id: string;
  component: string;
  name: string;
  value: number;
  unit: string;
  recordedAt: string;
}

export interface HealthCheck {
  component: string;
  status:
    | 'healthy'
    | 'degraded'
    | 'unhealthy';
  details: Record<string, unknown>;
  checkedAt: string;
}