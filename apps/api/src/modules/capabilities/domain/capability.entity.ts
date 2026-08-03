import type {
  CapabilityLifecycleState,
  CapabilityManifestContract,
  CapabilityMetadata,
} from '../contracts';
import { CapabilityIdValue } from './capability-id.value-object';
import { CapabilityLifecycleStateMachine } from './capability-lifecycle-state-machine';
import { CapabilityVersionValue } from './capability-version.value-object';

export interface CapabilityEntitySnapshot {
  readonly manifest: CapabilityManifestContract;
  readonly lifecycleState: CapabilityLifecycleState;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata?: CapabilityMetadata;
}

export class CapabilityEntity {
  readonly id: CapabilityIdValue;
  readonly version: CapabilityVersionValue;

  private lifecycleState: CapabilityLifecycleState;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private metadata?: CapabilityMetadata;

  private readonly stateMachine =
    new CapabilityLifecycleStateMachine();

  constructor(
    readonly manifest: CapabilityManifestContract,
    lifecycleState: CapabilityLifecycleState = 'discovered',
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    metadata?: CapabilityMetadata,
  ) {
    this.id = CapabilityIdValue.create(manifest.id);
    this.version = CapabilityVersionValue.create(manifest.version);
    this.lifecycleState = lifecycleState;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.metadata = metadata;
  }

  get state(): CapabilityLifecycleState {
    return this.lifecycleState;
  }

  transitionTo(nextState: CapabilityLifecycleState): void {
    this.stateMachine.assertTransition(
      this.lifecycleState,
      nextState,
    );

    this.lifecycleState = nextState;
    this.updatedAt = new Date();
  }

  updateMetadata(metadata?: CapabilityMetadata): void {
    this.metadata = metadata;
    this.updatedAt = new Date();
  }

  snapshot(): CapabilityEntitySnapshot {
    return {
      manifest: this.manifest,
      lifecycleState: this.lifecycleState,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}