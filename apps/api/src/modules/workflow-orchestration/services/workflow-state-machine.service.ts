import {
  Injectable,
} from '@nestjs/common';

import type {
  WorkflowExecutionState,
  WorkflowState,
  WorkflowStepState,
} from '../models';

export interface WorkflowStateTransitionDecision<
  TState extends string,
> {
  readonly allowed: boolean;
  readonly from: TState;
  readonly to: TState;
  readonly reason: string;
}

const WORKFLOW_STATE_TRANSITIONS:
  Readonly<
    Record<
      WorkflowState,
      readonly WorkflowState[]
    >
  > = {
    draft: [
      'published',
      'archived',
    ],
    published: [
      'active',
      'paused',
      'archived',
      'deprecated',
    ],
    active: [
      'paused',
      'archived',
      'deprecated',
    ],
    paused: [
      'active',
      'archived',
      'deprecated',
    ],
    archived: [],
    deprecated: [
      'archived',
    ],
  };

const WORKFLOW_EXECUTION_TRANSITIONS:
  Readonly<
    Record<
      WorkflowExecutionState,
      readonly WorkflowExecutionState[]
    >
  > = {
    pending: [
      'queued',
      'running',
      'cancelled',
    ],
    queued: [
      'running',
      'paused',
      'cancelled',
      'timed_out',
    ],
    running: [
      'waiting',
      'paused',
      'completed',
      'failed',
      'cancelled',
      'timed_out',
      'compensating',
    ],
    waiting: [
      'running',
      'paused',
      'failed',
      'cancelled',
      'timed_out',
      'compensating',
    ],
    paused: [
      'queued',
      'running',
      'cancelled',
      'compensating',
    ],
    completed: [],
    failed: [
      'queued',
      'running',
      'compensating',
    ],
    cancelled: [
      'compensating',
    ],
    timed_out: [
      'queued',
      'running',
      'compensating',
    ],
    compensating: [
      'compensated',
      'failed',
    ],
    compensated: [],
  };

const WORKFLOW_STEP_TRANSITIONS:
  Readonly<
    Record<
      WorkflowStepState,
      readonly WorkflowStepState[]
    >
  > = {
    pending: [
      'ready',
      'skipped',
      'cancelled',
    ],
    ready: [
      'queued',
      'running',
      'skipped',
      'cancelled',
    ],
    queued: [
      'running',
      'waiting',
      'cancelled',
      'timed_out',
    ],
    running: [
      'waiting',
      'completed',
      'failed',
      'cancelled',
      'timed_out',
      'compensating',
    ],
    waiting: [
      'ready',
      'queued',
      'running',
      'failed',
      'skipped',
      'cancelled',
      'timed_out',
    ],
    completed: [
      'compensating',
    ],
    failed: [
      'ready',
      'queued',
      'running',
      'skipped',
      'compensating',
    ],
    skipped: [],
    cancelled: [
      'compensating',
    ],
    timed_out: [
      'ready',
      'queued',
      'running',
      'skipped',
      'compensating',
    ],
    compensating: [
      'compensated',
      'failed',
    ],
    compensated: [],
  };

const TERMINAL_WORKFLOW_STATES:
  readonly WorkflowState[] = [
    'archived',
  ];

const TERMINAL_EXECUTION_STATES:
  readonly WorkflowExecutionState[] = [
    'completed',
    'compensated',
  ];

const TERMINAL_STEP_STATES:
  readonly WorkflowStepState[] = [
    'skipped',
    'compensated',
  ];

@Injectable()
export class WorkflowStateMachineService {
  getAllowedWorkflowTransitions(
    state:
      WorkflowState,
  ): readonly WorkflowState[] {
    return [
      ...WORKFLOW_STATE_TRANSITIONS[
        state
      ],
    ];
  }

  getAllowedExecutionTransitions(
    state:
      WorkflowExecutionState,
  ): readonly WorkflowExecutionState[] {
    return [
      ...WORKFLOW_EXECUTION_TRANSITIONS[
        state
      ],
    ];
  }

  getAllowedStepTransitions(
    state:
      WorkflowStepState,
  ): readonly WorkflowStepState[] {
    return [
      ...WORKFLOW_STEP_TRANSITIONS[
        state
      ],
    ];
  }

  canTransitionWorkflow(
    from:
      WorkflowState,
    to:
      WorkflowState,
  ): boolean {
    return (
      from !== to &&
      WORKFLOW_STATE_TRANSITIONS[
        from
      ].includes(to)
    );
  }

  canTransitionExecution(
    from:
      WorkflowExecutionState,
    to:
      WorkflowExecutionState,
  ): boolean {
    return (
      from !== to &&
      WORKFLOW_EXECUTION_TRANSITIONS[
        from
      ].includes(to)
    );
  }

  canTransitionStep(
    from:
      WorkflowStepState,
    to:
      WorkflowStepState,
  ): boolean {
    return (
      from !== to &&
      WORKFLOW_STEP_TRANSITIONS[
        from
      ].includes(to)
    );
  }

  evaluateWorkflowTransition(
    from:
      WorkflowState,
    to:
      WorkflowState,
  ):
    WorkflowStateTransitionDecision<
      WorkflowState
    > {
    return this.evaluate(
      from,
      to,
      this.canTransitionWorkflow(
        from,
        to,
      ),
      this.isTerminalWorkflowState(
        from,
      ),
      'workflow',
    );
  }

  evaluateExecutionTransition(
    from:
      WorkflowExecutionState,
    to:
      WorkflowExecutionState,
  ):
    WorkflowStateTransitionDecision<
      WorkflowExecutionState
    > {
    return this.evaluate(
      from,
      to,
      this.canTransitionExecution(
        from,
        to,
      ),
      this.isTerminalExecutionState(
        from,
      ),
      'workflow execution',
    );
  }

  evaluateStepTransition(
    from:
      WorkflowStepState,
    to:
      WorkflowStepState,
  ):
    WorkflowStateTransitionDecision<
      WorkflowStepState
    > {
    return this.evaluate(
      from,
      to,
      this.canTransitionStep(
        from,
        to,
      ),
      this.isTerminalStepState(
        from,
      ),
      'workflow step',
    );
  }

  assertWorkflowTransition(
    from:
      WorkflowState,
    to:
      WorkflowState,
  ): void {
    this.assertDecision(
      this.evaluateWorkflowTransition(
        from,
        to,
      ),
    );
  }

  assertExecutionTransition(
    from:
      WorkflowExecutionState,
    to:
      WorkflowExecutionState,
  ): void {
    this.assertDecision(
      this.evaluateExecutionTransition(
        from,
        to,
      ),
    );
  }

  assertStepTransition(
    from:
      WorkflowStepState,
    to:
      WorkflowStepState,
  ): void {
    this.assertDecision(
      this.evaluateStepTransition(
        from,
        to,
      ),
    );
  }

  canPublish(
    state:
      WorkflowState,
  ): boolean {
    return this.canTransitionWorkflow(
      state,
      'published',
    );
  }

  canActivate(
    state:
      WorkflowState,
  ): boolean {
    return this.canTransitionWorkflow(
      state,
      'active',
    );
  }

  canPauseWorkflow(
    state:
      WorkflowState,
  ): boolean {
    return this.canTransitionWorkflow(
      state,
      'paused',
    );
  }

  canResumeWorkflow(
    state:
      WorkflowState,
  ): boolean {
    return (
      state === 'paused' &&
      this.canTransitionWorkflow(
        state,
        'active',
      )
    );
  }

  canArchive(
    state:
      WorkflowState,
  ): boolean {
    return this.canTransitionWorkflow(
      state,
      'archived',
    );
  }

  canStartExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return (
      state === 'pending' ||
      state === 'queued'
    );
  }

  canPauseExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return this.canTransitionExecution(
      state,
      'paused',
    );
  }

  canResumeExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return (
      state === 'paused' &&
      (
        this.canTransitionExecution(
          state,
          'queued',
        ) ||
        this.canTransitionExecution(
          state,
          'running',
        )
      )
    );
  }

  canCompleteExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return this.canTransitionExecution(
      state,
      'completed',
    );
  }

  canFailExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return this.canTransitionExecution(
      state,
      'failed',
    );
  }

  canCancelExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return this.canTransitionExecution(
      state,
      'cancelled',
    );
  }

  canRetryExecution(
    state:
      WorkflowExecutionState,
  ): boolean {
    return (
      state === 'failed' ||
      state === 'timed_out'
    );
  }

  canQueueStep(
    state:
      WorkflowStepState,
  ): boolean {
    return (
      state === 'ready' ||
      state === 'waiting' ||
      state === 'failed' ||
      state === 'timed_out'
    );
  }

  canStartStep(
    state:
      WorkflowStepState,
  ): boolean {
    return (
      state === 'ready' ||
      state === 'queued' ||
      state === 'waiting' ||
      state === 'failed' ||
      state === 'timed_out'
    );
  }

  canCompleteStep(
    state:
      WorkflowStepState,
  ): boolean {
    return state === 'running';
  }

  canFailStep(
    state:
      WorkflowStepState,
  ): boolean {
    return (
      state === 'running' ||
      state === 'waiting' ||
      state === 'compensating'
    );
  }

  canSkipStep(
    state:
      WorkflowStepState,
  ): boolean {
    return (
      state === 'pending' ||
      state === 'ready' ||
      state === 'waiting' ||
      state === 'failed' ||
      state === 'timed_out'
    );
  }

  canRetryStep(
    state:
      WorkflowStepState,
  ): boolean {
    return (
      state === 'failed' ||
      state === 'timed_out'
    );
  }

  isTerminalWorkflowState(
    state:
      WorkflowState,
  ): boolean {
    return TERMINAL_WORKFLOW_STATES
      .includes(state);
  }

  isTerminalExecutionState(
    state:
      WorkflowExecutionState,
  ): boolean {
    return TERMINAL_EXECUTION_STATES
      .includes(state);
  }

  isTerminalStepState(
    state:
      WorkflowStepState,
  ): boolean {
    return TERMINAL_STEP_STATES
      .includes(state);
  }

  private evaluate<
    TState extends string,
  >(
    from: TState,
    to: TState,
    allowed: boolean,
    terminal: boolean,
    subject: string,
  ):
    WorkflowStateTransitionDecision<
      TState
    > {
    if (from === to) {
      return {
        allowed: false,
        from,
        to,
        reason:
          `${subject} is already in state ${from}.`,
      };
    }

    if (terminal) {
      return {
        allowed: false,
        from,
        to,
        reason:
          `Terminal ${subject} state ${from} cannot transition to ${to}.`,
      };
    }

    if (allowed) {
      return {
        allowed: true,
        from,
        to,
        reason:
          `Transition from ${from} to ${to} is allowed.`,
      };
    }

    return {
      allowed: false,
      from,
      to,
      reason:
        `Transition from ${from} to ${to} is not allowed.`,
    };
  }

  private assertDecision<
    TState extends string,
  >(
    decision:
      WorkflowStateTransitionDecision<
        TState
      >,
  ): void {
    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }
  }
}