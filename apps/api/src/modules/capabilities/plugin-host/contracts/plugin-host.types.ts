import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../contracts';
import type {
  CapabilityProvider,
} from '../../interfaces';

export type PluginInstallationState =
  | 'discovered'
  | 'validating'
  | 'installed'
  | 'activating'
  | 'active'
  | 'deactivating'
  | 'inactive'
  | 'uninstalling'
  | 'failed';

export interface PluginPackageContract {
  readonly pluginKey: string;
  readonly name: string;
  readonly version: CapabilityVersion;
  readonly description?: string;
  readonly capabilityManifest: CapabilityManifestContract;
  readonly provider: CapabilityProvider;
  readonly checksum?: string;
  readonly signature?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface InstalledPluginContract {
  readonly pluginKey: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly version: CapabilityVersion;
  readonly state: PluginInstallationState;
  readonly installedAt: string;
  readonly updatedAt: string;
  readonly runtimeInstanceId?: string;
  readonly lastError?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface InstallPluginRequest {
  readonly package: PluginPackageContract;
  readonly includeOptionalDependencies?: boolean;
  readonly enforcePeerDependencies?: boolean;
  readonly actorId?: string;
  readonly correlationId?: string;
}

export interface UninstallPluginRequest {
  readonly pluginKey: string;
  readonly force?: boolean;
  readonly reason?: string;
  readonly actorId?: string;
  readonly correlationId?: string;
}

export interface ActivatePluginRequest {
  readonly pluginKey: string;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly metadata?: CapabilityMetadata;
}

export interface DeactivatePluginRequest {
  readonly pluginKey: string;
  readonly reason?: string;
  readonly actorId?: string;
  readonly correlationId?: string;
}

export interface PluginHostOperationResult {
  readonly pluginKey: string;
  readonly capabilityId: CapabilityIdentifier;
  readonly previousState: PluginInstallationState;
  readonly currentState: PluginInstallationState;
  readonly changed: boolean;
  readonly completedAt: string;
  readonly runtimeInstanceId?: string;
  readonly message?: string;
}