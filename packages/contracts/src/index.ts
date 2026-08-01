export type OperationalStatus =
  | 'planned'
  | 'development'
  | 'operational'
  | 'deprecated';

export interface GovernanceFlags {
  foundationFirst: boolean;
  capabilityFirst: boolean;
  blueprintDriven: boolean;
  humanFinalAuthority: boolean;
}

export interface PlatformIdentity {
  name: string;
  version: string;
  phase: string;
  status: OperationalStatus;
}

export interface RegistrySummary {
  domains: number;
  capabilities: number;
  dependencies: number;
}

export interface PlatformStatusContract {
  platform: PlatformIdentity;
  environment: string;
  registry: RegistrySummary;
  governance: GovernanceFlags;
  timestamp: string;
}

export interface EventMetadata {
  eventId: string;
  eventName: string;
  eventVersion: string;
  source: string;
  occurredAt: string;
  correlationId?: string;
  causationId?: string;
}

export interface PlatformEvent<TPayload = unknown> {
  metadata: EventMetadata;
  payload: TPayload;
}

export interface PlatformStartedPayload {
  platformName: string;
  version: string;
  environment: string;
  status: OperationalStatus;
}

export type PlatformStartedEvent =
  PlatformEvent<PlatformStartedPayload>;
