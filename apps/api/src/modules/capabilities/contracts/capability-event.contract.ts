import type {
  CapabilityIdentifier,
  CapabilityLifecycleState,
  CapabilityMetadata,
  CapabilityVersion,
} from './capability.types';

export type CapabilityEventType =
  | 'capability.discovered'
  | 'capability.registered'
  | 'capability.validated'
  | 'capability.installed'
  | 'capability.initialized'
  | 'capability.activated'
  | 'capability.suspended'
  | 'capability.stopped'
  | 'capability.failed'
  | 'capability.uninstalled';

export interface CapabilityEventContract {
  readonly eventId: string;
  readonly eventType: CapabilityEventType;

  readonly capabilityId: CapabilityIdentifier;
  readonly capabilityVersion: CapabilityVersion;
  readonly lifecycleState: CapabilityLifecycleState;

  readonly occurredAt: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly actorId?: string;

  readonly metadata?: CapabilityMetadata;
}