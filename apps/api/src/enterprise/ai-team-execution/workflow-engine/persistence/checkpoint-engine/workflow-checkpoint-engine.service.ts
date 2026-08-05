import {
  Inject,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';

import {
  WorkflowExecutionRuntime,
  WorkflowStepRuntime,
} from '../../orchestrator';
import {
  WorkflowCheckpointEntity,
  WorkflowCheckpointPersistenceRecord,
} from '../entities';
import { WorkflowCheckpointRepository } from '../repositories';

export const WORKFLOW_CHECKPOINT_POLICY =
  Symbol('WORKFLOW_CHECKPOINT_POLICY');

export interface WorkflowCheckpointPolicy {
  transitionInterval: number;
  timeIntervalMs: number;
  createInitialCheckpoint: boolean;
}

export const DEFAULT_WORKFLOW_CHECKPOINT_POLICY:
  WorkflowCheckpointPolicy = {
    transitionInterval: 5,
    timeIntervalMs: 60_000,
    createInitialCheckpoint: true,
  };

export interface WorkflowCheckpointSnapshot {
  snapshotVersion: 1;
  workflowId: string;
  status: WorkflowExecutionRuntime['status'];
  maxParallelSteps: number;
  activeStepIds: string[];
  steps: WorkflowStepRuntime[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateWorkflowCheckpointOptions {
  force?: boolean;
}

@Injectable()
export class WorkflowCheckpointEngineService {
  private readonly logger = new Logger(
    WorkflowCheckpointEngineService.name,
  );

  private readonly policy: WorkflowCheckpointPolicy;

  constructor(
    private readonly checkpointEntity: WorkflowCheckpointEntity,
    private readonly checkpointRepository: WorkflowCheckpointRepository,
    @Optional()
    @Inject(WORKFLOW_CHECKPOINT_POLICY)
    policy?: Partial<WorkflowCheckpointPolicy>,
  ) {
    this.policy = this.normalizePolicy(policy);
  }

  async createCheckpointIfDue(
    execution: WorkflowExecutionRuntime,
    eventSequence: number,
    createdAt: Date,
    options: CreateWorkflowCheckpointOptions = {},
  ): Promise<WorkflowCheckpointPersistenceRecord | null> {
    const snapshot = this.createSnapshot(execution);
    const checksum = this.checksum(snapshot);
    const latestValid = await this.findLatestValid(execution.id);

    if (latestValid?.checksum === checksum) {
      return null;
    }

    if (
      !this.isDue(
        latestValid,
        eventSequence,
        createdAt,
        options.force === true,
      )
    ) {
      return null;
    }

    return this.checkpointRepository.save(
      this.checkpointEntity.create({
        id: randomUUID(),
        executionId: execution.id,
        sequence: eventSequence,
        state: snapshot as unknown as Record<string, unknown>,
        completedStepIds: execution.steps
          .filter((step) => step.status === 'completed')
          .map((step) => step.id),
        activeStepIds: execution.activeStepIds,
        checksum,
        createdAt,
      }),
    );
  }

  async findLatestValid(
    executionId: string,
  ): Promise<WorkflowCheckpointPersistenceRecord | null> {
    const checkpoints =
      await this.checkpointRepository.listByExecutionId(executionId);

    for (let index = checkpoints.length - 1; index >= 0; index -= 1) {
      const checkpoint = checkpoints[index];

      if (!checkpoint) {
        continue;
      }

      if (this.isValid(checkpoint)) {
        return checkpoint;
      }

      this.logger.warn(
        `Skipping corrupted workflow checkpoint ${checkpoint.id} for execution ${executionId}.`,
      );
    }

    return null;
  }

  async restoreLatestSnapshot(
    executionId: string,
  ): Promise<WorkflowCheckpointSnapshot | null> {
    const checkpoint = await this.findLatestValid(executionId);

    if (!checkpoint) {
      return null;
    }

    return structuredClone(
      checkpoint.state as unknown as WorkflowCheckpointSnapshot,
    );
  }

  isValid(
    checkpoint: WorkflowCheckpointPersistenceRecord,
  ): boolean {
    try {
      const state =
        checkpoint.state as unknown as Partial<WorkflowCheckpointSnapshot>;

      if (
        state.snapshotVersion !== 1 ||
        typeof state.workflowId !== 'string' ||
        !Array.isArray(state.steps) ||
        !Array.isArray(state.activeStepIds)
      ) {
        return false;
      }

      return this.checksum(checkpoint.state) === checkpoint.checksum;
    } catch {
      return false;
    }
  }

  checksum(value: unknown): string {
    return `sha256:${createHash('sha256')
      .update(this.canonicalStringify(value))
      .digest('hex')}`;
  }

  private createSnapshot(
    execution: WorkflowExecutionRuntime,
  ): WorkflowCheckpointSnapshot {
    return {
      snapshotVersion: 1,
      workflowId: execution.workflowId,
      status: execution.status,
      maxParallelSteps: execution.maxParallelSteps,
      activeStepIds: [...execution.activeStepIds],
      steps: execution.steps.map((step) =>
        this.cloneStep(step),
      ),
      createdAt: execution.createdAt.toISOString(),
      updatedAt: execution.updatedAt.toISOString(),
      completedAt:
        execution.completedAt?.toISOString() ?? null,
    };
  }

  private isDue(
    latest: WorkflowCheckpointPersistenceRecord | null,
    eventSequence: number,
    createdAt: Date,
    force: boolean,
  ): boolean {
    if (force) {
      return true;
    }

    if (!latest) {
      return this.policy.createInitialCheckpoint;
    }

    const transitionDue =
      eventSequence - latest.sequence >=
      this.policy.transitionInterval;

    const timeDue =
      createdAt.getTime() - latest.createdAt.getTime() >=
      this.policy.timeIntervalMs;

    return transitionDue || timeDue;
  }

  private normalizePolicy(
    policy?: Partial<WorkflowCheckpointPolicy>,
  ): WorkflowCheckpointPolicy {
    const normalized = {
      ...DEFAULT_WORKFLOW_CHECKPOINT_POLICY,
      ...policy,
    };

    if (
      !Number.isSafeInteger(normalized.transitionInterval) ||
      normalized.transitionInterval < 1
    ) {
      throw new Error(
        'Workflow checkpoint transitionInterval must be a positive integer.',
      );
    }

    if (
      !Number.isFinite(normalized.timeIntervalMs) ||
      normalized.timeIntervalMs < 1
    ) {
      throw new Error(
        'Workflow checkpoint timeIntervalMs must be positive.',
      );
    }

    return normalized;
  }

  private canonicalStringify(value: unknown): string {
    return JSON.stringify(this.canonicalize(value));
  }

  private canonicalize(value: unknown): unknown {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((entry) => this.canonicalize(entry));
    }

    if (value && typeof value === 'object') {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>(
          (result, key) => {
            result[key] = this.canonicalize(
              (value as Record<string, unknown>)[key],
            );
            return result;
          },
          {},
        );
    }

    return value;
  }

  private cloneStep(
    step: WorkflowStepRuntime,
  ): WorkflowStepRuntime {
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
