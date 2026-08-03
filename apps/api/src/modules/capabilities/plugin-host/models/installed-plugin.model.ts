import type {
  CapabilityIdentifier,
  CapabilityMetadata,
  CapabilityVersion,
} from '../../contracts';
import type {
  InstalledPluginContract,
  PluginInstallationState,
} from '../contracts';

export class InstalledPluginModel
  implements InstalledPluginContract
{
  private currentState: PluginInstallationState;
  private currentUpdatedAt: string;
  private currentRuntimeInstanceId?: string;
  private currentLastError?: string;

  constructor(
    readonly pluginKey: string,
    readonly capabilityId: CapabilityIdentifier,
    readonly version: CapabilityVersion,
    state: PluginInstallationState,
    readonly installedAt: string,
    updatedAt: string,
    runtimeInstanceId?: string,
    lastError?: string,
    readonly metadata?: CapabilityMetadata,
  ) {
    this.currentState = state;
    this.currentUpdatedAt = updatedAt;
    this.currentRuntimeInstanceId = runtimeInstanceId;
    this.currentLastError = lastError;
  }

  get state(): PluginInstallationState {
    return this.currentState;
  }

  get updatedAt(): string {
    return this.currentUpdatedAt;
  }

  get runtimeInstanceId(): string | undefined {
    return this.currentRuntimeInstanceId;
  }

  get lastError(): string | undefined {
    return this.currentLastError;
  }

  transition(
    state: PluginInstallationState,
    runtimeInstanceId?: string,
    error?: unknown,
  ): void {
    this.currentState = state;
    this.currentUpdatedAt = new Date().toISOString();

    if (runtimeInstanceId !== undefined) {
      this.currentRuntimeInstanceId = runtimeInstanceId;
    }

    if (
      state === 'inactive' ||
      state === 'installed'
    ) {
      this.currentRuntimeInstanceId = undefined;
    }

    this.currentLastError =
      error instanceof Error
        ? error.message
        : error !== undefined
          ? String(error)
          : undefined;
  }

  snapshot(): InstalledPluginContract {
    return {
      pluginKey: this.pluginKey,
      capabilityId: this.capabilityId,
      version: this.version,
      state: this.currentState,
      installedAt: this.installedAt,
      updatedAt: this.currentUpdatedAt,
      runtimeInstanceId:
        this.currentRuntimeInstanceId,
      lastError: this.currentLastError,
      metadata: this.metadata,
    };
  }
}