import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Optional,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  WorkflowExecutionRuntime,
  WorkflowStepOrchestratorService,
} from '../../orchestrator';
import { WorkflowSchedulerService } from '../../scheduler';
import { WorkflowCheckpointEngineService } from '../checkpoint-engine';
import {
  WorkflowEventEntity,
  WorkflowRecoveryEntity,
  WorkflowRecoveryPersistenceRecord,
} from '../entities';
import { WorkflowExecutionPersistenceEngineService } from '../execution-persistence';
import {
  WorkflowEventRepository,
  WorkflowExecutionRepository,
  WorkflowRecoveryRepository,
} from '../repositories';

export const WORKFLOW_RECOVERY_POLICY = Symbol('WORKFLOW_RECOVERY_POLICY');

export type WorkflowRecoveryMode = 'AUTO' | 'MANUAL';

export interface WorkflowRecoveryPolicy {
  mode: WorkflowRecoveryMode;
  recoverRunningStepsAs: 'ready' | 'failed';
  rebuildRetryTimers: boolean;
}

export const DEFAULT_WORKFLOW_RECOVERY_POLICY: WorkflowRecoveryPolicy = {
  mode: 'AUTO',
  recoverRunningStepsAs: 'ready',
  rebuildRetryTimers: true,
};

export interface WorkflowRecoveryResult {
  executionId: string;
  status: 'recovered' | 'skipped' | 'failed';
  restoredStepIds: string[];
  errorMessage: string | null;
}

@Injectable()
export class WorkflowRecoveryEngineService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WorkflowRecoveryEngineService.name);
  private readonly recoveryQueue = new Map<string, Promise<WorkflowRecoveryResult>>();
  private readonly policy: WorkflowRecoveryPolicy;

  constructor(
    private readonly orchestrator: WorkflowStepOrchestratorService,
    private readonly scheduler: WorkflowSchedulerService,
    private readonly persistenceEngine: WorkflowExecutionPersistenceEngineService,
    private readonly checkpointEngine: WorkflowCheckpointEngineService,
    private readonly executionRepository: WorkflowExecutionRepository,
    private readonly recoveryRepository: WorkflowRecoveryRepository,
    private readonly recoveryEntity: WorkflowRecoveryEntity,
    private readonly eventRepository: WorkflowEventRepository,
    private readonly eventEntity: WorkflowEventEntity,
    @Optional() @Inject(WORKFLOW_RECOVERY_POLICY)
    policy?: Partial<WorkflowRecoveryPolicy>,
  ) {
    this.policy = { ...DEFAULT_WORKFLOW_RECOVERY_POLICY, ...policy };
  }

  async onApplicationBootstrap(): Promise<void> {
    if (this.policy.mode === 'AUTO') {
      await this.recoverPendingExecutions();
    }
  }

  async recoverPendingExecutions(): Promise<WorkflowRecoveryResult[]> {
    const executions = await this.executionRepository.listRecoverable();
    return Promise.all(executions.map((record) => this.enqueue(record.id)));
  }

  startRecovery(executionId: string): Promise<WorkflowRecoveryResult> {
    return this.enqueue(executionId.trim());
  }

  async restoreExecution(executionId: string): Promise<WorkflowExecutionRuntime | null> {
    return this.persistenceEngine.restoreExecution(executionId.trim());
  }

  async validateCheckpoint(executionId: string): Promise<boolean> {
    return (await this.checkpointEngine.findLatestValid(executionId.trim())) !== null;
  }

  private enqueue(executionId: string): Promise<WorkflowRecoveryResult> {
    const existing = this.recoveryQueue.get(executionId);

    if (existing) {
      return existing;
    }

    const operation = this.recoverOne(executionId);

    this.recoveryQueue.set(executionId, operation);

    void operation.then(
      () => {
        if (this.recoveryQueue.get(executionId) === operation) {
          this.recoveryQueue.delete(executionId);
        }
      },
      () => {
        if (this.recoveryQueue.get(executionId) === operation) {
          this.recoveryQueue.delete(executionId);
        }
      },
    );

    return operation;
  }

  private async recoverOne(executionId: string): Promise<WorkflowRecoveryResult> {
    const latest = await this.recoveryRepository.findLatestByExecutionId(executionId);
    if (latest?.status === 'running') {
      return this.emitSkipped(executionId, 'Recovery is already running.');
    }

    const startedAt = new Date();
    const recovery = await this.recoveryRepository.save(
      this.recoveryEntity.create({
        id: randomUUID(),
        executionId,
        checkpointId: (await this.checkpointEngine.findLatestValid(executionId))?.id ?? null,
        status: 'running',
        reason: 'Application restart recovery.',
        startedAt,
      }),
    );

    try {
      const restored = await this.persistenceEngine.restoreExecution(executionId);
      if (!restored) {
        return await this.completeRecovery(recovery, 'skipped', [], 'Persisted execution not found.');
      }

      const normalized = this.applyRecoveryPolicy(restored);
      this.rebuildScheduler(normalized);
      this.orchestrator.restoreExecutionRuntime(normalized);

      const restoredStepIds = normalized.steps
        .filter((step) => step.status === 'ready' || step.scheduledRetryId !== null)
        .map((step) => step.id);

      return await this.completeRecovery(recovery, 'recovered', restoredStepIds, null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Workflow recovery failed for ${executionId}.`, error instanceof Error ? error.stack : undefined);
      return this.completeRecovery(recovery, 'failed', [], message);
    }
  }

  private applyRecoveryPolicy(execution: WorkflowExecutionRuntime): WorkflowExecutionRuntime {
    const now = new Date();
    const steps = execution.steps.map((step) => {
      if (step.status !== 'active') return { ...step };
      if (this.policy.recoverRunningStepsAs === 'failed') {
        return {
          ...step,
          status: 'failed' as const,
          error: {
            name: 'WorkflowRecoveryInterruptedStep',
            message: 'Step was active when the application stopped.',
            retryable: false,
          },
          completedAt: now,
          updatedAt: now,
        };
      }
      return {
        ...step,
        status: 'ready' as const,
        startedAt: null,
        completedAt: null,
        updatedAt: now,
      };
    });

    return {
      ...execution,
      status: execution.status === 'paused' ? 'paused' : 'running',
      steps,
      activeStepIds: [],
      updatedAt: now,
    };
  }

  private rebuildScheduler(execution: WorkflowExecutionRuntime): void {
    if (!this.policy.rebuildRetryTimers) return;
    for (const step of execution.steps) {
      if (step.status !== 'waiting' || step.scheduledRetryId === null) continue;
      const schedule = this.scheduler.scheduleRetry({
        workflowId: execution.workflowId,
        executionId: execution.id,
        retryAttempt: Math.max(1, step.attempt + 1),
        retryDelayMs: step.retryDelayMs,
        retryReason: step.error?.message,
        metadata: { executionId: execution.id, stepId: step.id, recovered: true },
      });
      step.scheduledRetryId = schedule.id;
    }
  }

  private async completeRecovery(
    recovery: WorkflowRecoveryPersistenceRecord,
    status: WorkflowRecoveryResult['status'],
    restoredStepIds: string[],
    errorMessage: string | null,
  ): Promise<WorkflowRecoveryResult> {
    const completedAt = new Date();
    await this.recoveryRepository.save(this.recoveryEntity.create({
      ...recovery,
      status: status === 'recovered' ? 'completed' : status === 'failed' ? 'failed' : 'abandoned',
      restoredStepIds,
      errorMessage,
      completedAt,
    }));

    const sequence = await this.eventRepository.nextSequence(recovery.executionId);
    await this.eventRepository.append(this.eventEntity.create({
      id: randomUUID(),
      executionId: recovery.executionId,
      sequence,
      type: status === 'recovered' ? 'workflow.recovered' : status === 'failed' ? 'workflow.recovery.failed' : 'workflow.recovery.skipped',
      payload: { restoredStepIds, errorMessage },
      occurredAt: completedAt,
    }));

    return { executionId: recovery.executionId, status, restoredStepIds, errorMessage };
  }

  private async emitSkipped(executionId: string, reason: string): Promise<WorkflowRecoveryResult> {
    return { executionId, status: 'skipped', restoredStepIds: [], errorMessage: reason };
  }
}
