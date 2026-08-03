export type CapabilityPlatformOperationalState =
  | 'operational'
  | 'degraded';

export type CapabilityPlatformHealthState =
  | 'healthy'
  | 'degraded'
  | 'unhealthy';

export type CapabilityPlatformAuditOperation =
  | 'platform.status-read'
  | 'platform.health-read'
  | 'platform.metrics-read'
  | 'platform.audit-read'
  | 'operation.failed';

export interface CapabilityPlatformStatus {
  readonly name: 'CreatorOS Capability Platform';
  readonly version: '1.1.0';
  readonly state:
    CapabilityPlatformOperationalState;
  readonly registry: {
    readonly registeredCapabilities: number;
  };
  readonly runtime: {
    readonly totalInstances: number;
    readonly activeInstances: number;
    readonly stoppedInstances: number;
    readonly failedInstances: number;
  };
  readonly plugins: {
    readonly installedPlugins: number;
    readonly activePlugins: number;
    readonly inactivePlugins: number;
    readonly failedPlugins: number;
  };
  readonly systems: {
    readonly registryEngine: true;
    readonly runtimeEngine: true;
    readonly dependencyResolver: true;
    readonly pluginHost: true;
    readonly persistentRegistry: true;
    readonly audit: true;
  };
  readonly generatedAt: string;
}

export interface CapabilityPlatformHealthComponent {
  readonly name: string;
  readonly status:
    CapabilityPlatformHealthState;
  readonly message: string;
}

export interface CapabilityPlatformHealth {
  readonly name: 'CreatorOS Capability Platform';
  readonly version: '1.1.0';
  readonly status:
    CapabilityPlatformHealthState;
  readonly components: {
    readonly registry:
      CapabilityPlatformHealthComponent;
    readonly runtime:
      CapabilityPlatformHealthComponent;
    readonly dependencyResolver:
      CapabilityPlatformHealthComponent;
    readonly pluginHost:
      CapabilityPlatformHealthComponent;
    readonly audit:
      CapabilityPlatformHealthComponent;
  };
  readonly generatedAt: string;
}

export interface CapabilityPlatformMetrics {
  readonly registeredCapabilities: number;
  readonly runtimeInstances: number;
  readonly activeRuntimeInstances: number;
  readonly stoppedRuntimeInstances: number;
  readonly failedRuntimeInstances: number;
  readonly installedPlugins: number;
  readonly activePlugins: number;
  readonly inactivePlugins: number;
  readonly failedPlugins: number;
  readonly auditEvents: number;
  readonly generatedAt: string;
}

export interface CapabilityPlatformAuditRecord {
  readonly id: string;
  readonly operation:
    CapabilityPlatformAuditOperation;
  readonly successful: boolean;
  readonly occurredAt: string;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly subjectId?: string;
  readonly message?: string;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}

export interface RecordCapabilityPlatformAuditInput {
  readonly operation:
    CapabilityPlatformAuditOperation;
  readonly successful: boolean;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly subjectId?: string;
  readonly message?: string;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}