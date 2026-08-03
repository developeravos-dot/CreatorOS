import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../../../contracts';
import type {
  CapabilityProvider,
} from '../../../../interfaces';

export type MockRuntimeOperation =
  | 'register'
  | 'unregister'
  | 'initialize'
  | 'activate'
  | 'start'
  | 'stop'
  | 'reset';

export type MockRuntimeInstanceState =
  | 'registered'
  | 'initialized'
  | 'active'
  | 'stopped'
  | 'failed';

export interface MockRuntimeRegistration {
  readonly capabilityId:
    CapabilityIdentifier;
  readonly version:
    CapabilityVersion;
  readonly manifest:
    CapabilityManifestContract;
  readonly provider:
    CapabilityProvider;
  readonly registeredAt: string;
}

export interface MockRuntimeInstance {
  readonly instanceId: string;
  readonly capabilityId:
    CapabilityIdentifier;
  readonly version:
    CapabilityVersion;
  readonly state:
    MockRuntimeInstanceState;
  readonly startedAt?: string;
  readonly stoppedAt?: string;
  readonly failure?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface MockRuntimeCall {
  readonly sequence: number;
  readonly operation:
    MockRuntimeOperation;
  readonly capabilityId?:
    CapabilityIdentifier;
  readonly instanceId?: string;
  readonly occurredAt: string;
  readonly successful: boolean;
  readonly error?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface MockRuntimeFailurePlan {
  readonly operation:
    MockRuntimeOperation;
  readonly error: Error;
  readonly capabilityId?:
    CapabilityIdentifier;
  readonly remaining: number;
}

export interface StartMockRuntimeInput {
  readonly capabilityId:
    CapabilityIdentifier;
  readonly instanceId?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface StopMockRuntimeInput {
  readonly instanceId: string;
  readonly reason?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface RegisterMockRuntimeInput {
  readonly manifest:
    CapabilityManifestContract;
  readonly provider:
    CapabilityProvider;
}