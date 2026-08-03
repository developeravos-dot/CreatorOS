import {
  Injectable,
} from '@nestjs/common';

import type {
  BulkCancelJobsContract,
  BulkDeleteJobsContract,
  BulkPauseJobsContract,
  BulkResumeJobsContract,
  BulkRetryJobsContract,
  JobBulkOperationFailureContract,
  JobBulkOperationResultContract,
  JobHealthContract,
} from '../contracts';
import {
  JOB_PRIORITIES,
  JOB_STATES,
  JOB_TYPES,
  type Job,
  type JobExecution,
  type JobMetrics,
  type JobPriority,
  type JobState,
  type JobType,
} from '../models';
import {
  JobEngineService,
} from './job-engine.service';
import {
  JobQueryService,
} from './job-query.service';
import {
  JobQueueFactoryService,
} from './job-queue-factory.service';
import {
  JobRetryPolicyService,
} from './job-retry-policy.service';
import {
  JobSchedulerService,
} from './job-scheduler.service';

export interface JobOperationsStatistics {
  readonly totalJobs: number;

  readonly states:
    Readonly<
      Record<JobState, number>
    >;

  readonly priorities:
    Readonly<
      Record<JobPriority, number>
    >;

  readonly types:
    Readonly<
      Record<JobType, number>
    >;

  readonly executions: {
    readonly total: number;
    readonly successful: number;
    readonly failed: number;
    readonly running: number;
    readonly cancelled: number;
    readonly timedOut: number;
    readonly retried: number;
    readonly successRate: number;
    readonly failureRate: number;
    readonly averageDurationMs?: number;
  };

  readonly schedules: {
    readonly total: number;
    readonly enabled: number;
    readonly disabled: number;
    readonly recurring: number;
    readonly cron: number;
    readonly interval: number;
    readonly delayed: number;
    readonly nextRunAt?: string;
  };

  readonly queues: {
    readonly totalQueues: number;
    readonly waiting: number;
    readonly delayed: number;
    readonly active: number;
    readonly failed: number;
    readonly pausedQueues: number;
    readonly totalItems: number;
  };

  readonly retries: {
    readonly evaluations: number;
    readonly approved: number;
    readonly rejected: number;
    readonly maximumAttemptsReached: number;
    readonly nonRetryableFailures: number;
  };

  readonly generatedAt: string;
}

@Injectable()
export class JobOperationsService {
  constructor(
    private readonly jobEngine:
      JobEngineService,

    private readonly scheduler:
      JobSchedulerService,

    private readonly query:
      JobQueryService,

    private readonly queueFactory:
      JobQueueFactoryService,

    private readonly retryPolicy:
      JobRetryPolicyService,
  ) {}

  statistics():
    JobOperationsStatistics {
    const jobs =
      this.jobEngine.list();

    const executions =
      this.jobEngine
        .listExecutions();

    const schedules =
      this.scheduler.list();

    const queueMetrics =
      this.queueFactory
        .aggregateMetrics();

    const retryMetrics =
      this.retryPolicy
        .metrics();

    const states =
      this.createStateCounts();

    const priorities =
      this.createPriorityCounts();

    const types =
      this.createTypeCounts();

    for (const job of jobs) {
      states[job.state] += 1;
      priorities[
        job.priority
      ] += 1;
      types[job.type] += 1;
    }

    const successful =
      executions.filter(
        (execution) =>
          execution.outcome ===
          'success',
      ).length;

    const failed =
      executions.filter(
        (execution) =>
          execution.outcome ===
          'failure',
      ).length;

    const running =
      executions.filter(
        (execution) =>
          execution.state ===
          'running',
      ).length;

    const cancelled =
      executions.filter(
        (execution) =>
          execution.outcome ===
          'cancelled',
      ).length;

    const timedOut =
      executions.filter(
        (execution) =>
          execution.outcome ===
          'timeout',
      ).length;

    const retried =
      executions.filter(
        (execution) =>
          execution.attemptNumber >
          1,
      ).length;

    const durations =
      executions
        .map(
          (execution) =>
            execution.timing
              .durationMs,
        )
        .filter(
          (
            value,
          ): value is number =>
            typeof value ===
              'number' &&
            Number.isFinite(value) &&
            value >= 0,
        );

    const averageDurationMs =
      durations.length > 0
        ? durations.reduce(
            (
              total,
              value,
            ) =>
              total + value,
            0,
          ) /
          durations.length
        : undefined;

    const nextRunAt =
      schedules
        .map(
          (schedule) =>
            schedule.nextRunAt,
        )
        .filter(
          (
            value,
          ): value is string =>
            Boolean(value),
        )
        .sort()[0];

    return {
      totalJobs:
        jobs.length,

      states,

      priorities,

      types,

      executions: {
        total:
          executions.length,
        successful,
        failed,
        running,
        cancelled,
        timedOut,
        retried,
        successRate:
          executions.length > 0
            ? successful /
              executions.length
            : 0,
        failureRate:
          executions.length > 0
            ? failed /
              executions.length
            : 0,
        averageDurationMs,
      },

      schedules: {
        total:
          schedules.length,
        enabled:
          schedules.filter(
            (schedule) =>
              schedule.enabled,
          ).length,
        disabled:
          schedules.filter(
            (schedule) =>
              !schedule.enabled,
          ).length,
        recurring:
          schedules.filter(
            (schedule) =>
              schedule.definition
                .kind ===
                'cron' ||
              schedule.definition
                .kind ===
                'interval',
          ).length,
        cron:
          schedules.filter(
            (schedule) =>
              schedule.definition
                .kind ===
              'cron',
          ).length,
        interval:
          schedules.filter(
            (schedule) =>
              schedule.definition
                .kind ===
              'interval',
          ).length,
        delayed:
          schedules.filter(
            (schedule) =>
              schedule.definition
                .kind ===
              'delayed',
          ).length,
        nextRunAt,
      },

      queues: {
        totalQueues:
          this.queueFactory
            .list().length,
        waiting:
          queueMetrics.waiting,
        delayed:
          queueMetrics.delayed,
        active:
          queueMetrics.active,
        failed:
          queueMetrics.failed,
        pausedQueues:
          queueMetrics.paused,
        totalItems:
          queueMetrics.total,
      },

      retries: {
        evaluations:
          retryMetrics.evaluations,
        approved:
          retryMetrics
            .retriesApproved,
        rejected:
          retryMetrics
            .retriesRejected,
        maximumAttemptsReached:
          retryMetrics
            .maximumAttemptsReached,
        nonRetryableFailures:
          retryMetrics
            .nonRetryableFailures,
      },

      generatedAt:
        new Date().toISOString(),
    };
  }

  metrics(): JobMetrics {
    return this.jobEngine
      .metrics();
  }

  health(): JobHealthContract {
    const jobs =
      this.jobEngine.list();

    const executions =
      this.jobEngine
        .listExecutions();

    const queueItems =
      this.queueFactory
        .list()
        .flatMap(
          (adapter) =>
            adapter.list(),
        );

    const now =
      Date.now();

    const stalledExecutions =
      executions.filter(
        (execution) => {
          if (
            execution.state !==
            'running' ||
            !execution.lease
              ?.expiresAt
          ) {
            return false;
          }

          return (
            new Date(
              execution.lease
                .expiresAt,
            ).getTime() <
            now
          );
        },
      ).length;

    const expiredLeases =
      queueItems.filter(
        (item) =>
          item.state ===
            'running' &&
          Boolean(
            item.leaseExpiresAt,
          ) &&
          new Date(
            item.leaseExpiresAt!,
          ).getTime() <
            now,
      ).length;

    const failedJobs =
      jobs.filter(
        (job) =>
          job.state ===
          'failed',
      ).length;

    const deadLetteredJobs =
      jobs.filter(
        (job) =>
          job.state ===
          'dead_lettered',
      ).length;

    const delayedJobs =
      jobs.filter(
        (job) =>
          job.state ===
          'delayed',
      ).length;

    const pendingRetries =
      jobs.filter(
        (job) =>
          job.state ===
          'retry_scheduled',
      ).length;

    const activeJobs =
      jobs.filter(
        (job) =>
          [
            'scheduled',
            'queued',
            'waiting',
            'delayed',
            'running',
            'retry_scheduled',
            'paused',
          ].includes(
            job.state,
          ),
      ).length;

    let status:
      JobHealthContract[
        'status'
      ] = 'healthy';

    if (
      stalledExecutions > 0 ||
      expiredLeases > 0 ||
      deadLetteredJobs > 0
    ) {
      status =
        'unhealthy';
    } else if (
      failedJobs > 0 ||
      pendingRetries > 0
    ) {
      status =
        'degraded';
    }

    return {
      status,
      totalJobs:
        jobs.length,
      activeJobs,
      failedJobs,
      deadLetteredJobs,
      stalledExecutions,
      expiredLeases,
      delayedJobs,
      pendingRetries,
      generatedAt:
        new Date().toISOString(),
    };
  }

  bulkPause(
    input:
      BulkPauseJobsContract,
  ): JobBulkOperationResultContract {
    return this.executeBulk(
      input.jobIds,
      (jobId) => {
        this.jobEngine.pause(
          jobId,
          input.reason,
          input.requestedBy,
        );
      },
    );
  }

  bulkResume(
    input:
      BulkResumeJobsContract,
  ): JobBulkOperationResultContract {
    return this.executeBulk(
      input.jobIds,
      (jobId) => {
        const resumed =
          this.jobEngine.resume(
            jobId,
          );

        if (
          input.enqueueImmediately &&
          resumed.state ===
          'queued' &&
          !resumed
            .currentExecutionId
        ) {
          this.jobEngine.enqueue(
            jobId,
          );
        }
      },
    );
  }

  bulkCancel(
    input:
      BulkCancelJobsContract,
  ): JobBulkOperationResultContract {
    return this.executeBulk(
      input.jobIds,
      (jobId) => {
        this.jobEngine.cancel(
          jobId,
          input.reason,
          input.requestedBy,
        );
      },
    );
  }

  bulkRetry(
    input:
      BulkRetryJobsContract,
  ): JobBulkOperationResultContract {
    return this.executeBulk(
      input.jobIds,
      (jobId) => {
        this.jobEngine.retry(
          jobId,
          input.delayMs ?? 0,
        );
      },
    );
  }

  bulkDelete(
    input:
      BulkDeleteJobsContract,
  ): JobBulkOperationResultContract {
    return this.executeBulk(
      input.jobIds,
      (jobId) => {
        const job =
          this.jobEngine.getById(
            jobId,
          );

        if (!job) {
          throw new Error(
            `Job ${jobId} was not found.`,
          );
        }

        if (
          !input.force &&
          ![
            'draft',
            'completed',
            'failed',
            'cancelled',
            'dead_lettered',
            'expired',
          ].includes(
            job.state,
          )
        ) {
          throw new Error(
            `Active job ${jobId} requires force deletion.`,
          );
        }

        for (
          const schedule
          of this.scheduler
            .getByJobId(
              jobId,
            )
        ) {
          this.scheduler
            .deleteSchedule(
              schedule.id,
            );
        }

        this.jobEngine.delete(
          jobId,
        );
      },
    );
  }

  delayedJobs():
    readonly Job[] {
    return this.query
      .findDelayedJobs();
  }

  failedJobs():
    readonly Job[] {
    return this.query
      .findFailedJobs();
  }

  pendingRetries():
    readonly Job[] {
    return this.query
      .findPendingRetries();
  }

  runningJobs():
    readonly Job[] {
    return this.query
      .findRunningJobs();
  }

  scheduledJobs():
    readonly Job[] {
    return this.query
      .findScheduledJobs();
  }

  executions():
    readonly JobExecution[] {
    return this.jobEngine
      .listExecutions();
  }

  private executeBulk(
    jobIds:
      readonly string[],
    operation:
      (jobId: string) => void,
  ): JobBulkOperationResultContract {
    const normalizedIds =
      [
        ...new Set(
          jobIds
            .map(
              (jobId) =>
                jobId.trim(),
            )
            .filter(Boolean),
        ),
      ];

    const successfulIds:
      string[] = [];

    const failures:
      JobBulkOperationFailureContract[] =
        [];

    for (
      const jobId
      of normalizedIds
    ) {
      try {
        operation(jobId);

        successfulIds.push(
          jobId,
        );
      } catch (error) {
        failures.push({
          jobId,
          message:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }
    }

    return {
      requested:
        normalizedIds.length,
      successful:
        successfulIds.length,
      failed:
        failures.length,
      jobIds:
        successfulIds,
      failures,
    };
  }

  private createStateCounts():
    Record<JobState, number> {
    return Object.fromEntries(
      JOB_STATES.map(
        (state) => [
          state,
          0,
        ],
      ),
    ) as Record<
      JobState,
      number
    >;
  }

  private createPriorityCounts():
    Record<JobPriority, number> {
    return Object.fromEntries(
      JOB_PRIORITIES.map(
        (priority) => [
          priority,
          0,
        ],
      ),
    ) as Record<
      JobPriority,
      number
    >;
  }

  private createTypeCounts():
    Record<JobType, number> {
    return Object.fromEntries(
      JOB_TYPES.map(
        (type) => [
          type,
          0,
        ],
      ),
    ) as Record<
      JobType,
      number
    >;
  }
}