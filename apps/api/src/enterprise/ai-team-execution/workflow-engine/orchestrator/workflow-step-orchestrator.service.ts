import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  Optional,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WorkflowExecutionPersistenceEngineService } from '../persistence/execution-persistence';
import {
  WorkflowSchedule,
  WorkflowSchedulerService,
} from '../scheduler';

export type WorkflowStepExecutionStatus =
  | 'waiting'
  | 'ready'
  | 'active'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled';

export type WorkflowExecutionStatus =
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface WorkflowStepDefinition {
  id: string;
  name?: string;
  dependsOn?: string[];
  maxAttempts?: number;
  retryDelayMs?: number;
  continueOnFailure?: boolean;
  input?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface WorkflowStepRuntime {
  id: string;
  name: string;
  status: WorkflowStepExecutionStatus;
  dependsOn: string[];
  attempt: number;
  maxAttempts: number;
  retryDelayMs: number;
  continueOnFailure: boolean;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  error: WorkflowStepError | null;
  scheduledRetryId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStepError {
  name: string;
  message: string;
  code?: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export interface WorkflowExecutionRuntime {
  id: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  steps: WorkflowStepRuntime[];
  maxParallelSteps: number;
  activeStepIds: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface CreateWorkflowExecutionRequest {
  executionId?: string;
  workflowId: string;
  steps: WorkflowStepDefinition[];
  maxParallelSteps?: number;
}

export interface FailWorkflowStepRequest {
  error: unknown;
  retryable?: boolean;
  code?: string;
  details?: Record<string, unknown>;
}

export interface WorkflowStepDispatch {
  executionId: string;
  workflowId: string;
  step: WorkflowStepRuntime;
}

export interface WorkflowStepTransitionResult {
  execution: WorkflowExecutionRuntime;
  step: WorkflowStepRuntime;
  retrySchedule: WorkflowSchedule | null;
}

const SECRET_MASK = '[REDACTED]';

const EXACT_SECRET_KEYS = new Set<string>([
  'secret',
  'password',
  'token',
  'authorization',
  'apikey',
  'privatekey',
  'cookie',
  'credential',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'bearertoken',
  'clientsecret',
  'clientpassword',
]);

const SECRET_CONTAINER_KEYS = new Set<string>([
  'secrets',
  'passwords',
  'tokens',
  'authorizations',
  'apikeys',
  'privatekeys',
  'cookies',
  'credentials',
]);

@Injectable()
export class WorkflowStepOrchestratorService {
  private readonly logger = new Logger(WorkflowStepOrchestratorService.name);

  private readonly executions =
    new Map<string, WorkflowExecutionRuntime>();

  constructor(
    private readonly scheduler: WorkflowSchedulerService,
    @Optional()
    private readonly persistenceEngine?: WorkflowExecutionPersistenceEngineService,
  ) {}

  createExecution(
    request: CreateWorkflowExecutionRequest,
  ): WorkflowExecutionRuntime {
    this.validateCreateRequest(request);

    const executionId = request.executionId?.trim() || randomUUID();

    if (this.executions.has(executionId)) {
      throw new ConflictException(
        `Workflow execution ${executionId} already exists.`,
      );
    }

    const now = this.now();
    const definitions = this.cloneDefinitions(request.steps);

    this.validateStepGraph(definitions);

    const steps = definitions.map((definition) =>
      this.createStepRuntime(definition, now),
    );

    const execution: WorkflowExecutionRuntime = {
      id: executionId,
      workflowId: request.workflowId.trim(),
      status: 'pending',
      steps,
      maxParallelSteps: request.maxParallelSteps ?? 1,
      activeStepIds: [],
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };

    this.refreshReadySteps(execution);
    this.refreshExecutionStatus(execution);

    this.executions.set(
      execution.id,
      this.cloneExecution(execution),
    );

    return this.getExecution(execution.id);
  }

  getExecution(executionId: string): WorkflowExecutionRuntime {
    return this.cloneExecution(
      this.getMutableExecution(executionId),
    );
  }

  listExecutions(
    workflowId?: string,
  ): WorkflowExecutionRuntime[] {
    return [...this.executions.values()]
      .filter(
        (execution) =>
          !workflowId || execution.workflowId === workflowId,
      )
      .sort(
        (left, right) =>
          left.createdAt.getTime() - right.createdAt.getTime(),
      )
      .map((execution) => this.cloneExecution(execution));
  }

  listReadySteps(
    executionId: string,
  ): WorkflowStepRuntime[] {
    const execution = this.getMutableExecution(executionId);

    this.refreshReadySteps(execution);
    this.persist(execution);

    return execution.steps
      .filter((step) => step.status === 'ready')
      .map((step) => this.cloneStep(step));
  }

  claimReadySteps(
    executionId: string,
    limit?: number,
  ): WorkflowStepDispatch[] {
    const execution = this.getMutableExecution(executionId);

    this.assertExecutionRunnable(execution);
    this.refreshReadySteps(execution);

    const availableSlots =
      execution.maxParallelSteps -
      execution.activeStepIds.length;

    const requestedLimit =
      limit === undefined
        ? availableSlots
        : Math.min(limit, availableSlots);

    if (
      !Number.isSafeInteger(requestedLimit) ||
      requestedLimit < 0
    ) {
      throw new BadRequestException(
        'Step claim limit must be a non-negative integer.',
      );
    }

    const candidates = execution.steps
      .filter((step) => step.status === 'ready')
      .slice(0, requestedLimit);

    const now = this.now();

    for (const step of candidates) {
      step.status = 'active';
      step.attempt += 1;
      step.startedAt = now;
      step.completedAt = null;
      step.error = null;
      step.scheduledRetryId = null;
      step.updatedAt = now;

      if (!execution.activeStepIds.includes(step.id)) {
        execution.activeStepIds.push(step.id);
      }
    }

    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return candidates.map((step) => ({
      executionId: execution.id,
      workflowId: execution.workflowId,
      step: this.cloneStep(step),
    }));
  }

  startStep(
    executionId: string,
    stepId: string,
  ): WorkflowStepRuntime {
    const dispatches = this.claimSpecificStep(
      executionId,
      stepId,
    );

    return dispatches.step;
  }

  completeStep(
    executionId: string,
    stepId: string,
    output: Record<string, unknown> = {},
  ): WorkflowStepTransitionResult {
    const execution = this.getMutableExecution(executionId);
    const step = this.getMutableStep(execution, stepId);

    if (step.status !== 'active') {
      throw new ConflictException(
        `Workflow step ${stepId} must be active before completion.`,
      );
    }

    const now = this.now();

    step.status = 'completed';
    step.output = this.sanitizeRecord(output);
    step.error = null;
    step.scheduledRetryId = null;
    step.completedAt = now;
    step.updatedAt = now;

    this.removeActiveStep(execution, step.id);
    this.refreshReadySteps(execution);
    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return {
      execution: this.cloneExecution(execution),
      step: this.cloneStep(step),
      retrySchedule: null,
    };
  }

  failStep(
    executionId: string,
    stepId: string,
    request: FailWorkflowStepRequest,
  ): WorkflowStepTransitionResult {
    const execution = this.getMutableExecution(executionId);
    const step = this.getMutableStep(execution, stepId);

    if (step.status !== 'active') {
      throw new ConflictException(
        `Workflow step ${stepId} must be active before failure.`,
      );
    }

    const now = this.now();
    const normalizedError = this.normalizeError(request);
    const canRetry =
      normalizedError.retryable &&
      step.attempt < step.maxAttempts;

    this.removeActiveStep(execution, step.id);

    let retrySchedule: WorkflowSchedule | null = null;

    if (canRetry) {
      retrySchedule = this.scheduler.scheduleRetry({
        workflowId: execution.workflowId,
        executionId: execution.id,
        retryAttempt: step.attempt + 1,
        retryDelayMs: step.retryDelayMs,
        retryReason: normalizedError.message,
        metadata: {
          executionId: execution.id,
          stepId: step.id,
          error: normalizedError,
        },
      });

      step.status = 'waiting';
      step.error = normalizedError;
      step.scheduledRetryId = retrySchedule.id;
      step.startedAt = null;
      step.completedAt = null;
      step.updatedAt = now;
    } else {
      step.status = 'failed';
      step.error = normalizedError;
      step.scheduledRetryId = null;
      step.completedAt = now;
      step.updatedAt = now;

      this.resolveFailureImpact(execution, step);
    }

    this.refreshReadySteps(execution);
    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return {
      execution: this.cloneExecution(execution),
      step: this.cloneStep(step),
      retrySchedule,
    };
  }

  activateScheduledRetry(
    executionId: string,
    stepId: string,
    scheduleId: string,
  ): WorkflowStepRuntime {
    const execution = this.getMutableExecution(executionId);
    const step = this.getMutableStep(execution, stepId);

    if (step.status !== 'waiting') {
      throw new ConflictException(
        `Workflow step ${stepId} is not waiting for retry.`,
      );
    }

    if (step.scheduledRetryId !== scheduleId) {
      throw new ConflictException(
        `Retry schedule ${scheduleId} does not belong to step ${stepId}.`,
      );
    }

    const schedule = this.scheduler.getSchedule(scheduleId);

    if (schedule.status === 'cancelled') {
      throw new ConflictException(
        `Retry schedule ${scheduleId} is cancelled.`,
      );
    }

    if (
      schedule.nextRunAt &&
      schedule.nextRunAt.getTime() > this.now().getTime()
    ) {
      throw new ConflictException(
        `Retry schedule ${scheduleId} is not due yet.`,
      );
    }

    if (schedule.status === 'scheduled') {
      this.scheduler.markRunStarted(scheduleId);
    }

    step.status = this.areDependenciesSatisfied(
      execution,
      step,
    )
      ? 'ready'
      : 'waiting';

    step.scheduledRetryId = null;
    step.startedAt = null;
    step.completedAt = null;
    step.updatedAt = this.now();

    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return this.cloneStep(step);
  }

  skipStep(
    executionId: string,
    stepId: string,
    reason = 'Step skipped by orchestration decision.',
  ): WorkflowStepRuntime {
    const execution = this.getMutableExecution(executionId);
    const step = this.getMutableStep(execution, stepId);

    if (
      step.status === 'completed' ||
      step.status === 'cancelled'
    ) {
      throw new ConflictException(
        `Workflow step ${stepId} cannot be skipped from status ${step.status}.`,
      );
    }

    if (step.scheduledRetryId) {
      this.cancelRetrySchedule(step.scheduledRetryId);
    }

    const now = this.now();

    step.status = 'skipped';
    step.error = {
      name: 'WorkflowStepSkipped',
      message: reason,
      retryable: false,
    };
    step.scheduledRetryId = null;
    step.completedAt = now;
    step.updatedAt = now;

    this.removeActiveStep(execution, step.id);
    this.refreshReadySteps(execution);
    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return this.cloneStep(step);
  }

  pauseExecution(
    executionId: string,
  ): WorkflowExecutionRuntime {
    const execution = this.getMutableExecution(executionId);

    if (
      execution.status === 'completed' ||
      execution.status === 'failed' ||
      execution.status === 'cancelled'
    ) {
      throw new ConflictException(
        `Workflow execution ${executionId} cannot be paused from status ${execution.status}.`,
      );
    }

    execution.status = 'paused';
    execution.updatedAt = this.now();

    this.persist(execution);

    return this.cloneExecution(execution);
  }

  resumeExecution(
    executionId: string,
  ): WorkflowExecutionRuntime {
    const execution = this.getMutableExecution(executionId);

    if (execution.status !== 'paused') {
      throw new ConflictException(
        `Workflow execution ${executionId} is not paused.`,
      );
    }

    execution.status = 'running';
    execution.updatedAt = this.now();

    this.refreshReadySteps(execution);
    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return this.cloneExecution(execution);
  }

  cancelExecution(
    executionId: string,
  ): WorkflowExecutionRuntime {
    const execution = this.getMutableExecution(executionId);

    if (execution.status === 'completed') {
      throw new ConflictException(
        `Completed execution ${executionId} cannot be cancelled.`,
      );
    }

    if (execution.status === 'cancelled') {
      return this.cloneExecution(execution);
    }

    const now = this.now();

    for (const step of execution.steps) {
      if (
        step.status === 'completed' ||
        step.status === 'failed' ||
        step.status === 'skipped'
      ) {
        continue;
      }

      if (step.scheduledRetryId) {
        this.cancelRetrySchedule(step.scheduledRetryId);
      }

      step.status = 'cancelled';
      step.scheduledRetryId = null;
      step.completedAt = now;
      step.updatedAt = now;
    }

    execution.status = 'cancelled';
    execution.activeStepIds = [];
    execution.completedAt = now;
    execution.updatedAt = now;

    this.persist(execution);

    return this.cloneExecution(execution);
  }

  restoreExecutionRuntime(
    execution: WorkflowExecutionRuntime,
  ): WorkflowExecutionRuntime {
    if (!execution.id?.trim()) {
      throw new BadRequestException('Recovered execution id is required.');
    }

    const restored = this.cloneExecution(execution);
    this.executions.set(restored.id, restored);

    return this.cloneExecution(restored);
  }

  removeExecution(executionId: string): boolean {
    return this.executions.delete(executionId);
  }

  clear(): void {
    this.executions.clear();
  }

  private claimSpecificStep(
    executionId: string,
    stepId: string,
  ): WorkflowStepDispatch {
    const execution = this.getMutableExecution(executionId);

    this.assertExecutionRunnable(execution);
    this.refreshReadySteps(execution);

    const step = this.getMutableStep(execution, stepId);

    if (step.status !== 'ready') {
      throw new ConflictException(
        `Workflow step ${stepId} is not ready.`,
      );
    }

    if (
      execution.activeStepIds.length >=
      execution.maxParallelSteps
    ) {
      throw new ConflictException(
        `Workflow execution ${executionId} has reached its parallel step limit.`,
      );
    }

    const now = this.now();

    step.status = 'active';
    step.attempt += 1;
    step.startedAt = now;
    step.completedAt = null;
    step.error = null;
    step.scheduledRetryId = null;
    step.updatedAt = now;

    execution.activeStepIds.push(step.id);

    this.refreshExecutionStatus(execution);
    this.persist(execution);

    return {
      executionId: execution.id,
      workflowId: execution.workflowId,
      step: this.cloneStep(step),
    };
  }

  private refreshReadySteps(
    execution: WorkflowExecutionRuntime,
  ): void {
    if (
      execution.status === 'paused' ||
      execution.status === 'cancelled' ||
      execution.status === 'completed' ||
      execution.status === 'failed'
    ) {
      return;
    }

    const now = this.now();

    for (const step of execution.steps) {
      if (
        step.status !== 'waiting' ||
        step.scheduledRetryId !== null
      ) {
        continue;
      }

      if (this.hasFailedBlockingDependency(execution, step)) {
        step.status = 'skipped';
        step.error = {
          name: 'WorkflowDependencyFailure',
          message:
            'Step skipped because a required dependency failed.',
          retryable: false,
        };
        step.completedAt = now;
        step.updatedAt = now;
        continue;
      }

      if (this.areDependenciesSatisfied(execution, step)) {
        step.status = 'ready';
        step.updatedAt = now;
      }
    }
  }

  private resolveFailureImpact(
    execution: WorkflowExecutionRuntime,
    failedStep: WorkflowStepRuntime,
  ): void {
    if (failedStep.continueOnFailure) {
      return;
    }

    const now = this.now();
    const queue = [failedStep.id];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId || visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      for (const dependent of execution.steps) {
        if (!dependent.dependsOn.includes(currentId)) {
          continue;
        }

        if (
          dependent.status === 'completed' ||
          dependent.status === 'failed' ||
          dependent.status === 'skipped' ||
          dependent.status === 'cancelled'
        ) {
          continue;
        }

        if (dependent.scheduledRetryId) {
          this.cancelRetrySchedule(
            dependent.scheduledRetryId,
          );
        }

        dependent.status = 'skipped';
        dependent.error = {
          name: 'WorkflowDependencyFailure',
          message:
            `Step ${dependent.id} skipped because dependency ${currentId} failed.`,
          retryable: false,
        };
        dependent.scheduledRetryId = null;
        dependent.completedAt = now;
        dependent.updatedAt = now;

        this.removeActiveStep(execution, dependent.id);
        queue.push(dependent.id);
      }
    }
  }

  private refreshExecutionStatus(
    execution: WorkflowExecutionRuntime,
  ): void {
    if (
      execution.status === 'paused' ||
      execution.status === 'cancelled'
    ) {
      return;
    }

    const terminalStatuses =
      new Set<WorkflowStepExecutionStatus>([
        'completed',
        'failed',
        'skipped',
        'cancelled',
      ]);

    const allTerminal = execution.steps.every((step) =>
      terminalStatuses.has(step.status),
    );

    if (allTerminal) {
      const blockingFailure = execution.steps.some(
        (step) =>
          step.status === 'failed' &&
          !step.continueOnFailure,
      );

      execution.status = blockingFailure
        ? 'failed'
        : 'completed';

      execution.completedAt = this.now();
      execution.activeStepIds = [];
      execution.updatedAt = this.now();

      return;
    }

    execution.status = 'running';
    execution.completedAt = null;
    execution.updatedAt = this.now();
  }

  private areDependenciesSatisfied(
    execution: WorkflowExecutionRuntime,
    step: WorkflowStepRuntime,
  ): boolean {
    return step.dependsOn.every((dependencyId) => {
      const dependency = execution.steps.find(
        (candidate) => candidate.id === dependencyId,
      );

      if (!dependency) {
        return false;
      }

      if (dependency.status === 'completed') {
        return true;
      }

      return (
        dependency.status === 'failed' &&
        dependency.continueOnFailure
      );
    });
  }

  private hasFailedBlockingDependency(
    execution: WorkflowExecutionRuntime,
    step: WorkflowStepRuntime,
  ): boolean {
    return step.dependsOn.some((dependencyId) => {
      const dependency = execution.steps.find(
        (candidate) => candidate.id === dependencyId,
      );

      return (
        dependency?.status === 'failed' &&
        !dependency.continueOnFailure
      );
    });
  }

  private validateCreateRequest(
    request: CreateWorkflowExecutionRequest,
  ): void {
    if (
      typeof request.workflowId !== 'string' ||
      request.workflowId.trim().length === 0
    ) {
      throw new BadRequestException(
        'workflowId is required.',
      );
    }

    if (
      !Array.isArray(request.steps) ||
      request.steps.length === 0
    ) {
      throw new BadRequestException(
        'At least one workflow step is required.',
      );
    }

    if (
      request.maxParallelSteps !== undefined &&
      (
        !Number.isSafeInteger(request.maxParallelSteps) ||
        request.maxParallelSteps < 1
      )
    ) {
      throw new BadRequestException(
        'maxParallelSteps must be a positive integer.',
      );
    }
  }

  private validateStepGraph(
    steps: WorkflowStepDefinition[],
  ): void {
    const ids = new Set<string>();

    for (const step of steps) {
      if (
        typeof step.id !== 'string' ||
        step.id.trim().length === 0
      ) {
        throw new BadRequestException(
          'Every workflow step must have a non-empty id.',
        );
      }

      if (ids.has(step.id)) {
        throw new BadRequestException(
          `Duplicate workflow step id: ${step.id}.`,
        );
      }

      if (
        step.maxAttempts !== undefined &&
        (
          !Number.isSafeInteger(step.maxAttempts) ||
          step.maxAttempts < 1
        )
      ) {
        throw new BadRequestException(
          `Step ${step.id} maxAttempts must be a positive integer.`,
        );
      }

      if (
        step.retryDelayMs !== undefined &&
        (
          !Number.isSafeInteger(step.retryDelayMs) ||
          step.retryDelayMs < 0
        )
      ) {
        throw new BadRequestException(
          `Step ${step.id} retryDelayMs must be a non-negative integer.`,
        );
      }

      ids.add(step.id);
    }

    for (const step of steps) {
      for (const dependencyId of step.dependsOn ?? []) {
        if (!ids.has(dependencyId)) {
          throw new BadRequestException(
            `Step ${step.id} depends on missing step ${dependencyId}.`,
          );
        }

        if (dependencyId === step.id) {
          throw new BadRequestException(
            `Step ${step.id} cannot depend on itself.`,
          );
        }
      }
    }

    const states = new Map<string, 'visiting' | 'visited'>();

    const visit = (stepId: string): void => {
      const state = states.get(stepId);

      if (state === 'visiting') {
        throw new BadRequestException(
          `Workflow step dependency cycle detected at ${stepId}.`,
        );
      }

      if (state === 'visited') {
        return;
      }

      states.set(stepId, 'visiting');

      const step = steps.find(
        (candidate) => candidate.id === stepId,
      );

      for (const dependencyId of step?.dependsOn ?? []) {
        visit(dependencyId);
      }

      states.set(stepId, 'visited');
    };

    for (const step of steps) {
      visit(step.id);
    }
  }

  private createStepRuntime(
    definition: WorkflowStepDefinition,
    now: Date,
  ): WorkflowStepRuntime {
    return {
      id: definition.id,
      name: definition.name?.trim() || definition.id,
      status: 'waiting',
      dependsOn: [...(definition.dependsOn ?? [])],
      attempt: 0,
      maxAttempts: definition.maxAttempts ?? 1,
      retryDelayMs: definition.retryDelayMs ?? 0,
      continueOnFailure:
        definition.continueOnFailure ?? false,
      input: this.sanitizeRecord(definition.input ?? {}),
      output: null,
      metadata: this.sanitizeRecord(
        definition.metadata ?? {},
      ),
      error: null,
      scheduledRetryId: null,
      startedAt: null,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  private cloneDefinitions(
    steps: WorkflowStepDefinition[],
  ): WorkflowStepDefinition[] {
    return steps.map((step) => ({
      id: step.id.trim(),
      ...(step.name !== undefined
        ? { name: step.name }
        : {}),
      dependsOn: [...(step.dependsOn ?? [])],
      ...(step.maxAttempts !== undefined
        ? { maxAttempts: step.maxAttempts }
        : {}),
      ...(step.retryDelayMs !== undefined
        ? { retryDelayMs: step.retryDelayMs }
        : {}),
      ...(step.continueOnFailure !== undefined
        ? {
            continueOnFailure:
              step.continueOnFailure,
          }
        : {}),
      input: this.sanitizeRecord(step.input ?? {}),
      metadata: this.sanitizeRecord(
        step.metadata ?? {},
      ),
    }));
  }

  private normalizeError(
    request: FailWorkflowStepRequest,
  ): WorkflowStepError {
    const retryable = request.retryable ?? false;

    if (request.error instanceof Error) {
      return {
        name: request.error.name,
        message: request.error.message,
        ...(request.code !== undefined
          ? { code: request.code }
          : {}),
        retryable,
        ...(request.details !== undefined
          ? {
              details: this.sanitizeRecord(
                request.details,
              ),
            }
          : {}),
      };
    }

    if (
      typeof request.error === 'object' &&
      request.error !== null
    ) {
      const source = request.error as Record<
        string,
        unknown
      >;

      const name =
        typeof source.name === 'string'
          ? source.name
          : 'WorkflowStepError';

      const message =
        typeof source.message === 'string'
          ? source.message
          : 'Workflow step execution failed.';

      return {
        name,
        message,
        ...(request.code !== undefined
          ? { code: request.code }
          : {}),
        retryable,
        details: this.sanitizeRecord({
          ...source,
          ...(request.details ?? {}),
        }),
      };
    }

    return {
      name: 'WorkflowStepError',
      message:
        typeof request.error === 'string'
          ? request.error
          : String(request.error),
      ...(request.code !== undefined
        ? { code: request.code }
        : {}),
      retryable,
      ...(request.details !== undefined
        ? {
            details: this.sanitizeRecord(
              request.details,
            ),
          }
        : {}),
    };
  }

  private sanitizeRecord(
    value: Record<string, unknown>,
  ): Record<string, unknown> {
    return this.sanitizeValue(
      value,
      new WeakSet<object>(),
    ) as Record<string, unknown>;
  }

  private sanitizeValue(
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
        this.sanitizeValue(entry, visited),
      );
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      sanitized[key] = this.isSecretKey(key)
        ? SECRET_MASK
        : this.sanitizeValue(entry, visited);
    }

    return sanitized;
  }

  private isSecretKey(key: string): boolean {
    const normalized = key
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

    if (SECRET_CONTAINER_KEYS.has(normalized)) {
      return false;
    }

    return (
      EXACT_SECRET_KEYS.has(normalized) ||
      normalized.endsWith('password') ||
      normalized.endsWith('secret') ||
      normalized.endsWith('token') ||
      normalized.endsWith('authorization') ||
      normalized.endsWith('apikey') ||
      normalized.endsWith('privatekey') ||
      normalized.endsWith('cookie') ||
      normalized.endsWith('credential')
    );
  }

  private cancelRetrySchedule(scheduleId: string): void {
    try {
      const schedule =
        this.scheduler.getSchedule(scheduleId);

      if (
        schedule.status !== 'cancelled' &&
        schedule.status !== 'completed'
      ) {
        this.scheduler.cancelSchedule(scheduleId);
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }
  }

  private assertExecutionRunnable(
    execution: WorkflowExecutionRuntime,
  ): void {
    if (execution.status === 'paused') {
      throw new ConflictException(
        `Workflow execution ${execution.id} is paused.`,
      );
    }

    if (
      execution.status === 'completed' ||
      execution.status === 'failed' ||
      execution.status === 'cancelled'
    ) {
      throw new ConflictException(
        `Workflow execution ${execution.id} is not runnable from status ${execution.status}.`,
      );
    }
  }

  private getMutableExecution(
    executionId: string,
  ): WorkflowExecutionRuntime {
    const execution = this.executions.get(executionId);

    if (!execution) {
      throw new NotFoundException(
        `Workflow execution ${executionId} was not found.`,
      );
    }

    return execution;
  }

  private getMutableStep(
    execution: WorkflowExecutionRuntime,
    stepId: string,
  ): WorkflowStepRuntime {
    const step = execution.steps.find(
      (candidate) => candidate.id === stepId,
    );

    if (!step) {
      throw new NotFoundException(
        `Workflow step ${stepId} was not found in execution ${execution.id}.`,
      );
    }

    return step;
  }

  private removeActiveStep(
    execution: WorkflowExecutionRuntime,
    stepId: string,
  ): void {
    execution.activeStepIds =
      execution.activeStepIds.filter(
        (activeStepId) => activeStepId !== stepId,
      );
  }

  private persist(
    execution: WorkflowExecutionRuntime,
  ): void {
    this.executions.set(
      execution.id,
      this.cloneExecution(execution),
    );
  }

  private cloneExecution(
    execution: WorkflowExecutionRuntime,
  ): WorkflowExecutionRuntime {
    return {
      ...execution,
      steps: execution.steps.map((step) =>
        this.cloneStep(step),
      ),
      activeStepIds: [...execution.activeStepIds],
      createdAt: new Date(execution.createdAt),
      updatedAt: new Date(execution.updatedAt),
      completedAt: execution.completedAt
        ? new Date(execution.completedAt)
        : null,
    };
  }

  private cloneStep(
    step: WorkflowStepRuntime,
  ): WorkflowStepRuntime {
    return {
      ...step,
      dependsOn: [...step.dependsOn],
      input: this.sanitizeRecord(step.input),
      output: step.output
        ? this.sanitizeRecord(step.output)
        : null,
      metadata: this.sanitizeRecord(step.metadata),
      error: step.error
        ? {
            ...step.error,
            ...(step.error.details
              ? {
                  details: this.sanitizeRecord(
                    step.error.details,
                  ),
                }
              : {}),
          }
        : null,
      startedAt: step.startedAt
        ? new Date(step.startedAt)
        : null,
      completedAt: step.completedAt
        ? new Date(step.completedAt)
        : null,
      createdAt: new Date(step.createdAt),
      updatedAt: new Date(step.updatedAt),
    };
  }

  private now(): Date {
    return new Date();
  }
}
