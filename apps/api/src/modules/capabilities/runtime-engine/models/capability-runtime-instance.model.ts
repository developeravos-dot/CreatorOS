import type {
  CapabilityLifecycleState,
  CapabilityMetadata,
} from '../../contracts';
import type {
  CapabilityExecutionContext,
  CapabilityProvider,
} from '../../interfaces';
import type {
  CapabilityRuntimeInstance,
  CapabilityRuntimeInstanceStatus,
} from '../contracts';

export class CapabilityRuntimeInstanceModel
  implements CapabilityRuntimeInstance
{
  private currentStatus: CapabilityRuntimeInstanceStatus;
  private currentLifecycleState: CapabilityLifecycleState;
  private currentUpdatedAt: string;
  private currentLastError?: string;

  constructor(
    readonly instanceId: string,
    readonly provider: CapabilityProvider,
    readonly context: CapabilityExecutionContext,
    status: CapabilityRuntimeInstanceStatus = 'created',
    lifecycleState: CapabilityLifecycleState = 'registered',
    readonly createdAt: string = new Date().toISOString(),
    readonly metadata?: CapabilityMetadata,
  ) {
    this.currentStatus = status;
    this.currentLifecycleState = lifecycleState;
    this.currentUpdatedAt = createdAt;
  }

  get capabilityId(): string {
    return this.provider.manifest.id;
  }

  get capabilityVersion(): string {
    return this.provider.manifest.version;
  }

  get manifest() {
    return this.provider.manifest;
  }

  get status(): CapabilityRuntimeInstanceStatus {
    return this.currentStatus;
  }

  get lifecycleState(): CapabilityLifecycleState {
    return this.currentLifecycleState;
  }

  get updatedAt(): string {
    return this.currentUpdatedAt;
  }

  get lastError(): string | undefined {
    return this.currentLastError;
  }

  updateStatus(
    status: CapabilityRuntimeInstanceStatus,
    lifecycleState: CapabilityLifecycleState,
    error?: unknown,
  ): void {
    this.currentStatus = status;
    this.currentLifecycleState = lifecycleState;
    this.currentUpdatedAt = new Date().toISOString();

    this.currentLastError =
      error instanceof Error
        ? error.message
        : error
          ? String(error)
          : undefined;
  }
}