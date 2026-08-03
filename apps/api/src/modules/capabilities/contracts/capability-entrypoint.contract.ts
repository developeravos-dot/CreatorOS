import type {
  CapabilityMetadata,
  CapabilityRuntime,
} from './capability.types';

export interface CapabilityEntrypointContract {
  readonly runtime: CapabilityRuntime;
  readonly module: string;
  readonly exportName?: string;
  readonly bootstrap?: string;
  readonly shutdown?: string;
  readonly metadata?: CapabilityMetadata;
}