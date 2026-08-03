import {
  Injectable,
} from '@nestjs/common';

import {
  isTerminalJobState,
  type JobState,
} from '../models';

export interface JobStateTransitionDecision {
  readonly allowed: boolean;
  readonly from: JobState;
  readonly to: JobState;
  readonly reason: string;
}

const JOB_STATE_TRANSITIONS:
  Readonly<
    Record<
      JobState,
      readonly JobState[]
    >
  > = {
    draft: [
      'scheduled',
      'queued',
      'delayed',
      'cancelled',
    ],
    scheduled: [
      'queued',
      'delayed',
      'paused',
      'cancelled',
      'expired',
    ],
    queued: [
      'waiting',
      'delayed',
      'running',
      'paused',
      'cancelled',
      'expired',
    ],
    waiting: [
      'queued',
      'delayed',
      'running',
      'paused',
      'cancelled',
      'expired',
    ],
    delayed: [
      'queued',
      'running',
      'paused',
      'cancelled',
      'expired',
    ],
    running: [
      'completed',
      'failed',
      'retry_scheduled',
      'paused',
      'cancelled',
      'dead_lettered',
      'expired',
    ],
    retry_scheduled: [
      'queued',
      'delayed',
      'running',
      'cancelled',
      'dead_lettered',
      'expired',
    ],
    paused: [
      'scheduled',
      'queued',
      'waiting',
      'delayed',
      'cancelled',
      'expired',
    ],
    completed: [],
    failed: [
      'retry_scheduled',
      'queued',
      'dead_lettered',
    ],
    cancelled: [],
    dead_lettered: [],
    expired: [],
  };

@Injectable()
export class JobStateMachineService {
  getAllowedTransitions(
    state: JobState,
  ): readonly JobState[] {
    return [
      ...JOB_STATE_TRANSITIONS[
        state
      ],
    ];
  }

  canTransition(
    from: JobState,
    to: JobState,
  ): boolean {
    if (from === to) {
      return false;
    }

    return JOB_STATE_TRANSITIONS[
      from
    ].includes(to);
  }

  evaluateTransition(
    from: JobState,
    to: JobState,
  ): JobStateTransitionDecision {
    if (from === to) {
      return {
        allowed: false,
        from,
        to,
        reason:
          `Job is already in state ${from}.`,
      };
    }

    if (
      isTerminalJobState(from)
    ) {
      return {
        allowed: false,
        from,
        to,
        reason:
          `Terminal job state ${from} cannot transition to ${to}.`,
      };
    }

    if (
      this.canTransition(
        from,
        to,
      )
    ) {
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

  assertTransition(
    from: JobState,
    to: JobState,
  ): void {
    const decision =
      this.evaluateTransition(
        from,
        to,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }
  }

  canPause(
    state: JobState,
  ): boolean {
    return this.canTransition(
      state,
      'paused',
    );
  }

  canResume(
    state: JobState,
  ): boolean {
    return (
      state === 'paused' &&
      this.getAllowedTransitions(
        state,
      ).some(
        (target) =>
          target ===
            'scheduled' ||
          target ===
            'queued' ||
          target ===
            'waiting' ||
          target ===
            'delayed',
      )
    );
  }

  canCancel(
    state: JobState,
  ): boolean {
    return this.canTransition(
      state,
      'cancelled',
    );
  }

  canRetry(
    state: JobState,
  ): boolean {
    return (
      state === 'failed' ||
      state ===
        'retry_scheduled'
    );
  }

  canStart(
    state: JobState,
  ): boolean {
    return (
      state === 'queued' ||
      state === 'waiting' ||
      state === 'delayed' ||
      state ===
        'retry_scheduled'
    );
  }

  canComplete(
    state: JobState,
  ): boolean {
    return (
      state === 'running'
    );
  }

  canFail(
    state: JobState,
  ): boolean {
    return (
      state === 'running'
    );
  }

  resolveResumeTarget(
    previousState?:
      JobState,
  ): JobState {
    if (
      previousState ===
        'scheduled' ||
      previousState ===
        'waiting' ||
      previousState ===
        'delayed'
    ) {
      return previousState;
    }

    return 'queued';
  }

  isTerminal(
    state: JobState,
  ): boolean {
    return isTerminalJobState(
      state,
    );
  }
}