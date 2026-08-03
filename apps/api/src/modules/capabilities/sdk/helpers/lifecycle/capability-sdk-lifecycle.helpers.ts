import type {
  CapabilityLifecycleState,
} from '../../../contracts';
import {
  CapabilityLifecycleStateMachine,
} from '../../../domain';

export interface CapabilitySdkLifecyclePlanStep {
  readonly sequence: number;
  readonly from:
    CapabilityLifecycleState;
  readonly to:
    CapabilityLifecycleState;
}

export interface CapabilitySdkLifecyclePlan {
  readonly initialState:
    CapabilityLifecycleState;
  readonly targetState:
    CapabilityLifecycleState;
  readonly executable: boolean;
  readonly steps:
    readonly CapabilitySdkLifecyclePlanStep[];
}

const lifecycleStateMachine =
  new CapabilityLifecycleStateMachine();

export const canTransitionSdkLifecycle = (
  from: CapabilityLifecycleState,
  to: CapabilityLifecycleState,
): boolean =>
  lifecycleStateMachine.canTransition(
    from,
    to,
  );

export const assertSdkLifecycleTransition = (
  from: CapabilityLifecycleState,
  to: CapabilityLifecycleState,
): void => {
  lifecycleStateMachine.assertTransition(
    from,
    to,
  );
};

export const getSdkAllowedTransitions = (
  state: CapabilityLifecycleState,
): readonly CapabilityLifecycleState[] =>
  lifecycleStateMachine.allowedTransitions(
    state,
  );

export const assertSdkLifecycleSequence = (
  states:
    readonly CapabilityLifecycleState[],
): void => {
  for (
    let index = 0;
    index < states.length - 1;
    index += 1
  ) {
    const from = states[index];
    const to = states[index + 1];

    if (!from || !to) {
      continue;
    }

    assertSdkLifecycleTransition(
      from,
      to,
    );
  }
};

export const createSdkLifecyclePlan = (
  states:
    readonly CapabilityLifecycleState[],
): CapabilitySdkLifecyclePlan => {
  if (states.length === 0) {
    throw new Error(
      'A lifecycle plan requires at least one state.',
    );
  }

  const initialState = states[0];
  const targetState =
    states[states.length - 1];

  if (!initialState || !targetState) {
    throw new Error(
      'Lifecycle plan states are invalid.',
    );
  }

  const steps:
    CapabilitySdkLifecyclePlanStep[] = [];

  let executable = true;

  for (
    let index = 0;
    index < states.length - 1;
    index += 1
  ) {
    const from = states[index];
    const to = states[index + 1];

    if (!from || !to) {
      continue;
    }

    if (
      !canTransitionSdkLifecycle(
        from,
        to,
      )
    ) {
      executable = false;
    }

    steps.push(
      Object.freeze({
        sequence: steps.length + 1,
        from,
        to,
      }),
    );
  }

  return Object.freeze({
    initialState,
    targetState,
    executable,
    steps: Object.freeze(steps),
  });
};

export const createSdkActivationLifecyclePlan =
  (): CapabilitySdkLifecyclePlan =>
    createSdkLifecyclePlan([
      'discovered',
      'registered',
      'validated',
      'installed',
      'initialized',
      'active',
    ]);

export const createSdkShutdownLifecyclePlan =
  (): CapabilitySdkLifecyclePlan =>
    createSdkLifecyclePlan([
      'active',
      'stopped',
      'uninstalled',
    ]);