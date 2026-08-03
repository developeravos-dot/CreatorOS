import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';
import {
  QueueJob,
  QueuePriority,
  QueueProvider,
  QUEUE_PROVIDER,
} from '../../../../../modules/queue-infrastructure';
import {
  WorkflowStepOrchestratorService,
} from '../../orchestrator';
import {
  WORKFLOW_EXECUTION_QUEUE,
  WORKFLOW_RETRY_QUEUE,
  WORKFLOW_STEP_QUEUE,
  WorkflowDispatchOptions,
  WorkflowDispatchResult,
  WorkflowExecutionJobPayload,
  WorkflowRetryJobPayload,
  WorkflowStepJobPayload,
} from '../contracts';
import {
  WorkflowDispatchMetrics,
  WorkflowDispatchRecord,
  createEmptyWorkflowDispatchMetrics,
} from '../models';
import {
  WorkflowDispatchIdempotencyService,
} from './workflow-dispatch-idempotency.service';

@Injectable()
export class WorkflowQueueDispatcherService {
  private readonly records =
    new Map<string, WorkflowDispatchRecord>();

  constructor(
    @Inject(QUEUE_PROVIDER)
    private readonly queueProvider:
      QueueProvider,
    private readonly orchestrator:
      WorkflowStepOrchestratorService,
    private readonly idempotency:
      WorkflowDispatchIdempotencyService,
  ) {}

  async dispatchWorkflow(
    executionId: string,
    options: WorkflowDispatchOptions = {},
  ): Promise<WorkflowDispatchResult> {
    const execution =
      this.orchestrator.getExecution(executionId);

    const payload: WorkflowExecutionJobPayload = {
      executionId: execution.id,
      workflowId: execution.workflowId,
      requestedAt: new Date().toISOString(),
      ...(options.correlationId
        ? {
            correlationId:
              options.correlationId,
          }
        : {}),
    };

    const idempotencyKey =
      options.idempotencyKey ??
      `workflow:${execution.id}`;

    return this.dispatch({
      queueName: WORKFLOW_EXECUTION_QUEUE,
      jobName: 'execute-workflow',
      kind: 'workflow',
      executionId: execution.id,
      workflowId: execution.workflowId,
      stepId: null,
      payload,
      options,
      idempotencyKey,
    });
  }

  async dispatchStep(
    executionId: string,
    stepId: string,
    options: WorkflowDispatchOptions = {},
  ): Promise<WorkflowDispatchResult> {
    const execution =
      this.orchestrator.getExecution(executionId);

    const step = execution.steps.find(
      (candidate) => candidate.id === stepId,
    );

    if (!step) {
      throw new NotFoundException(
        `Workflow step ${stepId} was not found in execution ${executionId}.`,
      );
    }

    const nextAttempt = step.attempt + 1;

    const payload: WorkflowStepJobPayload = {
      executionId: execution.id,
      workflowId: execution.workflowId,
      stepId: step.id,
      attempt: nextAttempt,
      requestedAt: new Date().toISOString(),
      ...(options.correlationId
        ? {
            correlationId:
              options.correlationId,
          }
        : {}),
    };

    const idempotencyKey =
      options.idempotencyKey ??
      `step:${execution.id}:${step.id}:${nextAttempt}`;

    return this.dispatch({
      queueName: WORKFLOW_STEP_QUEUE,
      jobName: 'execute-workflow-step',
      kind: 'step',
      executionId: execution.id,
      workflowId: execution.workflowId,
      stepId: step.id,
      payload,
      options,
      idempotencyKey,
    });
  }

  async dispatchRetry(
    executionId: string,
    stepId: string,
    scheduleId: string,
    retryAttempt: number,
    options: WorkflowDispatchOptions = {},
  ): Promise<WorkflowDispatchResult> {
    const execution =
      this.orchestrator.getExecution(executionId);

    const step = execution.steps.find(
      (candidate) => candidate.id === stepId,
    );

    if (!step) {
      throw new NotFoundException(
        `Workflow step ${stepId} was not found in execution ${executionId}.`,
      );
    }

    const payload: WorkflowRetryJobPayload = {
      executionId: execution.id,
      workflowId: execution.workflowId,
      stepId: step.id,
      retryAttempt,
      scheduleId,
      requestedAt: new Date().toISOString(),
      ...(options.correlationId
        ? {
            correlationId:
              options.correlationId,
          }
        : {}),
    };

    const idempotencyKey =
      options.idempotencyKey ??
      `retry:${execution.id}:${step.id}:${retryAttempt}:${scheduleId}`;

    return this.dispatch({
      queueName: WORKFLOW_RETRY_QUEUE,
      jobName: 'retry-workflow-step',
      kind: 'retry',
      executionId: execution.id,
      workflowId: execution.workflowId,
      stepId: step.id,
      payload,
      options,
      idempotencyKey,
    });
  }

  getRecord(
    dispatchId: string,
  ): WorkflowDispatchRecord {
    const record = this.records.get(dispatchId);

    if (!record) {
      throw new NotFoundException(
        `Workflow dispatch ${dispatchId} was not found.`,
      );
    }

    return this.cloneRecord(record);
  }

  listRecords(
    executionId?: string,
  ): WorkflowDispatchRecord[] {
    return [...this.records.values()]
      .filter(
        (record) =>
          !executionId ||
          record.executionId === executionId,
      )
      .sort(
        (left, right) =>
          left.createdAt.getTime() -
          right.createdAt.getTime(),
      )
      .map((record) =>
        this.cloneRecord(record),
      );
  }

  getMetrics(): WorkflowDispatchMetrics {
    const metrics =
      createEmptyWorkflowDispatchMetrics();

    for (const record of this.records.values()) {
      metrics[record.status] += 1;
      metrics.total += 1;
    }

    return metrics;
  }

  markProcessing(
    dispatchId: string,
  ): WorkflowDispatchRecord {
    return this.updateStatus(
      dispatchId,
      'processing',
    );
  }

  markCompleted(
    dispatchId: string,
  ): WorkflowDispatchRecord {
    return this.updateStatus(
      dispatchId,
      'completed',
    );
  }

  markFailed(
    dispatchId: string,
    error: unknown,
  ): WorkflowDispatchRecord {
    const record = this.getMutableRecord(
      dispatchId,
    );

    record.status = 'failed';
    record.error =
      error instanceof Error
        ? error.message
        : String(error);
    record.updatedAt = new Date();

    return this.cloneRecord(record);
  }

  clear(): void {
    this.records.clear();
    this.idempotency.clear();
  }

  private async dispatch(
    request: {
      queueName: string;
      jobName: string;
      kind: WorkflowDispatchRecord['kind'];
      executionId: string;
      workflowId: string;
      stepId: string | null;
      payload: Record<string, unknown>;
      options: WorkflowDispatchOptions;
      idempotencyKey: string;
    },
  ): Promise<WorkflowDispatchResult> {
    const dispatchId = randomUUID();

    const reserved = this.idempotency.reserve(
      request.idempotencyKey,
      dispatchId,
    );

    if (!reserved) {
      const existing =
        this.idempotency.get(
          request.idempotencyKey,
        );

      return {
        dispatchId:
          existing?.dispatchId ?? dispatchId,
        queueName: request.queueName,
        jobId:
          existing?.dispatchId ?? dispatchId,
        kind: request.kind,
        status: 'duplicate',
        idempotencyKey:
          request.idempotencyKey,
        createdAt: new Date(),
      };
    }

    try {
      const queuePayload = {
        ...request.payload,
        dispatchId,
      };

      const queueJob = await this.queueProvider.add(
        request.queueName,
        request.jobName,
        queuePayload,
        {
          jobId: dispatchId,
          delayMs:
            request.options.delayMs,
          attempts:
            request.options.attempts ?? 3,
          priority:
            request.options.priority ??
            this.defaultPriority(
              request.kind,
            ),
          metadata: {
            dispatchId,
            idempotencyKey:
              request.idempotencyKey,
            correlationId:
              request.options.correlationId,
            ...(request.options.metadata ?? {}),
          },
        },
      );

      const now = new Date();

      const record: WorkflowDispatchRecord = {
        id: dispatchId,
        kind: request.kind,
        executionId:
          request.executionId,
        workflowId:
          request.workflowId,
        stepId: request.stepId,
        queueName:
          request.queueName,
        queueJobId: queueJob.id,
        idempotencyKey:
          request.idempotencyKey,
        correlationId:
          request.options.correlationId ??
          null,
        status: 'queued',
        attempts: 0,
        error: null,
        createdAt: now,
        updatedAt: now,
        completedAt: null,
        metadata: {
          ...(request.options.metadata ?? {}),
        },
      };

      this.records.set(
        record.id,
        record,
      );

      return {
        dispatchId: record.id,
        queueName: record.queueName,
        jobId: record.queueJobId,
        kind: record.kind,
        status: 'queued',
        idempotencyKey:
          record.idempotencyKey,
        createdAt: new Date(
          record.createdAt,
        ),
      };
    } catch (error) {
      this.idempotency.release(
        request.idempotencyKey,
      );

      throw error;
    }
  }

  private defaultPriority(
    kind: WorkflowDispatchRecord['kind'],
  ): QueuePriority {
    switch (kind) {
      case 'retry':
        return 'critical';

      case 'step':
        return 'high';

      case 'workflow':
        return 'normal';

      default:
        return this.assertNever(kind);
    }
  }

  private updateStatus(
    dispatchId: string,
    status:
      | 'processing'
      | 'completed',
  ): WorkflowDispatchRecord {
    const record =
      this.getMutableRecord(dispatchId);

    record.status = status;
    record.updatedAt = new Date();

    if (status === 'completed') {
      record.completedAt = new Date();
    }

    return this.cloneRecord(record);
  }

  private getMutableRecord(
    dispatchId: string,
  ): WorkflowDispatchRecord {
    const record = this.records.get(dispatchId);

    if (!record) {
      throw new NotFoundException(
        `Workflow dispatch ${dispatchId} was not found.`,
      );
    }

    return record;
  }

  private cloneRecord(
    record: WorkflowDispatchRecord,
  ): WorkflowDispatchRecord {
    return {
      ...record,
      createdAt: new Date(
        record.createdAt,
      ),
      updatedAt: new Date(
        record.updatedAt,
      ),
      completedAt:
        record.completedAt
          ? new Date(record.completedAt)
          : null,
      metadata: structuredClone(
        record.metadata,
      ),
    };
  }

  private assertNever(value: never): never {
    throw new Error(
      `Unsupported dispatch kind: ${String(value)}`,
    );
  }
}
