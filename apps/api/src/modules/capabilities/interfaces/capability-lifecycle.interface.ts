import type {
  CapabilityHealthReportContract,
  CapabilityLifecycleState,
} from '../contracts';
import type { CapabilityExecutionContext } from './capability-context.interface';

export interface CapabilityLifecycle {
  readonly state: CapabilityLifecycleState;

  install?(context: CapabilityExecutionContext): Promise<void>;
  initialize(context: CapabilityExecutionContext): Promise<void>;
  activate(context: CapabilityExecutionContext): Promise<void>;
  suspend?(context: CapabilityExecutionContext): Promise<void>;
  resume?(context: CapabilityExecutionContext): Promise<void>;
  stop(context: CapabilityExecutionContext): Promise<void>;
  uninstall?(context: CapabilityExecutionContext): Promise<void>;

  healthCheck?(
    context: CapabilityExecutionContext,
  ): Promise<CapabilityHealthReportContract>;
}