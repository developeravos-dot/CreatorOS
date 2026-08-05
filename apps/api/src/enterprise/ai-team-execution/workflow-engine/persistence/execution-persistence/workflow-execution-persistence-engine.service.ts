import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  WorkflowExecutionRuntime,
  WorkflowStepRuntime,
} from '../../orchestrator';
import {
  WorkflowCheckpointEngineService,
} from '../checkpoint-engine';
import {
  WorkflowEventEntity,
  WorkflowExecutionEntity,
  WorkflowStepStateEntity,
} from '../entities';
import {
  WorkflowEventRepository,
  WorkflowExecutionRepository,
  WorkflowStepStateRepository,
} from '../repositories';

export interface PersistWorkflowTransitionOptions {
  eventType?: string;
  eventMetadata?: Record<string, unknown>;
  checkpoint?: boolean;
}

interface PersistedRuntimeContext {
  runtimeVersion: 1;
  steps: WorkflowStepRuntime[];
}

@Injectable()
export class WorkflowExecutionPersistenceEngineService {
  private readonly logger = new Logger(
    WorkflowExecutionPersistenceEngineService.name,
  );

  private readonly queues = new Map<string, Promise<void>>();
  private readonly failures = new Map<string, Error>();

  constructor(
    private readonly executionEntity: WorkflowExecutionEntity,
    private readonly stepStateEntity: WorkflowStepStateEntity,
    private readonly eventEntity: WorkflowEventEntity,
    private readonly checkpointEngine: WorkflowCheckpointEngineService,
    private readonly executionRepository: WorkflowExecutionRepository,
    private readonly stepStateRepository: WorkflowStepStateRepository,
    private readonly eventRepository: WorkflowEventRepository,
  ) {}

  enqueueTransition(
    execution: WorkflowExecutionRuntime,
    options: PersistWorkflowTransitionOptions = {},
  ): void {
    const snapshot = this.cloneExecution(execution);
    const previous = this.queues.get(snapshot.id) ?? Promise.resolve();

    const current = previous
      .catch(() => undefined)
      .then(() => this.persistTransition(snapshot, options))
      .catch((error: unknown) => {
        const normalized =
          error instanceof Error ? error : new Error(String(error));

        this.failures.set(snapshot.id, normalized);
        this.logger.error(
          `Failed to persist workflow execution ${snapshot.id}.`,
          normalized.stack,
        );

        throw normalized;
      });

    this.queues.set(snapshot.id, current);

    void current.then(
      () => {
        if (this.queues.get(snapshot.id) === current) {
          this.queues.delete(snapshot.id);
        }
      },
      () => {
        if (this.queues.get(snapshot.id) === current) {
          this.queues.delete(snapshot.id);
        }
      },
    );
  }

  async persistTransition(
    execution: WorkflowExecutionRuntime,
    options: PersistWorkflowTransitionOptions = {},
  ): Promise<void> {
    const existing =
      await this.executionRepository.findById(execution.id);

    const now = new Date(execution.updatedAt);
    const context: PersistedRuntimeContext = {
      runtimeVersion: 1,
      steps: execution.steps.map((step) => this.cloneStep(step)),
    };

    const baseRecord = this.executionEntity.create({
      id: execution.id,
      workflowId: execution.workflowId,
      status: execution.status,
      maxParallelSteps: execution.maxParallelSteps,
      activeStepIds: execution.activeStepIds,
      context: context as unknown as Record<string, unknown>,
      metadata: {},
      version: existing?.version ?? 1,
      createdAt: execution.createdAt,
      updatedAt: now,
      startedAt:
        execution.status === 'pending'
          ? null
          : existing?.startedAt ?? execution.createdAt,
      pausedAt:
        execution.status === 'paused' ? now : null,
      completedAt: execution.completedAt,
      failureReason: this.findFailureReason(execution),
    });

    if (existing) {
      const next = this.executionEntity.nextVersion(
        existing,
        {
          status: baseRecord.status,
          maxParallelSteps: baseRecord.maxParallelSteps,
          activeStepIds: baseRecord.activeStepIds,
          context: baseRecord.context,
          metadata: baseRecord.metadata,
          startedAt: baseRecord.startedAt,
          pausedAt: baseRecord.pausedAt,
          completedAt: baseRecord.completedAt,
          failureReason: baseRecord.failureReason,
        },
        now,
      );

      await this.executionRepository.save(next, existing.version);
    } else {
      await this.executionRepository.save(baseRecord);
    }

    for (const step of execution.steps) {
      const existingStep =
        await this.stepStateRepository.findByExecutionAndStep(
          execution.id,
          step.id,
        );

      const state = this.stepStateEntity.create({
        id: existingStep?.id ?? `${execution.id}:${step.id}`,
        executionId: execution.id,
        stepId: step.id,
        status: this.mapStepStatus(step.status),
        attempt: step.attempt,
        input: {
          input: step.input,
          metadata: step.metadata,
          dependsOn: step.dependsOn,
          name: step.name,
          maxAttempts: step.maxAttempts,
          retryDelayMs: step.retryDelayMs,
          continueOnFailure: step.continueOnFailure,
          scheduledRetryId: step.scheduledRetryId,
        },
        output: step.output,
        errorMessage: step.error?.message ?? null,
        startedAt: step.startedAt,
        completedAt: step.completedAt,
        createdAt: step.createdAt,
        updatedAt: step.updatedAt,
        version: existingStep?.version
          ? existingStep.version + 1
          : 1,
      });

      await this.stepStateRepository.save(
        state,
        existingStep?.version,
      );
    }

    const sequence =
      await this.eventRepository.nextSequence(execution.id);

    await this.eventRepository.append(
      this.eventEntity.create({
        id: randomUUID(),
        executionId: execution.id,
        sequence,
        type:
          options.eventType ??
          `workflow.execution.${execution.status}`,
        payload: {
          status: execution.status,
          activeStepIds: execution.activeStepIds,
          completedAt:
            execution.completedAt?.toISOString() ?? null,
        },
        metadata: options.eventMetadata ?? {},
        occurredAt: now,
      }),
    );

    if (options.checkpoint !== false) {
      await this.checkpointEngine.createCheckpointIfDue(
        execution,
        sequence,
        now,
        {
          force: options.checkpoint === true,
        },
      );
    }
  }

  async restoreExecution(
    executionId: string,
  ): Promise<WorkflowExecutionRuntime | null> {
    await this.flush(executionId);

    const record =
      await this.executionRepository.findById(executionId);

    if (!record) {
      return null;
    }

    const checkpoint =
      await this.checkpointEngine.restoreLatestSnapshot(executionId);

    const context =
      record.context as unknown as Partial<PersistedRuntimeContext>;

    const snapshots =
      checkpoint?.steps ??
      (context.runtimeVersion === 1 &&
      Array.isArray(context.steps)
        ? context.steps
        : null);

    if (!snapshots) {
      throw new Error(
        `Workflow execution ${executionId} has no valid persisted runtime snapshot.`,
      );
    }

    const stepStates =
      await this.stepStateRepository.listByExecutionId(executionId);

    const stateByStepId = new Map(
      stepStates.map((state) => [state.stepId, state]),
    );

    const steps = snapshots.map((snapshot) => {
      const persisted = stateByStepId.get(snapshot.id);

      if (!persisted) {
        return this.cloneStep(snapshot);
      }

      return {
        ...this.cloneStep(snapshot),
        status: this.unmapStepStatus(persisted.status),
        attempt: persisted.attempt,
        output: persisted.output,
        error:
          persisted.errorMessage === null
            ? null
            : {
                name: 'PersistedWorkflowStepError',
                message: persisted.errorMessage,
                retryable: false,
              },
        startedAt: persisted.startedAt,
        completedAt: persisted.completedAt,
        updatedAt: persisted.updatedAt,
      };
    });

    return {
      id: record.id,
      workflowId: record.workflowId,
      status: record.status,
      steps,
      maxParallelSteps: record.maxParallelSteps,
      activeStepIds: [...record.activeStepIds],
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      completedAt:
        record.completedAt === null
          ? null
          : new Date(record.completedAt),
    };
  }

  async flush(executionId?: string): Promise<void> {
    if (executionId) {
      const queue = this.queues.get(executionId);
      if (queue) {
        await queue;
      }

      const failure = this.failures.get(executionId);
      if (failure) {
        this.failures.delete(executionId);
        throw failure;
      }

      return;
    }

    await Promise.all([...this.queues.values()]);

    const failures = [...this.failures.values()];
    this.failures.clear();

    if (failures.length > 0) {
      throw new AggregateError(
        failures,
        'One or more workflow persistence operations failed.',
      );
    }
  }

  private mapStepStatus(
    status: WorkflowStepRuntime['status'],
  ):
    | 'pending'
    | 'ready'
    | 'running'
    | 'completed'
    | 'failed'
    | 'skipped'
    | 'cancelled' {
    if (status === 'waiting') {
      return 'pending';
    }

    if (status === 'active') {
      return 'running';
    }

    return status;
  }

  private unmapStepStatus(
    status:
      | 'pending'
      | 'ready'
      | 'running'
      | 'completed'
      | 'failed'
      | 'skipped'
      | 'cancelled',
  ): WorkflowStepRuntime['status'] {
    if (status === 'pending') {
      return 'waiting';
    }

    if (status === 'running') {
      return 'active';
    }

    return status;
  }

  private findFailureReason(
    execution: WorkflowExecutionRuntime,
  ): string | null {
    if (execution.status !== 'failed') {
      return null;
    }

    return (
      execution.steps.find((step) => step.error)?.error?.message ??
      'Workflow execution failed.'
    );
  }

  private cloneExecution(
    execution: WorkflowExecutionRuntime,
  ): WorkflowExecutionRuntime {
    return {
      ...execution,
      steps: execution.steps.map((step) => this.cloneStep(step)),
      activeStepIds: [...execution.activeStepIds],
      createdAt: new Date(execution.createdAt),
      updatedAt: new Date(execution.updatedAt),
      completedAt:
        execution.completedAt === null
          ? null
          : new Date(execution.completedAt),
    };
  }

  private cloneStep(step: WorkflowStepRuntime): WorkflowStepRuntime {
    return {
      ...step,
      dependsOn: [...step.dependsOn],
      input: structuredClone(step.input),
      output:
        step.output === null
          ? null
          : structuredClone(step.output),
      metadata: structuredClone(step.metadata),
      error:
        step.error === null
          ? null
          : structuredClone(step.error),
      startedAt:
        step.startedAt === null
          ? null
          : new Date(step.startedAt),
      completedAt:
        step.completedAt === null
          ? null
          : new Date(step.completedAt),
      createdAt: new Date(step.createdAt),
      updatedAt: new Date(step.updatedAt),
    };
  }
}
