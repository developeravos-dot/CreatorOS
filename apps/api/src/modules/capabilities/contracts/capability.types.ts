export const CAPABILITY_MANIFEST_SCHEMA_VERSION = '1.0.0' as const;

export type CapabilityManifestSchemaVersion =
  typeof CAPABILITY_MANIFEST_SCHEMA_VERSION;

export type CapabilityIdentifier = string;
export type CapabilityVersion = string;
export type CapabilityDomain = string;
export type CapabilityPermission = string;
export type CapabilityTag = string;

export type CapabilityKind =
  | 'core'
  | 'application'
  | 'integration'
  | 'intelligence'
  | 'automation'
  | 'content'
  | 'infrastructure'
  | 'extension';

export type CapabilityRuntime =
  | 'node'
  | 'browser'
  | 'worker'
  | 'hybrid';

export type CapabilityLifecycleState =
  | 'discovered'
  | 'registered'
  | 'validated'
  | 'installed'
  | 'initialized'
  | 'active'
  | 'suspended'
  | 'stopped'
  | 'failed'
  | 'uninstalled';

export type CapabilityHealthStatus =
  | 'unknown'
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'offline';

export type CapabilityDependencyType =
  | 'required'
  | 'optional'
  | 'peer';

export type CapabilityValidationSeverity =
  | 'error'
  | 'warning'
  | 'information';

export type CapabilityMetadataValue =
  | string
  | number
  | boolean
  | null
  | readonly CapabilityMetadataValue[]
  | {
      readonly [key: string]: CapabilityMetadataValue;
    };

export type CapabilityMetadata = Readonly<
  Record<string, CapabilityMetadataValue>
>;