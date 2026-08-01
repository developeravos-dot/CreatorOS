export type CapabilityState =
  | 'registered'
  | 'active'
  | 'degraded'
  | 'disabled';

export interface CapabilityDefinition {
  id: string;
  key: string;
  name: string;
  version: string;
  state: CapabilityState;
  dependencies: string[];
  commands: string[];
  eventsProduced: string[];
  eventsConsumed: string[];
  metadata: Record<string, unknown>;
}

export interface PlatformEvent {
  id: string;
  name: string;
  source: string;
  payload: Record<string, unknown>;
  createdAt: string;
  correlationId?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  capability: string;
  command: string;
  dependsOn: string[];
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'blocked';
  output?: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  status:
    | 'draft'
    | 'ready'
    | 'running'
    | 'completed'
    | 'failed';
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformDependencyGraph {
  nodes: Array<{
    key: string;
    state: CapabilityState;
  }>;
  edges: Array<{
    from: string;
    to: string;
  }>;
}

export interface PlatformCoreState {
  capabilities: CapabilityDefinition[];
  events: PlatformEvent[];
  workflows: WorkflowDefinition[];
  humanFinalAuthority: boolean;
}