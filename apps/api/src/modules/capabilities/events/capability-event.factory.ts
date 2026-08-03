import {
  randomUUID,
} from 'node:crypto';

import type {
  CapabilityEventContract,
  CapabilityEventType,
  CapabilityIdentifier,
  CapabilityLifecycleState,
  CapabilityMetadata,
  CapabilityVersion,
} from '../contracts';

export interface CreateCapabilityEventInput {
  readonly eventType: CapabilityEventType;
  readonly capabilityId: CapabilityIdentifier;
  readonly capabilityVersion: CapabilityVersion;
  readonly lifecycleState: CapabilityLifecycleState;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly actorId?: string;
  readonly metadata?: CapabilityMetadata;
}

export class CapabilityEventFactory {
  create(
    input: CreateCapabilityEventInput,
  ): CapabilityEventContract {
    return Object.freeze({
      eventId: randomUUID(),
      eventType: input.eventType,
      capabilityId: input.capabilityId,
      capabilityVersion: input.capabilityVersion,
      lifecycleState: input.lifecycleState,
      occurredAt: new Date().toISOString(),
      correlationId: input.correlationId,
      causationId: input.causationId,
      actorId: input.actorId,
      metadata: input.metadata,
    });
  }
}