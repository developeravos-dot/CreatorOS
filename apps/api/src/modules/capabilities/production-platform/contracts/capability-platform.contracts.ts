export type CapabilityPlatformOperationalState =
  | 'operational'
  | 'degraded';

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
  };
  readonly generatedAt: string;
}