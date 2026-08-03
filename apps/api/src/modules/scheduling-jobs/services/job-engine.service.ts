import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import type {
  JobOperationResultContract,
  UpdateJobContract,
} from '../contracts';
import {
  JobExecutionModel,
  JobHistoryModel,
  JobModel,
  appendJobExecutionHistory,
  appendJobHistoryEvent,
  appendJobRetryHistory,
  appendJobStateTransition,
  assertJobProgressPercentage,
  calculateJobMetrics,
  createDefaultJobRetryPolicy,
  createEmptyJobHistory,
  evaluateJobRetry,
  normalizeJobPriority,
  normalizeJobType,
  type CreateJobInput,
  type Job,
  type JobExecution,
  type JobFailure,
  type JobHistory,
  type JobMetrics,
  type JobProgress,
  type JobQueue,
  type JobResult,
  type JobRetryPolicy,
  type JobState,
} from '../models';
import {
  JobStateMachineService,
} from './job-state-machine.service';

@Injectable()
export class JobEngineService {
  private readonly jobs =
    new Map<string, Job>();

  private readonly executions =
    new Map<string, JobExecution>();

  private readonly histories =
    new Map<string, JobHistory>();

  private readonly queues =
    new Map<string, JobQueue>();

  constructor(
    private readonly stateMachine:
      JobStateMachineService =
        new JobStateMachineService(),
  ) {}

  create(
    input:
      CreateJobInput,
  ): Job {
    const id =
      this.normalizeIdentifier(
        input.id,
      ) ?? randomUUID();

    if (this.jobs.has(id)) {
      throw new Error(
        `Job ${id} already exists.`,
      );
    }

    const name =
      this.requireText(
        input.name,
        'name',
      );

    const queueName =
      this.normalizeIdentifier(
        input.queueName,
      ) ?? 'default';

    const now =
      new Date().toISOString();

    const job:
      Job = {
        id,
        name,
        description:
          this.normalizeText(
            input.description,
          ),
        type:
          normalizeJobType(
            input.type,
          ),
        state:
          'draft',
        priority:
          normalizeJobPriority(
            input.priority,
          ),
        queueName,
        payload: {
          data:
            this.sanitizeRecord(
              input.payload ?? {},
            ),
          contentType:
            'application/json',
          schemaVersion:
            this.normalizeIdentifier(
              input.schemaVersion,
            ),
        },
        configuration:
          this.createConfiguration(
            input.configuration,
          ),
        correlation: {
          ...input.correlation,
        },
        ownership: {
          ...input.ownership,
        },
        dependencies:
          this.normalizeDependencies(
            input.dependencies,
          ),
        executionCount: 0,
        progress:
          this.createProgress(
            0,
            now,
          ),
        tags: {
          tags:
            this.normalizeTags(
              input.tags,
            ),
          labels:
            this.normalizeLabels(
              input.labels,
            ),
        },
        createdAt: now,
        updatedAt: now,
      };

    const snapshot =
      new JobModel(job)
        .toContract();

    this.jobs.set(
      id,
      snapshot,
    );

    let history =
      createEmptyJobHistory(
        id,
        now,
      );

    history =
      appendJobHistoryEvent(
        history,
        {
          id:
            randomUUID(),
          jobId: id,
          type:
            'created',
          occurredAt: now,
          state:
            'draft',
          message:
            'Job created.',
          correlation: {
            ...job.correlation,
          },
          metadata: {},
        },
      );

    this.histories.set(
      id,
      history,
    );

    return this.cloneJob(
      snapshot,
    );
  }

  getById(
    jobId: string,
  ): Job | undefined {
    const job =
      this.jobs.get(jobId);

    return job
      ? this.cloneJob(job)
      : undefined;
  }

  getExecutionById(
    executionId: string,
  ): JobExecution | undefined {
    const execution =
      this.executions.get(
        executionId,
      );

    return execution
      ? this.cloneExecution(
          execution,
        )
      : undefined;
  }

  getHistory(
    jobId: string,
  ): JobHistory | undefined {
    const history =
      this.histories.get(
        jobId,
      );

    return history
      ? new JobHistoryModel(
          history,
        ).toContract()
      : undefined;
  }

  list():
    readonly Job[] {
    return [
      ...this.jobs.values(),
    ]
      .sort(
        (left, right) =>
          right.createdAt
            .localeCompare(
              left.createdAt,
            ),
      )
      .map(
        (job) =>
          this.cloneJob(job),
      );
  }

  listExecutions(
    jobId?: string,
  ):
    readonly JobExecution[] {
    return [
      ...this.executions
        .values(),
    ]
      .filter(
        (execution) =>
          !jobId ||
          execution.jobId ===
            jobId,
      )
      .sort(
        (left, right) =>
          right.createdAt
            .localeCompare(
              left.createdAt,
            ),
      )
      .map(
        (execution) =>
          this.cloneExecution(
            execution,
          ),
      );
  }

  update(
    jobId: string,
    input:
      UpdateJobContract,
  ): Job {
    const existing =
      this.requireJob(jobId);

    if (
      this.stateMachine
        .isTerminal(
          existing.state,
        )
    ) {
      throw new Error(
        `Terminal job ${jobId} cannot be updated.`,
      );
    }

    const now =
      new Date().toISOString();

    const updated:
      Job = {
        ...existing,
        name:
          input.name !== undefined
            ? this.requireText(
                input.name,
                'name',
              )
            : existing.name,
        description:
          input.description !==
          undefined
            ? this.normalizeText(
                input.description,
              )
            : existing.description,
        type:
          input.type ??
          existing.type,
        priority:
          input.priority ??
          existing.priority,
        queueName:
          input.queueName !==
          undefined
            ? this.requireText(
                input.queueName,
                'queueName',
              )
            : existing.queueName,
        payload:
          input.payload !==
          undefined
            ? {
                data:
                  this.sanitizeRecord(
                    input.payload,
                  ),
                contentType:
                  'application/json',
                schemaVersion:
                  input.schemaVersion ??
                  existing.payload
                    .schemaVersion,
              }
            : existing.payload,
        configuration: {
          ...existing.configuration,
          enabled:
            input.enabled ??
            existing.configuration
              .enabled,
        },
        tags: {
          tags:
            input.tags !==
            undefined
              ? this.normalizeTags(
                  input.tags,
                )
              : [
                  ...existing.tags
                    .tags,
                ],
          labels:
            input.labels !==
            undefined
              ? this.normalizeLabels(
                  input.labels,
                )
              : {
                  ...existing.tags
                    .labels,
                },
        },
        updatedAt: now,
      };

    return this.saveJob(
      updated,
    );
  }

  transition(
    jobId: string,
    targetState:
      JobState,
    reason?: string,
    requestedBy?: string,
  ): Job {
    const existing =
      this.requireJob(jobId);

    this.stateMachine
      .assertTransition(
        existing.state,
        targetState,
      );

    const now =
      new Date().toISOString();

    const updated =
      this.saveJob({
        ...existing,
        state:
          targetState,
        updatedAt: now,
      });

    this.appendStateTransition(
      updated,
      existing.state,
      targetState,
      now,
      reason,
      requestedBy,
    );

    return updated;
  }

  enqueue(
    jobId: string,
    options: {
      queueName?: string;
      delayMs?: number;
    } = {},
  ): JobExecution {
    const job =
      this.requireJob(jobId);

    if (
      job.state === 'draft'
    ) {
      this.transition(
        jobId,
        options.delayMs &&
        options.delayMs > 0
          ? 'delayed'
          : 'queued',
        'Job enqueued.',
      );
    } else if (
      job.state ===
        'scheduled' ||
      job.state ===
        'waiting' ||
      job.state ===
        'retry_scheduled' ||
      job.state ===
        'paused'
    ) {
      this.transition(
        jobId,
        options.delayMs &&
        options.delayMs > 0
          ? 'delayed'
          : 'queued',
        'Job enqueued.',
      );
    } else if (
      job.state !== 'queued' &&
      job.state !== 'delayed'
    ) {
      throw new Error(
        `Job ${jobId} cannot be enqueued from state ${job.state}.`,
      );
    }

    const currentJob =
      this.requireJob(jobId);

    const now =
      new Date().toISOString();

    const executionId =
      randomUUID();

    const execution:
      JobExecution = {
        id:
          executionId,
        jobId,
        state:
          currentJob.state,
        attemptNumber:
          currentJob.executionCount +
          1,
        queueName:
          options.queueName ??
          currentJob.queueName,
        priority:
          currentJob.priority,
        payload: {
          ...currentJob.payload,
          data: {
            ...currentJob
              .payload.data,
          },
        },
        progress:
          this.createProgress(
            0,
            now,
          ),
        timing: {
          queuedAt: now,
          delayMs:
            options.delayMs,
        },
        correlation: {
          ...currentJob
            .correlation,
        },
        history: [
          {
            attemptNumber:
              currentJob
                .executionCount +
              1,
            executionId,
            state:
              currentJob.state,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

    const executionSnapshot =
      new JobExecutionModel(
        execution,
      ).toContract();

    this.executions.set(
      executionId,
      executionSnapshot,
    );

    this.saveJob({
      ...currentJob,
      currentExecutionId:
        executionId,
      executionCount:
        currentJob
          .executionCount + 1,
      nextExecutionAt:
        options.delayMs &&
        options.delayMs > 0
          ? new Date(
              Date.now() +
              options.delayMs,
            ).toISOString()
          : now,
      updatedAt: now,
    });

    this.appendHistoryEvent(
      jobId,
      {
        executionId,
        type:
          'queued',
        occurredAt: now,
        state:
          currentJob.state,
        message:
          'Job execution queued.',
        metadata: {
          queueName:
            execution.queueName,
          delayMs:
            options.delayMs ?? 0,
        },
      },
    );

    return this.cloneExecution(
      executionSnapshot,
    );
  }

  startExecution(
    executionId: string,
    workerId: string,
    leaseDurationMs =
      60_000,
  ): JobExecution {
    const execution =
      this.requireExecution(
        executionId,
      );

    if (
      !this.stateMachine
        .canStart(
          execution.state,
        )
    ) {
      throw new Error(
        `Execution ${executionId} cannot start from state ${execution.state}.`,
      );
    }

    const normalizedWorkerId =
      this.requireText(
        workerId,
        'workerId',
      );

    const now =
      new Date().toISOString();

    const updatedExecution =
      this.saveExecution({
        ...execution,
        state:
          'running',
        progress:
          this.createProgress(
            execution.progress
              .percentage,
            now,
            execution.progress,
          ),
        timing: {
          ...execution.timing,
          startedAt: now,
        },
        lease: {
          workerId:
            normalizedWorkerId,
          acquiredAt: now,
          expiresAt:
            new Date(
              Date.now() +
              Math.max(
                1,
                leaseDurationMs,
              ),
            ).toISOString(),
        },
        history: [
          ...execution.history,
          {
            attemptNumber:
              execution
                .attemptNumber,
            executionId:
              execution.id,
            state:
              'running',
            startedAt: now,
          },
        ],
        updatedAt: now,
      });

    const job =
      this.requireJob(
        execution.jobId,
      );

    if (
      job.state !== 'running'
    ) {
      this.transition(
        job.id,
        'running',
        'Execution started.',
      );
    }

    this.appendHistoryEvent(
      job.id,
      {
        executionId,
        type:
          'started',
        occurredAt: now,
        state:
          'running',
        message:
          'Job execution started.',
        metadata: {
          workerId:
            normalizedWorkerId,
        },
      },
    );

    return updatedExecution;
  }

  updateProgress(
    executionId: string,
    input: {
      percentage: number;
      currentStep?: string;
      completedUnits?: number;
      totalUnits?: number;
      message?: string;
    },
  ): JobExecution {
    const execution =
      this.requireExecution(
        executionId,
      );

    if (
      execution.state !==
      'running'
    ) {
      throw new Error(
        'Progress can only be updated for a running execution.',
      );
    }

    const now =
      new Date().toISOString();

    const percentage =
      assertJobProgressPercentage(
        input.percentage,
      );

    const progress:
      JobProgress = {
        percentage,
        currentStep:
          this.normalizeText(
            input.currentStep,
          ),
        completedUnits:
          input.completedUnits,
        totalUnits:
          input.totalUnits,
        message:
          input.message
            ? this.sanitizeText(
                input.message,
              )
            : undefined,
        updatedAt: now,
      };

    const updatedExecution =
      this.saveExecution({
        ...execution,
        progress,
        updatedAt: now,
      });

    const job =
      this.requireJob(
        execution.jobId,
      );

    this.saveJob({
      ...job,
      progress,
      updatedAt: now,
    });

    this.appendHistoryEvent(
      job.id,
      {
        executionId,
        type:
          'progress_updated',
        occurredAt: now,
        state:
          'running',
        message:
          progress.message,
        metadata: {
          percentage,
          currentStep:
            progress.currentStep,
        },
      },
    );

    return updatedExecution;
  }

  completeExecution(
    executionId: string,
    input: {
      result?:
        Readonly<
          Record<string, unknown>
        >;
      summary?: string;
      producedResourceIds?:
        readonly string[];
    } = {},
  ): JobExecution {
    const execution =
      this.requireExecution(
        executionId,
      );

    if (
      !this.stateMachine
        .canComplete(
          execution.state,
        )
    ) {
      throw new Error(
        `Execution ${executionId} cannot complete from state ${execution.state}.`,
      );
    }

    const now =
      new Date().toISOString();

    const startedAt =
      execution.timing
        .startedAt;

    const durationMs =
      startedAt
        ? Math.max(
            0,
            new Date(now)
              .getTime() -
            new Date(startedAt)
              .getTime(),
          )
        : undefined;

    const result:
      JobResult = {
        data:
          input.result
            ? this.sanitizeRecord(
                input.result,
              )
            : undefined,
        summary:
          input.summary
            ? this.sanitizeText(
                input.summary,
              )
            : undefined,
        producedResourceIds:
          this.normalizeIdentifiers(
            input
              .producedResourceIds,
          ),
      };

    const updatedExecution =
      this.saveExecution({
        ...execution,
        state:
          'completed',
        outcome:
          'success',
        result,
        progress:
          this.createProgress(
            100,
            now,
            {
              ...execution.progress,
              message:
                'Job completed.',
            },
          ),
        timing: {
          ...execution.timing,
          finishedAt: now,
          durationMs,
        },
        lease:
          undefined,
        updatedAt: now,
      });

    const job =
      this.requireJob(
        execution.jobId,
      );

    const completedJob =
      this.transition(
        job.id,
        'completed',
        'Execution completed.',
      );

    this.saveJob({
      ...completedJob,
      result,
      failure:
        undefined,
      progress:
        updatedExecution
          .progress,
      lastExecutionAt: now,
      nextExecutionAt:
        undefined,
      currentExecutionId:
        executionId,
      updatedAt: now,
    });

    this.appendExecutionHistory(
      updatedExecution,
    );

    this.appendHistoryEvent(
      job.id,
      {
        executionId,
        type:
          'completed',
        occurredAt: now,
        state:
          'completed',
        message:
          result.summary ??
          'Job completed.',
        metadata: {},
      },
    );

    return updatedExecution;
  }

  failExecution(
    executionId: string,
    failure:
      JobFailure,
    retryPolicy?:
      JobRetryPolicy,
  ): JobOperationResultContract {
    const execution =
      this.requireExecution(
        executionId,
      );

    if (
      !this.stateMachine
        .canFail(
          execution.state,
        )
    ) {
      throw new Error(
        `Execution ${executionId} cannot fail from state ${execution.state}.`,
      );
    }

    const now =
      new Date().toISOString();

    const normalizedFailure:
      JobFailure = {
        ...failure,
        message:
          this.sanitizeText(
            this.requireText(
              failure.message,
              'failure.message',
            ),
          ),
        occurredAt:
          failure.occurredAt ??
          now,
        details:
          failure.details
            ? this.sanitizeRecord(
                failure.details,
              )
            : undefined,
      };

    const startedAt =
      execution.timing
        .startedAt;

    const failedExecution =
      this.saveExecution({
        ...execution,
        state:
          'failed',
        outcome:
          'failure',
        failure:
          normalizedFailure,
        timing: {
          ...execution.timing,
          finishedAt: now,
          durationMs:
            startedAt
              ? Math.max(
                  0,
                  new Date(now)
                    .getTime() -
                  new Date(startedAt)
                    .getTime(),
                )
              : undefined,
        },
        lease:
          undefined,
        updatedAt: now,
      });

    const job =
      this.requireJob(
        execution.jobId,
      );

    this.appendExecutionHistory(
      failedExecution,
    );

    const policy =
      retryPolicy ??
      createDefaultJobRetryPolicy();

    const decision =
      evaluateJobRetry({
        attemptNumber:
          execution.attemptNumber,
        failure:
          normalizedFailure,
        policy,
        now,
      });

    if (decision.shouldRetry) {
      const retryJob =
        this.transition(
          job.id,
          'retry_scheduled',
          decision.reason,
        );

      this.saveJob({
        ...retryJob,
        failure:
          normalizedFailure,
        lastExecutionAt: now,
        nextExecutionAt:
          decision.retryAt,
        updatedAt: now,
      });

      const history =
        this.requireHistory(
          job.id,
        );

      this.histories.set(
        job.id,
        appendJobRetryHistory(
          history,
          {
            executionId,
            previousAttemptNumber:
              execution
                .attemptNumber,
            nextAttemptNumber:
              decision
                .nextAttemptNumber!,
            scheduledAt: now,
            retryAt:
              decision.retryAt!,
            delayMs:
              decision.delayMs!,
            reason:
              decision.reason,
            failure:
              normalizedFailure,
          },
        ),
      );

      this.appendHistoryEvent(
        job.id,
        {
          executionId,
          type:
            'retry_scheduled',
          occurredAt: now,
          state:
            'retry_scheduled',
          message:
            decision.reason,
          metadata: {
            failureKind:
              normalizedFailure.kind,
            failureCode:
              normalizedFailure.code,
            retryAt:
              decision.retryAt,
            delayMs:
              decision.delayMs,
          },
        },
      );

      return {
        successful: true,
        jobId:
          job.id,
        executionId,
        state:
          'retry_scheduled',
        message:
          decision.reason,
        job:
          this.requireJob(
            job.id,
          ),
        execution:
          failedExecution,
      };
    }

    const failedJob =
      this.transition(
        job.id,
        'failed',
        normalizedFailure
          .message,
      );

    this.saveJob({
      ...failedJob,
      failure:
        normalizedFailure,
      lastExecutionAt: now,
      nextExecutionAt:
        undefined,
      updatedAt: now,
    });

    this.appendHistoryEvent(
      job.id,
      {
        executionId,
        type:
          'failed',
        occurredAt: now,
        state:
          'failed',
        message:
          normalizedFailure
            .message,
        metadata: {
          failureKind:
            normalizedFailure.kind,
          failureCode:
            normalizedFailure.code,
          retryDecision:
            decision.reason,
        },
      },
    );

    return {
      successful: false,
      jobId:
        job.id,
      executionId,
      state:
        'failed',
      message:
        decision.reason,
      job:
        this.requireJob(
          job.id,
        ),
      execution:
        failedExecution,
    };
  }

  pause(
    jobId: string,
    reason?: string,
    requestedBy?: string,
  ): Job {
    const job =
      this.requireJob(jobId);

    if (
      !this.stateMachine
        .canPause(job.state)
    ) {
      throw new Error(
        `Job ${jobId} cannot be paused from state ${job.state}.`,
      );
    }

    return this.transition(
      jobId,
      'paused',
      reason ??
        'Job paused.',
      requestedBy,
    );
  }

  resume(
    jobId: string,
  ): Job {
    const job =
      this.requireJob(jobId);

    if (
      !this.stateMachine
        .canResume(job.state)
    ) {
      throw new Error(
        `Job ${jobId} cannot be resumed from state ${job.state}.`,
      );
    }

    return this.transition(
      jobId,
      'queued',
      'Job resumed.',
    );
  }

  cancel(
    jobId: string,
    reason?: string,
    requestedBy?: string,
  ): Job {
    const job =
      this.requireJob(jobId);

    if (
      !this.stateMachine
        .canCancel(job.state)
    ) {
      throw new Error(
        `Job ${jobId} cannot be cancelled from state ${job.state}.`,
      );
    }

    const cancelled =
      this.transition(
        jobId,
        'cancelled',
        reason ??
          'Job cancelled.',
        requestedBy,
      );

    const executionId =
      cancelled
        .currentExecutionId;

    if (executionId) {
      const execution =
        this.executions.get(
          executionId,
        );

      if (
        execution &&
        !this.stateMachine
          .isTerminal(
            execution.state,
          )
      ) {
        const now =
          new Date().toISOString();

        this.saveExecution({
          ...execution,
          state:
            'cancelled',
          outcome:
            'cancelled',
          timing: {
            ...execution.timing,
            finishedAt: now,
          },
          lease:
            undefined,
          updatedAt: now,
        });
      }
    }

    return cancelled;
  }

  retry(
    jobId: string,
    delayMs = 0,
  ): JobExecution {
    const job =
      this.requireJob(jobId);

    if (
      !this.stateMachine
        .canRetry(job.state)
    ) {
      throw new Error(
        `Job ${jobId} cannot be retried from state ${job.state}.`,
      );
    }

    if (
      job.state === 'failed'
    ) {
      this.transition(
        jobId,
        'retry_scheduled',
        'Manual retry scheduled.',
      );
    }

    return this.enqueue(
      jobId,
      {
        delayMs:
          Math.max(
            0,
            delayMs,
          ),
      },
    );
  }

  delete(
    jobId: string,
  ): boolean {
    const job =
      this.requireJob(jobId);

    if (
      !this.stateMachine
        .isTerminal(job.state) &&
      job.state !== 'draft'
    ) {
      throw new Error(
        `Active job ${jobId} cannot be deleted.`,
      );
    }

    for (
      const [
        executionId,
        execution,
      ] of this.executions
    ) {
      if (
        execution.jobId ===
        jobId
      ) {
        this.executions.delete(
          executionId,
        );
      }
    }

    this.histories.delete(
      jobId,
    );

    return this.jobs.delete(
      jobId,
    );
  }

  metrics():
    JobMetrics {
    return calculateJobMetrics({
      jobs:
        this.list(),
      executions:
        this.listExecutions(),
      schedules: [],
      queues: [
        ...this.queues
          .values(),
      ],
    });
  }

  clear(): void {
    this.jobs.clear();
    this.executions.clear();
    this.histories.clear();
    this.queues.clear();
  }

  private saveJob(
    job: Job,
  ): Job {
    const snapshot =
      new JobModel(job)
        .toContract();

    this.jobs.set(
      job.id,
      snapshot,
    );

    return this.cloneJob(
      snapshot,
    );
  }

  private saveExecution(
    execution:
      JobExecution,
  ): JobExecution {
    const snapshot =
      new JobExecutionModel(
        execution,
      ).toContract();

    this.executions.set(
      execution.id,
      snapshot,
    );

    return this.cloneExecution(
      snapshot,
    );
  }

  private appendStateTransition(
    job: Job,
    from: JobState,
    to: JobState,
    transitionedAt: string,
    reason?: string,
    requestedBy?: string,
  ): void {
    const history =
      this.requireHistory(
        job.id,
      );

    this.histories.set(
      job.id,
      appendJobStateTransition(
        history,
        {
          from,
          to,
          transitionedAt,
          reason:
            this.normalizeText(
              reason,
            ),
          requestedBy:
            this.normalizeIdentifier(
              requestedBy,
            ),
        },
      ),
    );
  }

  private appendHistoryEvent(
    jobId: string,
    input: {
      executionId?: string;
      type:
        Parameters<
          typeof appendJobHistoryEvent
        >[1]['type'];
      occurredAt: string;
      state?: JobState;
      message?: string;
      metadata:
        Readonly<
          Record<string, unknown>
        >;
    },
  ): void {
    const job =
      this.requireJob(jobId);

    const history =
      this.requireHistory(jobId);

    this.histories.set(
      jobId,
      appendJobHistoryEvent(
        history,
        {
          id:
            randomUUID(),
          jobId,
          executionId:
            input.executionId,
          type:
            input.type,
          occurredAt:
            input.occurredAt,
          state:
            input.state,
          message:
            input.message
              ? this.sanitizeText(
                  input.message,
                )
              : undefined,
          correlation: {
            ...job.correlation,
          },
          metadata:
            this.sanitizeRecord(
              input.metadata,
            ),
        },
      ),
    );
  }

  private appendExecutionHistory(
    execution:
      JobExecution,
  ): void {
    const history =
      this.requireHistory(
        execution.jobId,
      );

    this.histories.set(
      execution.jobId,
      appendJobExecutionHistory(
        history,
        {
          executionId:
            execution.id,
          attemptNumber:
            execution
              .attemptNumber,
          state:
            execution.state,
          outcome:
            execution.outcome,
          queuedAt:
            execution.timing
              .queuedAt,
          startedAt:
            execution.timing
              .startedAt,
          finishedAt:
            execution.timing
              .finishedAt,
          durationMs:
            execution.timing
              .durationMs,
          workerId:
            execution.lease
              ?.workerId,
          failure:
            execution.failure,
        },
        execution.updatedAt,
      ),
    );
  }

  private requireJob(
    jobId: string,
  ): Job {
    const job =
      this.jobs.get(jobId);

    if (!job) {
      throw new Error(
        `Job ${jobId} was not found.`,
      );
    }

    return this.cloneJob(job);
  }

  private requireExecution(
    executionId: string,
  ): JobExecution {
    const execution =
      this.executions.get(
        executionId,
      );

    if (!execution) {
      throw new Error(
        `Job execution ${executionId} was not found.`,
      );
    }

    return this.cloneExecution(
      execution,
    );
  }

  private requireHistory(
    jobId: string,
  ): JobHistory {
    const history =
      this.histories.get(
        jobId,
      );

    if (!history) {
      throw new Error(
        `Job history ${jobId} was not found.`,
      );
    }

    return new JobHistoryModel(
      history,
    ).toContract();
  }

  private createConfiguration(
    input?:
      CreateJobInput[
        'configuration'
      ],
  ): Job[
    'configuration'
  ] {
    return {
      timeout: {
        timeoutMs:
          input?.timeout
            ?.timeoutMs,
        terminateOnTimeout:
          input?.timeout
            ?.terminateOnTimeout ??
          true,
      },
      concurrency: {
        concurrencyKey:
          input?.concurrency
            ?.concurrencyKey,
        maximumConcurrentRuns:
          input?.concurrency
            ?.maximumConcurrentRuns,
        singleton:
          input?.concurrency
            ?.singleton ??
          false,
        replaceExisting:
          input?.concurrency
            ?.replaceExisting ??
          false,
      },
      retention: {
        retainCompletedForMs:
          input?.retention
            ?.retainCompletedForMs,
        retainFailedForMs:
          input?.retention
            ?.retainFailedForMs,
        removeOnComplete:
          input?.retention
            ?.removeOnComplete ??
          false,
        removeOnFailure:
          input?.retention
            ?.removeOnFailure ??
          false,
      },
      maximumAttempts:
        Math.max(
          1,
          input?.maximumAttempts ??
          3,
        ),
      enabled:
        input?.enabled ??
        true,
    };
  }

  private createProgress(
    percentage: number,
    updatedAt: string,
    existing?:
      Partial<JobProgress>,
  ): JobProgress {
    return {
      percentage:
        assertJobProgressPercentage(
          percentage,
        ),
      currentStep:
        existing?.currentStep,
      completedUnits:
        existing?.completedUnits,
      totalUnits:
        existing?.totalUnits,
      message:
        existing?.message,
      updatedAt,
    };
  }

  private normalizeDependencies(
    dependencies?:
      CreateJobInput[
        'dependencies'
      ],
  ): Job[
    'dependencies'
  ] {
    const output =
      new Map<
        string,
        Job[
          'dependencies'
        ][number]
      >();

    for (
      const dependency
      of dependencies ?? []
    ) {
      const jobId =
        this.requireText(
          dependency.jobId,
          'dependency.jobId',
        );

      output.set(
        jobId,
        {
          jobId,
          requiredState:
            'completed',
          optional:
            dependency.optional,
        },
      );
    }

    return [
      ...output.values(),
    ];
  }

  private normalizeTags(
    tags?:
      readonly string[],
  ): readonly string[] {
    return [
      ...new Set(
        (tags ?? [])
          .map(
            (tag) =>
              tag
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ].sort();
  }

  private normalizeLabels(
    labels?:
      Readonly<
        Record<string, string>
      >,
  ):
    Readonly<Record<string, string>> {
    const output:
      Record<string, string> =
        {};

    for (
      const [key, value]
      of Object.entries(
        labels ?? {},
      )
    ) {
      const normalizedKey =
        key.trim();

      const normalizedValue =
        value.trim();

      if (
        normalizedKey &&
        normalizedValue
      ) {
        output[normalizedKey] =
          normalizedValue;
      }
    }

    return output;
  }

  private normalizeIdentifiers(
    values?:
      readonly string[],
  ): readonly string[] {
    return [
      ...new Set(
        (values ?? [])
          .map(
            (value) =>
              value.trim(),
          )
          .filter(Boolean),
      ),
    ];
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value?.trim();

    if (!normalized) {
      throw new Error(
        `Job ${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private normalizeIdentifier(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized ||
      undefined;
  }

  private normalizeText(
    value?: string,
  ): string | undefined {
    const normalized =
      value?.trim();

    return normalized
      ? this.sanitizeText(
          normalized,
        )
      : undefined;
  }

  private sanitizeText(
    value: string,
  ): string {
    return value
      .replace(
        /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"']+/gi,
        '[REDACTED_CONNECTION_STRING]',
      )
      .replace(
        /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
        'Bearer [REDACTED]',
      )
      .replace(
        /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[^\s,;]+/gi,
        '$1=[REDACTED]',
      );
  }

  private sanitizeRecord(
    value:
      Readonly<
        Record<string, unknown>
      >,
  ):
    Readonly<Record<string, unknown>> {
    const output:
      Record<string, unknown> =
        {};

    const sensitive =
      /password|secret|token|authorization|api[-_]?key|database[-_]?url/i;

    for (
      const [key, item]
      of Object.entries(value)
    ) {
      if (sensitive.test(key)) {
        output[key] =
          '[REDACTED]';
      } else if (
        typeof item ===
        'string'
      ) {
        output[key] =
          this.sanitizeText(item);
      } else {
        output[key] =
          item;
      }
    }

    return output;
  }

  private cloneJob(
    job: Job,
  ): Job {
    return new JobModel(
      job,
    ).toContract();
  }

  private cloneExecution(
    execution:
      JobExecution,
  ): JobExecution {
    return new JobExecutionModel(
      execution,
    ).toContract();
  }
}