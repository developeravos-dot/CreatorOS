import type {
  CapabilityIdentifier,
  CapabilityLifecycleState,
  CapabilityMetadata,
} from '../contracts';

export interface CapabilityLifecycleTransitionRequest {
  readonly capabilityId: CapabilityIdentifier;
  readonly targetState: CapabilityLifecycleState;
  readonly reason?: string;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityLifecycleTransitionResult {
  readonly capabilityId: CapabilityIdentifier;
  readonly previousState: CapabilityLifecycleState;
  readonly currentState: CapabilityLifecycleState;
  readonly changed: boolean;
  readonly transitionedAt: string;
  readonly reason?: string;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface CapabilityLifecycleHistoryEntry
  extends CapabilityLifecycleTransitionResult {
  readonly sequence: number;
}