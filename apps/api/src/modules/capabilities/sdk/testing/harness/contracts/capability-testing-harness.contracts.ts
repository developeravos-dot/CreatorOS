import type {
  CapabilityMetadata,
} from '../../../../contracts';
import type {
  CapabilityProvider,
} from '../../../../interfaces';
import type {
  CapabilitySdkContext,
} from '../../../contracts';
import type {
  MockSdkContextFixture,
} from '../../mocks';
import type {
  MockCapabilityRuntime,
  MockRuntimeInstance,
} from '../../runtime';

export interface CapabilityLifecycleProbeSnapshot {
  readonly initializeCalls: number;
  readonly activateCalls: number;
  readonly stopCalls: number;
  readonly callOrder: readonly string[];
}

export interface CapabilityLifecycleProbe {
  initialize(): Promise<void>;
  activate(): Promise<void>;
  stop(): Promise<void>;

  failNextInitialize(error?: Error): void;
  failNextActivate(error?: Error): void;
  failNextStop(error?: Error): void;

  snapshot(): CapabilityLifecycleProbeSnapshot;
  reset(): void;
}

export interface CapabilityTestFixture {
  readonly capabilityId: string;
  readonly version: string;
  readonly provider: CapabilityProvider;
  readonly lifecycle: CapabilityLifecycleProbe;
}

export interface CreateCapabilityTestFixtureInput {
  readonly capabilityId?: string;
  readonly name?: string;
  readonly version?: string;
  readonly description?: string;
  readonly domain?: string;
  readonly module?: string;
  readonly tags?: readonly string[];
  readonly metadata?: CapabilityMetadata;
}

export interface CreateCapabilityTestingHarnessInput {
  readonly fixture?: CapabilityTestFixture;
  readonly context?: MockSdkContextFixture;
  readonly runtime?: MockCapabilityRuntime;
  readonly configuration?: Readonly<Record<string, unknown>>;
  readonly services?: ReadonlyMap<string | symbol, unknown>;
  readonly state?: Readonly<Record<string, unknown>>;
}

export interface CapabilityTestingHarnessSnapshot {
  readonly capabilityId: string;
  readonly registered: boolean;
  readonly instances:
    readonly MockRuntimeInstance[];
  readonly lifecycle:
    CapabilityLifecycleProbeSnapshot;
  readonly runtimeCallCount: number;
  readonly failedRuntimeCallCount: number;
  readonly contextState:
    Readonly<Record<string, unknown>>;
}

export interface CapabilityTestingHarness {
  readonly fixture: CapabilityTestFixture;
  readonly contextFixture: MockSdkContextFixture;
  readonly context: CapabilitySdkContext;
  readonly runtime: MockCapabilityRuntime;

  register(): void;
  start(
    metadata?: CapabilityMetadata,
  ): Promise<MockRuntimeInstance>;
  stop(
    instanceId: string,
    reason?: string,
  ): Promise<MockRuntimeInstance>;
  unregister(): void;
  reset(): void;
  snapshot(): CapabilityTestingHarnessSnapshot;
}