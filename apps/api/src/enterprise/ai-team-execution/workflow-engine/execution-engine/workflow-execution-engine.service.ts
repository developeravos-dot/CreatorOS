import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  WorkflowExecutionRuntime,
  WorkflowStepDispatch,
  WorkflowStepOrchestratorService,
  WorkflowStepRuntime,
} from '../orchestrator';
import {
  WorkflowSchedule,
  WorkflowSchedulerService,
} from '../scheduler';

export interface WorkflowStepHandlerContext {
  executionId: string;
  workflowId: string;
  stepId: string;
  attempt: number;
  input: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface WorkflowStepHandlerResult {
  output?: Record<string, unknown>;
}

export type WorkflowStepHandler = (
  context: WorkflowStepHandlerContext,
) =>
  | Promise<WorkflowStepHandlerResult | void>
  | WorkflowStepHandlerResult
  | void;

export interface WorkflowExecutionEngineRunOptions {
  maxSteps?: number;
  stopOnFailure?: boolean;
}

export interface WorkflowExecutionEngineRunResult {
  execution: WorkflowExecutionRuntime;
  dispatchedStepIds: string[];
  completedStepIds: string[];
  failedStepIds: string[];
  retryScheduleIds: string[];
}

export interface WorkflowScheduledRetryActivationResult {
  schedule: WorkflowSchedule;
  step: WorkflowStepRuntime;
}

interface RegisteredHandler {
  stepId: string;
  handler: WorkflowStepHandler;
}

const DEFAULT_MAX_STEPS_PER_RUN = 1000;

@Injectable()
export class WorkflowExecutionEngineService {
  private readonly handlers =
    new Map<string, WorkflowStepHandler>();

  private readonly runningExecutions = new Set<string>();

  constructor(
    private readonly orchestrator:
      WorkflowStepOrchestratorService,
    private readonly scheduler: WorkflowSchedulerService,
  ) {}

  registerHandler(
    stepId: string,
    handler: WorkflowStepHandler,
  ): void {
    const normalizedStepId = stepId?.trim();

    if (!normalizedStepId) {
      throw new BadRequestException(
        'stepId is required when registering a handler.',
      );
    }

    if (typeof handler !== 'function') {
      throw new BadRequestException(
        `Handler for step ${normalizedStepId} must be a function.`,
      );
    }

    this.handlers.set(normalizedStepId, handler);
  }

  registerHandlers(
    handlers: RegisteredHandler[],
  ): void {
    if (!Array.isArray(handlers)) {
      throw new BadRequestException(
        'handlers must be an array.',
      );
    }

    for (const entry of handlers) {
      this.registerHandler(entry.stepId, entry.handler);
    }
  }

  unregisterHandler(stepId: string): boolean {
    return this.handlers.delete(stepId);
  }

  hasHandler(stepId: string): boolean {
    return this.handlers.has(stepId);
  }

  clearHandlers(): void {
    this.handlers.clear();
  }

  async runExecution(
    executionId: string,
    options: WorkflowExecutionEngineRunOptions = {},
  ): Promise<WorkflowExecutionEngineRunResult> {
    const maxSteps =
      options.maxSteps ?? DEFAULT_MAX_STEPS_PER_RUN;

    if (
      !Number.isSafeInteger(maxSteps) ||
      maxSteps < 1
    ) {
      throw new BadRequestException(
        'maxSteps must be a positive integer.',
      );
    }

    if (this.runningExecutions.has(executionId)) {
      throw new ConflictException(
        `Workflow execution ${executionId} is already running.`,
      );
    }

    this.runningExecutions.add(executionId);

    const dispatchedStepIds: string[] = [];
    const completedStepIds: string[] = [];
    const failedStepIds: string[] = [];
    const retryScheduleIds: string[] = [];

    try {
      let processedSteps = 0;

      while (processedSteps < maxSteps) {
        const execution =
          this.orchestrator.getExecution(executionId);

        if (
          execution.status === 'completed' ||
          execution.status === 'failed' ||
          execution.status === 'cancelled' ||
          execution.status === 'paused'
        ) {
          break;
        }

        const dispatches =
          this.orchestrator.claimReadySteps(executionId);

        if (dispatches.length === 0) {
          break;
        }

        const remainingCapacity =
          maxSteps - processedSteps;

        const selectedDispatches = dispatches.slice(
          0,
          remainingCapacity,
        );

        const outcomes = await Promise.all(
          selectedDispatches.map((dispatch) =>
            this.executeDispatch(dispatch),
          ),
        );

        for (const outcome of outcomes) {
          dispatchedStepIds.push(outcome.stepId);
          processedSteps += 1;

          if (outcome.completed) {
            completedStepIds.push(outcome.stepId);
          }

          if (outcome.failed) {
            failedStepIds.push(outcome.stepId);
          }

          if (outcome.retryScheduleId) {
            retryScheduleIds.push(
              outcome.retryScheduleId,
            );
          }
        }

        if (
          options.stopOnFailure &&
          outcomes.some((outcome) => outcome.failed)
        ) {
          break;
        }
      }

      return {
        execution:
          this.orchestrator.getExecution(executionId),
        dispatchedStepIds,
        completedStepIds,
        failedStepIds,
        retryScheduleIds,
      };
    } finally {
      this.runningExecutions.delete(executionId);
    }
  }

  async runSingleStep(
    executionId: string,
    stepId: string,
  ): Promise<WorkflowExecutionEngineRunResult> {
    if (this.runningExecutions.has(executionId)) {
      throw new ConflictException(
        `Workflow execution ${executionId} is already running.`,
      );
    }

    this.runningExecutions.add(executionId);

    try {
      const step = this.orchestrator.startStep(
        executionId,
        stepId,
      );

      const execution =
        this.orchestrator.getExecution(executionId);

      const outcome = await this.executeDispatch({
        executionId,
        workflowId: execution.workflowId,
        step,
      });

      return {
        execution:
          this.orchestrator.getExecution(executionId),
        dispatchedStepIds: [stepId],
        completedStepIds: outcome.completed
          ? [stepId]
          : [],
        failedStepIds: outcome.failed
          ? [stepId]
          : [],
        retryScheduleIds:
          outcome.retryScheduleId
            ? [outcome.retryScheduleId]
            : [],
      };
    } finally {
      this.runningExecutions.delete(executionId);
    }
  }

  activateDueRetrySchedules(
    at: Date = new Date(),
  ): WorkflowScheduledRetryActivationResult[] {
    const dueSchedules =
      this.scheduler.listDueSchedules(at);

    const activated:
      WorkflowScheduledRetryActivationResult[] = [];

    for (const schedule of dueSchedules) {
      if (
        schedule.kind !== 'retry' ||
        !schedule.executionId
      ) {
        continue;
      }

      const stepId = this.readStringMetadata(
        schedule.metadata,
        'stepId',
      );

      if (!stepId) {
        continue;
      }

      try {
        const step =
          this.orchestrator.activateScheduledRetry(
            schedule.executionId,
            stepId,
            schedule.id,
          );

        activated.push({
          schedule:
            this.scheduler.getSchedule(schedule.id),
          step,
        });
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ConflictException
        ) {
          continue;
        }

        throw error;
      }
    }

    return activated;
  }

  async runDueExecutions(
    at: Date = new Date(),
    options: WorkflowExecutionEngineRunOptions = {},
  ): Promise<WorkflowExecutionEngineRunResult[]> {
    this.activateDueRetrySchedules(at);

    const runnableExecutionIds = new Set<string>();

    for (
      const schedule of this.scheduler.listDueSchedules(at)
    ) {
      if (
        schedule.executionId &&
        schedule.kind !== 'retry'
      ) {
        runnableExecutionIds.add(schedule.executionId);
      }
    }

    for (
      const execution of this.orchestrator.listExecutions()
    ) {
      if (
        execution.status === 'running' &&
        execution.steps.some(
          (step) => step.status === 'ready',
        )
      ) {
        runnableExecutionIds.add(execution.id);
      }
    }

    const results: WorkflowExecutionEngineRunResult[] =
      [];

    for (const executionId of runnableExecutionIds) {
      results.push(
        await this.runExecution(executionId, options),
      );
    }

    return results;
  }

  isExecutionRunning(executionId: string): boolean {
    return this.runningExecutions.has(executionId);
  }

  private async executeDispatch(
    dispatch: WorkflowStepDispatch,
  ): Promise<{
    stepId: string;
    completed: boolean;
    failed: boolean;
    retryScheduleId: string | null;
  }> {
    const handler = this.handlers.get(dispatch.step.id);

    if (!handler) {
      const failure = this.orchestrator.failStep(
        dispatch.executionId,
        dispatch.step.id,
        {
          error: new Error(
            `No handler is registered for workflow step ${dispatch.step.id}.`,
          ),
          code: 'WORKFLOW_STEP_HANDLER_NOT_FOUND',
          retryable: false,
        },
      );

      return {
        stepId: dispatch.step.id,
        completed: false,
        failed: true,
        retryScheduleId:
          failure.retrySchedule?.id ?? null,
      };
    }

    try {
      const result = await handler({
        executionId: dispatch.executionId,
        workflowId: dispatch.workflowId,
        stepId: dispatch.step.id,
        attempt: dispatch.step.attempt,
        input: this.cloneRecord(dispatch.step.input),
        metadata: this.cloneRecord(
          dispatch.step.metadata,
        ),
      });

      const output =
        result &&
        typeof result === 'object' &&
        'output' in result &&
        result.output &&
        typeof result.output === 'object'
          ? result.output
          : {};

      this.orchestrator.completeStep(
        dispatch.executionId,
        dispatch.step.id,
        output,
      );

      return {
        stepId: dispatch.step.id,
        completed: true,
        failed: false,
        retryScheduleId: null,
      };
    } catch (error) {
      const retryable = this.resolveRetryable(error);
      const code = this.resolveErrorCode(error);
      const details = this.resolveErrorDetails(error);

      const failure = this.orchestrator.failStep(
        dispatch.executionId,
        dispatch.step.id,
        {
          error,
          retryable,
          ...(code ? { code } : {}),
          ...(details ? { details } : {}),
        },
      );

      return {
        stepId: dispatch.step.id,
        completed: false,
        failed: true,
        retryScheduleId:
          failure.retrySchedule?.id ?? null,
      };
    }
  }

  private resolveRetryable(error: unknown): boolean {
    if (
      typeof error === 'object' &&
      error !== null &&
      'retryable' in error
    ) {
      return Boolean(
        (error as { retryable?: unknown }).retryable,
      );
    }

    return false;
  }

  private resolveErrorCode(
    error: unknown,
  ): string | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code?: unknown }).code ===
        'string'
    ) {
      return (error as { code: string }).code;
    }

    return undefined;
  }

  private resolveErrorDetails(
    error: unknown,
  ): Record<string, unknown> | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'details' in error
    ) {
      const details = (
        error as { details?: unknown }
      ).details;

      if (
        typeof details === 'object' &&
        details !== null &&
        !Array.isArray(details)
      ) {
        return details as Record<string, unknown>;
      }
    }

    return undefined;
  }

  private readStringMetadata(
    metadata: Record<string, unknown>,
    key: string,
  ): string | null {
    const value = metadata[key];

    return typeof value === 'string' &&
      value.trim().length > 0
      ? value
      : null;
  }

  private cloneRecord(
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    return this.cloneValue(
      source,
      new WeakSet<object>(),
    ) as Record<string, unknown>;
  }

  private cloneValue(
    value: unknown,
    visited: WeakSet<object>,
  ): unknown {
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'object'
    ) {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value);
    }

    if (visited.has(value)) {
      return '[Circular]';
    }

    visited.add(value);

    if (Array.isArray(value)) {
      return value.map((entry) =>
        this.cloneValue(entry, visited),
      );
    }

    const cloned: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      cloned[key] = this.cloneValue(entry, visited);
    }

    return cloned;
  }
}
