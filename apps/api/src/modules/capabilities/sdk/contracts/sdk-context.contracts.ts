import type {
  CapabilityIdentifier,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../contracts';
import type {
  CapabilityConfigurationReader,
  CapabilityEventPublisher,
  CapabilityLogger,
  CapabilityServiceResolver,
} from '../../interfaces';

export type CapabilitySdkContextScope =
  | 'root'
  | 'capability'
  | 'plugin'
  | 'operation'
  | 'test';

export interface CapabilitySdkContextIdentity {
  readonly contextId: string;
  readonly parentContextId?: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly capabilityVersion: CapabilityVersion;
  readonly instanceId: string;
  readonly correlationId: string;
  readonly actorId?: string;
  readonly scope: CapabilitySdkContextScope;
}

export interface CapabilitySdkClock {
  now(): Date;
  nowIso(): string;
}

export interface CapabilitySdkIdGenerator {
  generate(): string;
}

export interface CapabilitySdkContextState {
  get<TValue = unknown>(key: string): TValue | undefined;
  require<TValue = unknown>(key: string): TValue;
  set<TValue = unknown>(key: string, value: TValue): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  snapshot(): Readonly<Record<string, unknown>>;
}

export interface CapabilitySdkContext {
  readonly identity: CapabilitySdkContextIdentity;
  readonly logger: CapabilityLogger;
  readonly events: CapabilityEventPublisher;
  readonly configuration: CapabilityConfigurationReader;
  readonly services: CapabilityServiceResolver;
  readonly state: CapabilitySdkContextState;
  readonly clock: CapabilitySdkClock;
  readonly ids: CapabilitySdkIdGenerator;
  readonly metadata?: CapabilityMetadata;

  createChild(
    input?: CapabilitySdkChildContextInput,
  ): CapabilitySdkContext;
}

export interface CapabilitySdkChildContextInput {
  readonly scope?: CapabilitySdkContextScope;
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly metadata?: CapabilityMetadata;
  readonly configuration?: Readonly<Record<string, unknown>>;
  readonly services?: ReadonlyMap<string | symbol, unknown>;
  readonly state?: Readonly<Record<string, unknown>>;
}

export interface CreateCapabilitySdkContextInput {
  readonly capabilityId: CapabilityIdentifier;
  readonly capabilityVersion: CapabilityVersion;
  readonly instanceId?: string;
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly scope?: CapabilitySdkContextScope;
  readonly logger?: CapabilityLogger;
  readonly events?: CapabilityEventPublisher;
  readonly configuration?: Readonly<Record<string, unknown>>;
  readonly services?: ReadonlyMap<string | symbol, unknown>;
  readonly state?: Readonly<Record<string, unknown>>;
  readonly metadata?: CapabilityMetadata;
}