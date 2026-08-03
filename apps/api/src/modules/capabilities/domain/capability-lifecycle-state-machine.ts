import type { CapabilityLifecycleState } from '../contracts';
import { InvalidCapabilityStateTransitionError } from './capability-domain.errors';

const ALLOWED_TRANSITIONS: Readonly<
  Record<CapabilityLifecycleState, readonly CapabilityLifecycleState[]>
> = {
  discovered: ['registered', 'failed'],
  registered: ['validated', 'uninstalled', 'failed'],
  validated: ['installed', 'registered', 'failed'],
  installed: ['initialized', 'uninstalled', 'failed'],
  initialized: ['active', 'stopped', 'failed'],
  active: ['suspended', 'stopped', 'failed'],
  suspended: ['active', 'stopped', 'failed'],
  stopped: ['initialized', 'uninstalled', 'failed'],
  failed: ['registered', 'stopped', 'uninstalled'],
  uninstalled: ['discovered'],
};

export class CapabilityLifecycleStateMachine {
  canTransition(
    from: CapabilityLifecycleState,
    to: CapabilityLifecycleState,
  ): boolean {
    return ALLOWED_TRANSITIONS[from].includes(to);
  }

  assertTransition(
    from: CapabilityLifecycleState,
    to: CapabilityLifecycleState,
  ): void {
    if (!this.canTransition(from, to)) {
      throw new InvalidCapabilityStateTransitionError(from, to);
    }
  }

  allowedTransitions(
    state: CapabilityLifecycleState,
  ): readonly CapabilityLifecycleState[] {
    return ALLOWED_TRANSITIONS[state];
  }
}