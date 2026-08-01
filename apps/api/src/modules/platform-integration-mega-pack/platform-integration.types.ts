export type PlatformCapabilityStatus =
  | 'registered'
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'offline';

export interface PlatformCapability {
  id: string;
  key: string;
  name: string;
  domain: string;
  version: string;
  status: PlatformCapabilityStatus;
  apiRoot: string;
  dependencies: string[];
  healthScore: number;
  enabled: boolean;
  metadata: Record<string, unknown>;
}

export interface PlatformCommand {
  id: string;
  createdAt: string;
  command: string;
  targetCapability: string;
  payload: Record<string, unknown>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status:
    | 'queued'
    | 'awaiting-human-approval'
    | 'approved'
    | 'completed'
    | 'failed';
  requestedBy: string;
  approvedBy?: string;
  result?: Record<string, unknown>;
}

export interface PlatformEvent {
  id: string;
  at: string;
  actor: string;
  type: string;
  subjectId?: string;
  details?: Record<string, unknown>;
}

export interface CreatorOSPlatform {
  id: string;
  name: string;
  version: string;
  status:
    | 'draft'
    | 'awaiting-human-approval'
    | 'approved'
    | 'active'
    | 'degraded';
  createdAt: string;
  updatedAt: string;
  capabilities: PlatformCapability[];
  commands: PlatformCommand[];
  events: PlatformEvent[];
  governance: {
    humanFinalAuthority: boolean;
    approvedBy?: string;
    approvedAt?: string;
    protectedPrinciples: string[];
  };
}