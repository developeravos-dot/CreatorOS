export type RuntimeProviderAvailability =
  | "available"
  | "busy"
  | "degraded"
  | "offline"
  | "unknown";

export interface RuntimeDispatchProvider {
  id: string;
  name: string;
  module: string;
  capability: string;
  scope: string;
  available: boolean;
  availability: RuntimeProviderAvailability;
  health: number;
  priority: number;
  workload: number;
  metadata: Record<string, unknown>;
  raw: Record<string, unknown>;
}

export interface RuntimeProviderQuery {
  capability?: string;
  scope?: string;
  providerId?: string;
  onlyAvailable?: boolean;
  minimumHealth?: number;
  maximumWorkload?: number;
}

export interface RuntimeProviderSelection {
  provider: RuntimeDispatchProvider;
  score: number;
  reasons: string[];
}

export interface RuntimeDispatcherOverview {
  providers: number;
  available: number;
  busy: number;
  degraded: number;
  offline: number;
  capabilities: Record<string, number>;
  averageHealth: number;
  averageWorkload: number;
}

export interface RuntimeDispatchRequest {
  capability: string;
  scope?: string;
  preferredProviderId?: string;
  minimumHealth?: number;
  maximumWorkload?: number;
  metadata?: Record<string, unknown>;
}

export interface RuntimeDispatchDecision {
  selected: RuntimeProviderSelection;
  alternatives: RuntimeProviderSelection[];
  requestedCapability: string;
  generatedAt: string;
}