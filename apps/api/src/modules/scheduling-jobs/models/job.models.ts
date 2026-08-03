/**
 * Canonical lifecycle states for scheduled and queued jobs.
 *
 * Transition validation will be implemented by JobStateMachineService.
 */
export const JOB_STATES = [
  'draft',
  'scheduled',
  'queued',
  'waiting',
  'delayed',
  'running',
  'retry_scheduled',
  'paused',
  'completed',
  'failed',
  'cancelled',
  'dead_lettered',
  'expired',
] as const;

export type JobState =
  (typeof JOB_STATES)[number];

/**
 * States in which a job may still continue or be acted upon.
 */
export const ACTIVE_JOB_STATES = [
  'scheduled',
  'queued',
  'waiting',
  'delayed',
  'running',
  'retry_scheduled',
  'paused',
] as const satisfies
  readonly JobState[];

export type ActiveJobState =
  (typeof ACTIVE_JOB_STATES)[number];

/**
 * Terminal states cannot transition back to an active state unless
 * a later recovery operation creates a new execution or job record.
 */
export const TERMINAL_JOB_STATES = [
  'completed',
  'cancelled',
  'dead_lettered',
  'expired',
] as const satisfies
  readonly JobState[];

export type TerminalJobState =
  (typeof TERMINAL_JOB_STATES)[number];

export function isJobState(
  value: unknown,
): value is JobState {
  return (
    typeof value === 'string' &&
    (
      JOB_STATES as
        readonly string[]
    ).includes(value)
  );
}

export function isActiveJobState(
  value: JobState,
): value is ActiveJobState {
  return (
    ACTIVE_JOB_STATES as
      readonly JobState[]
  ).includes(value);
}

export function isTerminalJobState(
  value: JobState,
): value is TerminalJobState {
  return (
    TERMINAL_JOB_STATES as
      readonly JobState[]
  ).includes(value);
}

/**
 * Queue priority classification.
 *
 * A separate numeric rank is provided to ensure deterministic sorting
 * without relying on alphabetical string ordering.
 */
export const JOB_PRIORITIES = [
  'lowest',
  'low',
  'normal',
  'high',
  'urgent',
  'critical',
] as const;

export type JobPriority =
  (typeof JOB_PRIORITIES)[number];

export const JOB_PRIORITY_RANK:
  Readonly<
    Record<JobPriority, number>
  > = {
    lowest: 10,
    low: 20,
    normal: 30,
    high: 40,
    urgent: 50,
    critical: 60,
  };

export function isJobPriority(
  value: unknown,
): value is JobPriority {
  return (
    typeof value === 'string' &&
    (
      JOB_PRIORITIES as
        readonly string[]
    ).includes(value)
  );
}

export function compareJobPriorities(
  left: JobPriority,
  right: JobPriority,
): number {
  return (
    JOB_PRIORITY_RANK[left] -
    JOB_PRIORITY_RANK[right]
  );
}

/**
 * Semantic job categories used by CreatorOS.
 *
 * "custom" is retained for externally registered capabilities and
 * future modules without weakening the canonical built-in categories.
 */
export const JOB_TYPES = [
  'one_time',
  'delayed',
  'recurring',
  'cron',
  'workflow',
  'capability',
  'content_generation',
  'content_publishing',
  'notification',
  'monitoring',
  'maintenance',
  'data_processing',
  'integration',
  'cleanup',
  'custom',
] as const;

export type JobType =
  (typeof JOB_TYPES)[number];

export function isJobType(
  value: unknown,
): value is JobType {
  return (
    typeof value === 'string' &&
    (
      JOB_TYPES as
        readonly string[]
    ).includes(value)
  );
}

/**
 * Defines the scheduling mechanism used by a job.
 */
export const JOB_SCHEDULE_KINDS = [
  'immediate',
  'delayed',
  'cron',
  'interval',
  'manual',
] as const;

export type JobScheduleKind =
  (typeof JOB_SCHEDULE_KINDS)[number];

/**
 * Defines the queue implementation selected for execution.
 *
 * BullMQ is available in the repository, while the in-memory adapter
 * remains useful for deterministic tests and local development.
 */
export const JOB_QUEUE_DRIVERS = [
  'memory',
  'bullmq',
] as const;

export type JobQueueDriver =
  (typeof JOB_QUEUE_DRIVERS)[number];

export const JOB_EXECUTION_OUTCOMES = [
  'success',
  'failure',
  'cancelled',
  'timeout',
  'expired',
  'unknown',
] as const;

export type JobExecutionOutcome =
  (typeof JOB_EXECUTION_OUTCOMES)[number];

export const JOB_FAILURE_KINDS = [
  'validation',
  'execution',
  'timeout',
  'dependency',
  'infrastructure',
  'rate_limit',
  'cancelled',
  'unknown',
] as const;

export type JobFailureKind =
  (typeof JOB_FAILURE_KINDS)[number];

/**
 * Backoff methods supported by retry policies.
 */
export const JOB_BACKOFF_STRATEGIES = [
  'none',
  'fixed',
  'linear',
  'exponential',
] as const;

export type JobBackoffStrategy =
  (typeof JOB_BACKOFF_STRATEGIES)[number];

export interface JobIdentity {
  readonly id: string;
  readonly name: string;
  readonly type: JobType;
}

export interface JobTimestamps {
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface JobCorrelation {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly traceId?: string;
  readonly parentJobId?: string;
}

export interface JobOwnership {
  readonly createdBy?: string;
  readonly ownerType?:
    | 'user'
    | 'service'
    | 'agent'
    | 'system';
  readonly tenantId?: string;
  readonly workspaceId?: string;
}

export interface JobPayload {
  readonly data:
    Readonly<Record<string, unknown>>;
  readonly contentType:
    'application/json';
  readonly schemaVersion?: string;
}

export interface JobResult {
  readonly data?:
    Readonly<Record<string, unknown>>;
  readonly summary?: string;
  readonly producedResourceIds:
    readonly string[];
}

export interface JobFailure {
  readonly kind:
    JobFailureKind;
  readonly code?: string;
  readonly message: string;
  readonly retryable: boolean;
  readonly occurredAt: string;
  readonly details?:
    Readonly<Record<string, unknown>>;
}

export interface JobProgress {
  readonly percentage: number;
  readonly currentStep?: string;
  readonly completedUnits?: number;
  readonly totalUnits?: number;
  readonly message?: string;
  readonly updatedAt: string;
}

export interface JobTagSet {
  readonly tags:
    readonly string[];
  readonly labels:
    Readonly<Record<string, string>>;
}

export interface JobTimeoutPolicy {
  readonly timeoutMs?: number;
  readonly terminateOnTimeout: boolean;
}

export interface JobConcurrencyPolicy {
  readonly concurrencyKey?: string;
  readonly maximumConcurrentRuns?: number;
  readonly singleton: boolean;
  readonly replaceExisting: boolean;
}

export interface JobRetentionPolicy {
  readonly retainCompletedForMs?: number;
  readonly retainFailedForMs?: number;
  readonly removeOnComplete: boolean;
  readonly removeOnFailure: boolean;
}

export interface JobExecutionContext {
  readonly executionId: string;
  readonly jobId: string;
  readonly queueName: string;
  readonly attemptNumber: number;
  readonly startedAt: string;
  readonly workerId?: string;
  readonly correlation:
    JobCorrelation;
}

export interface JobCommandMetadata {
  readonly requestedAt: string;
  readonly requestedBy?: string;
  readonly reason?: string;
}

export interface JobCancellationRequest
  extends JobCommandMetadata {
  readonly force: boolean;
}

export interface JobPauseRequest
  extends JobCommandMetadata {
  readonly pauseRunningExecution:
    boolean;
}

export interface JobResumeRequest
  extends JobCommandMetadata {
  readonly enqueueImmediately:
    boolean;
}

export interface JobRetryRequest
  extends JobCommandMetadata {
  readonly resetAttemptCount:
    boolean;
  readonly delayMs?: number;
}

export interface JobDependency {
  readonly jobId: string;
  readonly requiredState:
    Extract<
      JobState,
      'completed'
    >;
  readonly optional: boolean;
}

export interface JobExecutionLease {
  readonly workerId: string;
  readonly acquiredAt: string;
  readonly expiresAt: string;
  readonly heartbeatAt?: string;
}

export interface JobExecutionTiming {
  readonly queuedAt?: string;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly delayMs?: number;
}

export interface JobExecutionAttempt {
  readonly attemptNumber: number;
  readonly executionId: string;
  readonly state: JobState;
  readonly outcome?:
    JobExecutionOutcome;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly failure?: JobFailure;
}

export interface JobExecution {
  readonly id: string;
  readonly jobId: string;
  readonly state: JobState;
  readonly outcome?:
    JobExecutionOutcome;
  readonly attemptNumber: number;
  readonly queueName: string;
  readonly priority:
    JobPriority;
  readonly payload:
    JobPayload;
  readonly result?: JobResult;
  readonly failure?: JobFailure;
  readonly progress:
    JobProgress;
  readonly timing:
    JobExecutionTiming;
  readonly lease?:
    JobExecutionLease;
  readonly correlation:
    JobCorrelation;
  readonly history:
    readonly JobExecutionAttempt[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface JobConfiguration {
  readonly timeout:
    JobTimeoutPolicy;
  readonly concurrency:
    JobConcurrencyPolicy;
  readonly retention:
    JobRetentionPolicy;
  readonly maximumAttempts: number;
  readonly enabled: boolean;
}

export interface Job {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly type: JobType;
  readonly state: JobState;
  readonly priority:
    JobPriority;
  readonly queueName: string;
  readonly payload:
    JobPayload;
  readonly configuration:
    JobConfiguration;
  readonly correlation:
    JobCorrelation;
  readonly ownership:
    JobOwnership;
  readonly dependencies:
    readonly JobDependency[];
  readonly currentExecutionId?: string;
  readonly executionCount: number;
  readonly lastExecutionAt?: string;
  readonly nextExecutionAt?: string;
  readonly progress:
    JobProgress;
  readonly result?: JobResult;
  readonly failure?: JobFailure;
  readonly tags:
    JobTagSet;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateJobInput {
  readonly id?: string;
  readonly name: string;
  readonly description?: string;
  readonly type?: JobType;
  readonly priority?: JobPriority;
  readonly queueName?: string;
  readonly payload?:
    Readonly<Record<string, unknown>>;
  readonly schemaVersion?: string;
  readonly configuration?:
    Partial<JobConfiguration>;
  readonly correlation?:
    JobCorrelation;
  readonly ownership?:
    JobOwnership;
  readonly dependencies?:
    readonly JobDependency[];
  readonly tags?:
    readonly string[];
  readonly labels?:
    Readonly<Record<string, string>>;
}

export interface CreateJobExecutionInput {
  readonly id?: string;
  readonly jobId: string;
  readonly queueName: string;
  readonly priority:
    JobPriority;
  readonly payload:
    JobPayload;
  readonly attemptNumber: number;
  readonly correlation:
    JobCorrelation;
  readonly workerId?: string;
  readonly leaseExpiresAt?: string;
}

export class JobModel
  implements Job {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly type: JobType;
  readonly state: JobState;
  readonly priority:
    JobPriority;
  readonly queueName: string;
  readonly payload:
    JobPayload;
  readonly configuration:
    JobConfiguration;
  readonly correlation:
    JobCorrelation;
  readonly ownership:
    JobOwnership;
  readonly dependencies:
    readonly JobDependency[];
  readonly currentExecutionId?: string;
  readonly executionCount: number;
  readonly lastExecutionAt?: string;
  readonly nextExecutionAt?: string;
  readonly progress:
    JobProgress;
  readonly result?: JobResult;
  readonly failure?: JobFailure;
  readonly tags:
    JobTagSet;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    job: Job,
  ) {
    this.id =
      job.id;

    this.name =
      job.name;

    this.description =
      job.description;

    this.type =
      job.type;

    this.state =
      job.state;

    this.priority =
      job.priority;

    this.queueName =
      job.queueName;

    this.payload = {
      ...job.payload,
      data: {
        ...job.payload.data,
      },
    };

    this.configuration = {
      ...job.configuration,
      timeout: {
        ...job.configuration.timeout,
      },
      concurrency: {
        ...job.configuration
          .concurrency,
      },
      retention: {
        ...job.configuration.retention,
      },
    };

    this.correlation = {
      ...job.correlation,
    };

    this.ownership = {
      ...job.ownership,
    };

    this.dependencies =
      job.dependencies.map(
        (dependency) => ({
          ...dependency,
        }),
      );

    this.currentExecutionId =
      job.currentExecutionId;

    this.executionCount =
      job.executionCount;

    this.lastExecutionAt =
      job.lastExecutionAt;

    this.nextExecutionAt =
      job.nextExecutionAt;

    this.progress = {
      ...job.progress,
    };

    this.result =
      job.result
        ? {
            ...job.result,
            data:
              job.result.data
                ? {
                    ...job.result.data,
                  }
                : undefined,
            producedResourceIds: [
              ...job.result
                .producedResourceIds,
            ],
          }
        : undefined;

    this.failure =
      job.failure
        ? {
            ...job.failure,
            details:
              job.failure.details
                ? {
                    ...job.failure
                      .details,
                  }
                : undefined,
          }
        : undefined;

    this.tags = {
      tags: [
        ...job.tags.tags,
      ],
      labels: {
        ...job.tags.labels,
      },
    };

    this.createdAt =
      job.createdAt;

    this.updatedAt =
      job.updatedAt;
  }

  toContract(): Job {
    return new JobModelSnapshot(
      this,
    ).toContract();
  }
}

class JobModelSnapshot {
  constructor(
    private readonly job: Job,
  ) {}

  toContract(): Job {
    return {
      ...this.job,
      payload: {
        ...this.job.payload,
        data: {
          ...this.job.payload.data,
        },
      },
      configuration: {
        ...this.job.configuration,
        timeout: {
          ...this.job
            .configuration.timeout,
        },
        concurrency: {
          ...this.job
            .configuration
            .concurrency,
        },
        retention: {
          ...this.job
            .configuration.retention,
        },
      },
      correlation: {
        ...this.job.correlation,
      },
      ownership: {
        ...this.job.ownership,
      },
      dependencies:
        this.job.dependencies.map(
          (dependency) => ({
            ...dependency,
          }),
        ),
      progress: {
        ...this.job.progress,
      },
      result:
        this.job.result
          ? {
              ...this.job.result,
              data:
                this.job.result.data
                  ? {
                      ...this.job
                        .result.data,
                    }
                  : undefined,
              producedResourceIds: [
                ...this.job.result
                  .producedResourceIds,
              ],
            }
          : undefined,
      failure:
        this.job.failure
          ? {
              ...this.job.failure,
              details:
                this.job.failure
                  .details
                  ? {
                      ...this.job
                        .failure.details,
                    }
                  : undefined,
            }
          : undefined,
      tags: {
        tags: [
          ...this.job.tags.tags,
        ],
        labels: {
          ...this.job.tags.labels,
        },
      },
    };
  }
}

export class JobExecutionModel
  implements JobExecution {
  readonly id: string;
  readonly jobId: string;
  readonly state: JobState;
  readonly outcome?:
    JobExecutionOutcome;
  readonly attemptNumber: number;
  readonly queueName: string;
  readonly priority:
    JobPriority;
  readonly payload:
    JobPayload;
  readonly result?: JobResult;
  readonly failure?: JobFailure;
  readonly progress:
    JobProgress;
  readonly timing:
    JobExecutionTiming;
  readonly lease?:
    JobExecutionLease;
  readonly correlation:
    JobCorrelation;
  readonly history:
    readonly JobExecutionAttempt[];
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    execution:
      JobExecution,
  ) {
    this.id =
      execution.id;

    this.jobId =
      execution.jobId;

    this.state =
      execution.state;

    this.outcome =
      execution.outcome;

    this.attemptNumber =
      execution.attemptNumber;

    this.queueName =
      execution.queueName;

    this.priority =
      execution.priority;

    this.payload = {
      ...execution.payload,
      data: {
        ...execution.payload.data,
      },
    };

    this.result =
      execution.result
        ? {
            ...execution.result,
            data:
              execution.result.data
                ? {
                    ...execution.result
                      .data,
                  }
                : undefined,
            producedResourceIds: [
              ...execution.result
                .producedResourceIds,
            ],
          }
        : undefined;

    this.failure =
      execution.failure
        ? {
            ...execution.failure,
            details:
              execution.failure
                .details
                ? {
                    ...execution.failure
                      .details,
                  }
                : undefined,
          }
        : undefined;

    this.progress = {
      ...execution.progress,
    };

    this.timing = {
      ...execution.timing,
    };

    this.lease =
      execution.lease
        ? {
            ...execution.lease,
          }
        : undefined;

    this.correlation = {
      ...execution.correlation,
    };

    this.history =
      execution.history.map(
        (attempt) => ({
          ...attempt,
          failure:
            attempt.failure
              ? {
                  ...attempt.failure,
                  details:
                    attempt.failure
                      .details
                      ? {
                          ...attempt
                            .failure
                            .details,
                        }
                      : undefined,
                }
              : undefined,
        }),
      );

    this.createdAt =
      execution.createdAt;

    this.updatedAt =
      execution.updatedAt;
  }

  toContract():
    JobExecution {
    return {
      id:
        this.id,
      jobId:
        this.jobId,
      state:
        this.state,
      outcome:
        this.outcome,
      attemptNumber:
        this.attemptNumber,
      queueName:
        this.queueName,
      priority:
        this.priority,
      payload: {
        ...this.payload,
        data: {
          ...this.payload.data,
        },
      },
      result:
        this.result
          ? {
              ...this.result,
              data:
                this.result.data
                  ? {
                      ...this.result.data,
                    }
                  : undefined,
              producedResourceIds: [
                ...this.result
                  .producedResourceIds,
              ],
            }
          : undefined,
      failure:
        this.failure
          ? {
              ...this.failure,
              details:
                this.failure.details
                  ? {
                      ...this.failure
                        .details,
                    }
                  : undefined,
            }
          : undefined,
      progress: {
        ...this.progress,
      },
      timing: {
        ...this.timing,
      },
      lease:
        this.lease
          ? {
              ...this.lease,
            }
          : undefined,
      correlation: {
        ...this.correlation,
      },
      history:
        this.history.map(
          (attempt) => ({
            ...attempt,
            failure:
              attempt.failure
                ? {
                    ...attempt.failure,
                    details:
                      attempt.failure
                        .details
                        ? {
                            ...attempt
                              .failure
                              .details,
                          }
                        : undefined,
                  }
                : undefined,
          }),
        ),
      createdAt:
        this.createdAt,
      updatedAt:
        this.updatedAt,
    };
  }
}
export interface JobImmediateSchedule {
  readonly kind:
    'immediate';
  readonly enqueueAt:
    string;
}

export interface JobDelayedSchedule {
  readonly kind:
    'delayed';
  readonly runAt: string;
  readonly delayMs: number;
}

export interface JobCronSchedule {
  readonly kind:
    'cron';
  readonly expression: string;
  readonly timezone: string;
  readonly startAt?: string;
  readonly endAt?: string;
  readonly maximumRuns?: number;
}

export interface JobIntervalSchedule {
  readonly kind:
    'interval';
  readonly intervalMs: number;
  readonly startAt: string;
  readonly endAt?: string;
  readonly maximumRuns?: number;
  readonly runImmediately: boolean;
}

export interface JobManualSchedule {
  readonly kind:
    'manual';
}

export type JobScheduleDefinition =
  | JobImmediateSchedule
  | JobDelayedSchedule
  | JobCronSchedule
  | JobIntervalSchedule
  | JobManualSchedule;

export interface JobSchedule {
  readonly id: string;
  readonly jobId: string;
  readonly definition:
    JobScheduleDefinition;
  readonly enabled: boolean;
  readonly runCount: number;
  readonly lastRunAt?: string;
  readonly nextRunAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateJobScheduleInput {
  readonly id?: string;
  readonly jobId: string;
  readonly definition:
    JobScheduleDefinition;
  readonly enabled?: boolean;
}

export interface JobQueueConfiguration {
  readonly driver:
    JobQueueDriver;
  readonly concurrency: number;
  readonly rateLimitPerSecond?: number;
  readonly defaultPriority:
    JobPriority;
  readonly paused: boolean;
  readonly removeCompletedJobs:
    boolean;
  readonly removeFailedJobs:
    boolean;
}

export interface JobQueueMetrics {
  readonly waiting: number;
  readonly delayed: number;
  readonly active: number;
  readonly completed: number;
  readonly failed: number;
  readonly paused: number;
  readonly total: number;
  readonly generatedAt: string;
}

export interface JobQueue {
  readonly name: string;
  readonly description?: string;
  readonly configuration:
    JobQueueConfiguration;
  readonly metrics:
    JobQueueMetrics;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateJobQueueInput {
  readonly name: string;
  readonly description?: string;
  readonly configuration?:
    Partial<JobQueueConfiguration>;
}

export interface JobRetryPolicy {
  readonly maximumAttempts: number;
  readonly strategy:
    JobBackoffStrategy;
  readonly initialDelayMs: number;
  readonly maximumDelayMs?: number;
  readonly multiplier: number;
  readonly retryableFailureKinds:
    readonly JobFailureKind[];
  readonly retryableErrorCodes:
    readonly string[];
  readonly jitter: boolean;
}

export interface JobRetryContext {
  readonly attemptNumber: number;
  readonly failure:
    JobFailure;
  readonly policy:
    JobRetryPolicy;
  readonly now: string;
}

export interface JobRetryDecision {
  readonly shouldRetry: boolean;
  readonly nextAttemptNumber?: number;
  readonly delayMs?: number;
  readonly retryAt?: string;
  readonly reason: string;
}

export interface JobRetryMetadata {
  readonly attemptNumber: number;
  readonly maximumAttempts: number;
  readonly lastFailure?: JobFailure;
  readonly nextRetryAt?: string;
  readonly lastRetryAt?: string;
}

export class JobScheduleModel
  implements JobSchedule {
  readonly id: string;
  readonly jobId: string;
  readonly definition:
    JobScheduleDefinition;
  readonly enabled: boolean;
  readonly runCount: number;
  readonly lastRunAt?: string;
  readonly nextRunAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    schedule:
      JobSchedule,
  ) {
    this.id =
      schedule.id;

    this.jobId =
      schedule.jobId;

    this.definition =
      cloneJobScheduleDefinition(
        schedule.definition,
      );

    this.enabled =
      schedule.enabled;

    this.runCount =
      schedule.runCount;

    this.lastRunAt =
      schedule.lastRunAt;

    this.nextRunAt =
      schedule.nextRunAt;

    this.createdAt =
      schedule.createdAt;

    this.updatedAt =
      schedule.updatedAt;
  }

  toContract():
    JobSchedule {
    return {
      id:
        this.id,
      jobId:
        this.jobId,
      definition:
        cloneJobScheduleDefinition(
          this.definition,
        ),
      enabled:
        this.enabled,
      runCount:
        this.runCount,
      lastRunAt:
        this.lastRunAt,
      nextRunAt:
        this.nextRunAt,
      createdAt:
        this.createdAt,
      updatedAt:
        this.updatedAt,
    };
  }
}

export class JobQueueModel
  implements JobQueue {
  readonly name: string;
  readonly description?: string;
  readonly configuration:
    JobQueueConfiguration;
  readonly metrics:
    JobQueueMetrics;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    queue:
      JobQueue,
  ) {
    this.name =
      queue.name;

    this.description =
      queue.description;

    this.configuration = {
      ...queue.configuration,
    };

    this.metrics = {
      ...queue.metrics,
    };

    this.createdAt =
      queue.createdAt;

    this.updatedAt =
      queue.updatedAt;
  }

  toContract(): JobQueue {
    return {
      name:
        this.name,
      description:
        this.description,
      configuration: {
        ...this.configuration,
      },
      metrics: {
        ...this.metrics,
      },
      createdAt:
        this.createdAt,
      updatedAt:
        this.updatedAt,
    };
  }
}

export class JobRetryPolicyModel
  implements JobRetryPolicy {
  readonly maximumAttempts: number;
  readonly strategy:
    JobBackoffStrategy;
  readonly initialDelayMs: number;
  readonly maximumDelayMs?: number;
  readonly multiplier: number;
  readonly retryableFailureKinds:
    readonly JobFailureKind[];
  readonly retryableErrorCodes:
    readonly string[];
  readonly jitter: boolean;

  constructor(
    policy:
      JobRetryPolicy,
  ) {
    if (
      !Number.isInteger(
        policy.maximumAttempts,
      ) ||
      policy.maximumAttempts < 1
    ) {
      throw new Error(
        'Job retry maximumAttempts must be at least 1.',
      );
    }

    if (
      !Number.isFinite(
        policy.initialDelayMs,
      ) ||
      policy.initialDelayMs < 0
    ) {
      throw new Error(
        'Job retry initialDelayMs cannot be negative.',
      );
    }

    if (
      !Number.isFinite(
        policy.multiplier,
      ) ||
      policy.multiplier < 1
    ) {
      throw new Error(
        'Job retry multiplier must be at least 1.',
      );
    }

    this.maximumAttempts =
      policy.maximumAttempts;

    this.strategy =
      policy.strategy;

    this.initialDelayMs =
      policy.initialDelayMs;

    this.maximumDelayMs =
      policy.maximumDelayMs;

    this.multiplier =
      policy.multiplier;

    this.retryableFailureKinds = [
      ...new Set(
        policy
          .retryableFailureKinds,
      ),
    ];

    this.retryableErrorCodes = [
      ...new Set(
        policy
          .retryableErrorCodes
          .map(
            (code) =>
              code.trim(),
          )
          .filter(Boolean),
      ),
    ];

    this.jitter =
      policy.jitter;
  }

  toContract():
    JobRetryPolicy {
    return {
      maximumAttempts:
        this.maximumAttempts,
      strategy:
        this.strategy,
      initialDelayMs:
        this.initialDelayMs,
      maximumDelayMs:
        this.maximumDelayMs,
      multiplier:
        this.multiplier,
      retryableFailureKinds: [
        ...this
          .retryableFailureKinds,
      ],
      retryableErrorCodes: [
        ...this
          .retryableErrorCodes,
      ],
      jitter:
        this.jitter,
    };
  }
}

export function createDefaultJobRetryPolicy():
  JobRetryPolicy {
  return {
    maximumAttempts: 3,
    strategy:
      'exponential',
    initialDelayMs: 1_000,
    maximumDelayMs:
      60_000,
    multiplier: 2,
    retryableFailureKinds: [
      'execution',
      'timeout',
      'dependency',
      'infrastructure',
      'rate_limit',
      'unknown',
    ],
    retryableErrorCodes: [],
    jitter: false,
  };
}

export function calculateJobRetryDelay(
  policy:
    JobRetryPolicy,
  attemptNumber: number,
): number {
  if (
    !Number.isInteger(
      attemptNumber,
    ) ||
    attemptNumber < 1
  ) {
    throw new Error(
      'Job retry attemptNumber must be at least 1.',
    );
  }

  let delayMs: number;

  switch (policy.strategy) {
    case 'none':
      delayMs = 0;
      break;

    case 'fixed':
      delayMs =
        policy.initialDelayMs;
      break;

    case 'linear':
      delayMs =
        policy.initialDelayMs *
        attemptNumber *
        policy.multiplier;
      break;

    case 'exponential':
      delayMs =
        policy.initialDelayMs *
        Math.pow(
          policy.multiplier,
          attemptNumber - 1,
        );
      break;

    default: {
      const exhaustiveCheck:
        never =
          policy.strategy;

      throw new Error(
        `Unsupported backoff strategy: ${String(exhaustiveCheck)}`,
      );
    }
  }

  if (
    typeof policy.maximumDelayMs ===
      'number'
  ) {
    delayMs =
      Math.min(
        delayMs,
        policy.maximumDelayMs,
      );
  }

  return Math.max(
    0,
    Math.floor(delayMs),
  );
}

export function evaluateJobRetry(
  context:
    JobRetryContext,
): JobRetryDecision {
  const {
    attemptNumber,
    failure,
    policy,
    now,
  } = context;

  if (
    attemptNumber >=
    policy.maximumAttempts
  ) {
    return {
      shouldRetry: false,
      reason:
        'Maximum retry attempts reached.',
    };
  }

  const kindAllowed =
    policy.retryableFailureKinds
      .includes(failure.kind);

  const codeAllowed =
    Boolean(
      failure.code &&
      policy.retryableErrorCodes
        .includes(
          failure.code,
        ),
    );

  if (
    !failure.retryable ||
    (
      !kindAllowed &&
      !codeAllowed
    )
  ) {
    return {
      shouldRetry: false,
      reason:
        'Failure is not retryable by policy.',
    };
  }

  const nextAttemptNumber =
    attemptNumber + 1;

  const delayMs =
    calculateJobRetryDelay(
      policy,
      nextAttemptNumber,
    );

  return {
    shouldRetry: true,
    nextAttemptNumber,
    delayMs,
    retryAt:
      new Date(
        new Date(now).getTime() +
        delayMs,
      ).toISOString(),
    reason:
      'Retry scheduled by policy.',
  };
}

export function cloneJobScheduleDefinition(
  definition:
    JobScheduleDefinition,
): JobScheduleDefinition {
  return {
    ...definition,
  };
}

export function isRecurringJobSchedule(
  definition:
    JobScheduleDefinition,
): definition is
  | JobCronSchedule
  | JobIntervalSchedule {
  return (
    definition.kind ===
      'cron' ||
    definition.kind ===
      'interval'
  );
}

export function validateJobScheduleDefinition(
  definition:
    JobScheduleDefinition,
): void {
  switch (definition.kind) {
    case 'immediate':
      assertValidJobDate(
        definition.enqueueAt,
        'enqueueAt',
      );
      return;

    case 'delayed':
      assertValidJobDate(
        definition.runAt,
        'runAt',
      );

      if (
        !Number.isFinite(
          definition.delayMs,
        ) ||
        definition.delayMs < 0
      ) {
        throw new Error(
          'Delayed job delayMs cannot be negative.',
        );
      }

      return;

    case 'cron':
      if (
        !definition.expression
          .trim()
      ) {
        throw new Error(
          'Cron expression is required.',
        );
      }

      if (
        !definition.timezone
          .trim()
      ) {
        throw new Error(
          'Cron timezone is required.',
        );
      }

      return;

    case 'interval':
      if (
        !Number.isFinite(
          definition.intervalMs,
        ) ||
        definition.intervalMs <= 0
      ) {
        throw new Error(
          'Interval schedule intervalMs must be greater than zero.',
        );
      }

      assertValidJobDate(
        definition.startAt,
        'startAt',
      );

      return;

    case 'manual':
      return;

    default: {
      const exhaustiveCheck:
        never =
          definition;

      throw new Error(
        `Unsupported schedule definition: ${String(exhaustiveCheck)}`,
      );
    }
  }
}

function assertValidJobDate(
  value: string,
  fieldName: string,
): void {
  if (
    !Number.isFinite(
      new Date(value).getTime(),
    )
  ) {
    throw new Error(
      `Job schedule ${fieldName} must be a valid date.`,
    );
  }
}
export const JOB_HISTORY_EVENT_TYPES = [
  'created',
  'scheduled',
  'queued',
  'dequeued',
  'started',
  'progress_updated',
  'paused',
  'resumed',
  'retry_scheduled',
  'retried',
  'completed',
  'failed',
  'cancelled',
  'expired',
  'dead_lettered',
  'dependency_waiting',
  'dependency_resolved',
  'lease_acquired',
  'lease_renewed',
  'lease_released',
  'custom',
] as const;

export type JobHistoryEventType =
  (typeof JOB_HISTORY_EVENT_TYPES)[number];

export interface JobStateTransitionHistory {
  readonly from:
    JobState;
  readonly to:
    JobState;
  readonly transitionedAt: string;
  readonly reason?: string;
  readonly requestedBy?: string;
}

export interface JobExecutionHistory {
  readonly executionId: string;
  readonly attemptNumber: number;
  readonly state:
    JobState;
  readonly outcome?:
    JobExecutionOutcome;
  readonly queuedAt?: string;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly durationMs?: number;
  readonly workerId?: string;
  readonly failure?: JobFailure;
}

export interface JobRetryHistory {
  readonly executionId: string;
  readonly previousAttemptNumber: number;
  readonly nextAttemptNumber: number;
  readonly scheduledAt: string;
  readonly retryAt: string;
  readonly delayMs: number;
  readonly reason: string;
  readonly failure:
    JobFailure;
}

export interface JobHistoryEvent {
  readonly id: string;
  readonly jobId: string;
  readonly executionId?: string;
  readonly type:
    JobHistoryEventType;
  readonly occurredAt: string;
  readonly state?: JobState;
  readonly message?: string;
  readonly correlation:
    JobCorrelation;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface JobHistory {
  readonly jobId: string;
  readonly events:
    readonly JobHistoryEvent[];
  readonly stateTransitions:
    readonly JobStateTransitionHistory[];
  readonly executions:
    readonly JobExecutionHistory[];
  readonly retries:
    readonly JobRetryHistory[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface JobDurationMetrics {
  readonly minimumMs?: number;
  readonly maximumMs?: number;
  readonly averageMs?: number;
  readonly totalMs: number;
  readonly sampleCount: number;
}

export interface JobExecutionMetrics {
  readonly totalExecutions: number;
  readonly successfulExecutions: number;
  readonly failedExecutions: number;
  readonly cancelledExecutions: number;
  readonly timedOutExecutions: number;
  readonly expiredExecutions: number;
  readonly activeExecutions: number;
  readonly retryExecutions: number;
  readonly successRate: number;
  readonly failureRate: number;
  readonly duration:
    JobDurationMetrics;
}

export interface JobScheduleMetrics {
  readonly totalSchedules: number;
  readonly enabledSchedules: number;
  readonly disabledSchedules: number;
  readonly recurringSchedules: number;
  readonly delayedSchedules: number;
  readonly cronSchedules: number;
  readonly intervalSchedules: number;
  readonly nextScheduledAt?: string;
}

export interface JobStateMetrics {
  readonly states:
    Readonly<Record<JobState, number>>;
  readonly activeJobs: number;
  readonly terminalJobs: number;
}

export interface JobPriorityMetrics {
  readonly priorities:
    Readonly<Record<JobPriority, number>>;
}

export interface JobTypeMetrics {
  readonly types:
    Readonly<Record<JobType, number>>;
}

export interface JobMetrics {
  readonly totalJobs: number;
  readonly state:
    JobStateMetrics;
  readonly priority:
    JobPriorityMetrics;
  readonly type:
    JobTypeMetrics;
  readonly executions:
    JobExecutionMetrics;
  readonly schedules:
    JobScheduleMetrics;
  readonly queues:
    readonly JobQueueMetrics[];
  readonly generatedAt: string;
}

export interface CalculateJobMetricsInput {
  readonly jobs:
    readonly Job[];
  readonly executions:
    readonly JobExecution[];
  readonly schedules:
    readonly JobSchedule[];
  readonly queues:
    readonly JobQueue[];
  readonly generatedAt?: string;
}

export class JobHistoryModel
  implements JobHistory {
  readonly jobId: string;
  readonly events:
    readonly JobHistoryEvent[];
  readonly stateTransitions:
    readonly JobStateTransitionHistory[];
  readonly executions:
    readonly JobExecutionHistory[];
  readonly retries:
    readonly JobRetryHistory[];
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    history:
      JobHistory,
  ) {
    this.jobId =
      history.jobId;

    this.events =
      history.events.map(
        (event) => ({
          ...event,
          correlation: {
            ...event.correlation,
          },
          metadata: {
            ...event.metadata,
          },
        }),
      );

    this.stateTransitions =
      history.stateTransitions
        .map(
          (transition) => ({
            ...transition,
          }),
        );

    this.executions =
      history.executions.map(
        (execution) => ({
          ...execution,
          failure:
            execution.failure
              ? {
                  ...execution.failure,
                  details:
                    execution.failure
                      .details
                      ? {
                          ...execution
                            .failure
                            .details,
                        }
                      : undefined,
                }
              : undefined,
        }),
      );

    this.retries =
      history.retries.map(
        (retry) => ({
          ...retry,
          failure: {
            ...retry.failure,
            details:
              retry.failure.details
                ? {
                    ...retry.failure
                      .details,
                  }
                : undefined,
          },
        }),
      );

    this.createdAt =
      history.createdAt;

    this.updatedAt =
      history.updatedAt;
  }

  toContract(): JobHistory {
    return {
      jobId:
        this.jobId,
      events:
        this.events.map(
          (event) => ({
            ...event,
            correlation: {
              ...event.correlation,
            },
            metadata: {
              ...event.metadata,
            },
          }),
        ),
      stateTransitions:
        this.stateTransitions
          .map(
            (transition) => ({
              ...transition,
            }),
          ),
      executions:
        this.executions.map(
          (execution) => ({
            ...execution,
            failure:
              execution.failure
                ? {
                    ...execution.failure,
                    details:
                      execution.failure
                        .details
                        ? {
                            ...execution
                              .failure
                              .details,
                          }
                        : undefined,
                  }
                : undefined,
          }),
        ),
      retries:
        this.retries.map(
          (retry) => ({
            ...retry,
            failure: {
              ...retry.failure,
              details:
                retry.failure.details
                  ? {
                      ...retry.failure
                        .details,
                    }
                  : undefined,
            },
          }),
        ),
      createdAt:
        this.createdAt,
      updatedAt:
        this.updatedAt,
    };
  }
}

export class JobMetricsModel
  implements JobMetrics {
  readonly totalJobs: number;
  readonly state:
    JobStateMetrics;
  readonly priority:
    JobPriorityMetrics;
  readonly type:
    JobTypeMetrics;
  readonly executions:
    JobExecutionMetrics;
  readonly schedules:
    JobScheduleMetrics;
  readonly queues:
    readonly JobQueueMetrics[];
  readonly generatedAt: string;

  constructor(
    metrics:
      JobMetrics,
  ) {
    this.totalJobs =
      metrics.totalJobs;

    this.state = {
      states: {
        ...metrics.state.states,
      },
      activeJobs:
        metrics.state.activeJobs,
      terminalJobs:
        metrics.state.terminalJobs,
    };

    this.priority = {
      priorities: {
        ...metrics.priority
          .priorities,
      },
    };

    this.type = {
      types: {
        ...metrics.type.types,
      },
    };

    this.executions = {
      ...metrics.executions,
      duration: {
        ...metrics.executions
          .duration,
      },
    };

    this.schedules = {
      ...metrics.schedules,
    };

    this.queues =
      metrics.queues.map(
        (queue) => ({
          ...queue,
        }),
      );

    this.generatedAt =
      metrics.generatedAt;
  }

  toContract(): JobMetrics {
    return {
      totalJobs:
        this.totalJobs,
      state: {
        states: {
          ...this.state.states,
        },
        activeJobs:
          this.state.activeJobs,
        terminalJobs:
          this.state.terminalJobs,
      },
      priority: {
        priorities: {
          ...this.priority
            .priorities,
        },
      },
      type: {
        types: {
          ...this.type.types,
        },
      },
      executions: {
        ...this.executions,
        duration: {
          ...this.executions
            .duration,
        },
      },
      schedules: {
        ...this.schedules,
      },
      queues:
        this.queues.map(
          (queue) => ({
            ...queue,
          }),
        ),
      generatedAt:
        this.generatedAt,
    };
  }
}

export function createEmptyJobHistory(
  jobId: string,
  timestamp:
    string = new Date().toISOString(),
): JobHistory {
  const normalizedJobId =
    jobId.trim();

  if (!normalizedJobId) {
    throw new Error(
      'Job history jobId is required.',
    );
  }

  return {
    jobId:
      normalizedJobId,
    events: [],
    stateTransitions: [],
    executions: [],
    retries: [],
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
  };
}

export function appendJobHistoryEvent(
  history:
    JobHistory,
  event:
    JobHistoryEvent,
): JobHistory {
  if (
    event.jobId !==
    history.jobId
  ) {
    throw new Error(
      'Job history event jobId does not match history jobId.',
    );
  }

  return {
    ...new JobHistoryModel(
      history,
    ).toContract(),
    events: [
      ...history.events.map(
        (existing) => ({
          ...existing,
          correlation: {
            ...existing.correlation,
          },
          metadata: {
            ...existing.metadata,
          },
        }),
      ),
      {
        ...event,
        correlation: {
          ...event.correlation,
        },
        metadata: {
          ...event.metadata,
        },
      },
    ],
    updatedAt:
      event.occurredAt,
  };
}

export function appendJobStateTransition(
  history:
    JobHistory,
  transition:
    JobStateTransitionHistory,
): JobHistory {
  return {
    ...new JobHistoryModel(
      history,
    ).toContract(),
    stateTransitions: [
      ...history.stateTransitions
        .map(
          (existing) => ({
            ...existing,
          }),
        ),
      {
        ...transition,
      },
    ],
    updatedAt:
      transition.transitionedAt,
  };
}

export function appendJobExecutionHistory(
  history:
    JobHistory,
  execution:
    JobExecutionHistory,
  updatedAt:
    string = new Date().toISOString(),
): JobHistory {
  return {
    ...new JobHistoryModel(
      history,
    ).toContract(),
    executions: [
      ...history.executions
        .map(
          (existing) => ({
            ...existing,
            failure:
              existing.failure
                ? {
                    ...existing.failure,
                    details:
                      existing.failure
                        .details
                        ? {
                            ...existing
                              .failure
                              .details,
                          }
                        : undefined,
                  }
                : undefined,
          }),
        ),
      {
        ...execution,
        failure:
          execution.failure
            ? {
                ...execution.failure,
                details:
                  execution.failure
                    .details
                    ? {
                        ...execution
                          .failure
                          .details,
                      }
                    : undefined,
              }
            : undefined,
      },
    ],
    updatedAt,
  };
}

export function appendJobRetryHistory(
  history:
    JobHistory,
  retry:
    JobRetryHistory,
): JobHistory {
  return {
    ...new JobHistoryModel(
      history,
    ).toContract(),
    retries: [
      ...history.retries.map(
        (existing) => ({
          ...existing,
          failure: {
            ...existing.failure,
            details:
              existing.failure
                .details
                ? {
                    ...existing.failure
                      .details,
                  }
                : undefined,
          },
        }),
      ),
      {
        ...retry,
        failure: {
          ...retry.failure,
          details:
            retry.failure.details
              ? {
                  ...retry.failure
                    .details,
                }
              : undefined,
        },
      },
    ],
    updatedAt:
      retry.scheduledAt,
  };
}

export function calculateJobMetrics(
  input:
    CalculateJobMetricsInput,
): JobMetrics {
  const generatedAt =
    input.generatedAt ??
    new Date().toISOString();

  const stateCounts =
    createZeroJobStateCounts();

  const priorityCounts =
    createZeroJobPriorityCounts();

  const typeCounts =
    createZeroJobTypeCounts();

  for (const job of input.jobs) {
    stateCounts[job.state] += 1;
    priorityCounts[
      job.priority
    ] += 1;
    typeCounts[job.type] += 1;
  }

  const completedExecutions =
    input.executions.filter(
      (execution) =>
        execution.outcome ===
        'success',
    ).length;

  const failedExecutions =
    input.executions.filter(
      (execution) =>
        execution.outcome ===
        'failure',
    ).length;

  const cancelledExecutions =
    input.executions.filter(
      (execution) =>
        execution.outcome ===
        'cancelled',
    ).length;

  const timedOutExecutions =
    input.executions.filter(
      (execution) =>
        execution.outcome ===
        'timeout',
    ).length;

  const expiredExecutions =
    input.executions.filter(
      (execution) =>
        execution.outcome ===
        'expired',
    ).length;

  const activeExecutions =
    input.executions.filter(
      (execution) =>
        isActiveJobState(
          execution.state,
        ),
    ).length;

  const retryExecutions =
    input.executions.filter(
      (execution) =>
        execution.attemptNumber >
        1,
    ).length;

  const durations =
    input.executions
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

  const totalDuration =
    durations.reduce(
      (
        total,
        duration,
      ) =>
        total + duration,
      0,
    );

  const totalExecutions =
    input.executions.length;

  const recurringSchedules =
    input.schedules.filter(
      (schedule) =>
        isRecurringJobSchedule(
          schedule.definition,
        ),
    );

  const nextScheduleCandidates =
    input.schedules
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
      .sort();

  const queueMetrics =
    input.queues.map(
      (queue) => ({
        ...queue.metrics,
      }),
    );

  return new JobMetricsModel({
    totalJobs:
      input.jobs.length,
    state: {
      states:
        stateCounts,
      activeJobs:
        input.jobs.filter(
          (job) =>
            isActiveJobState(
              job.state,
            ),
        ).length,
      terminalJobs:
        input.jobs.filter(
          (job) =>
            isTerminalJobState(
              job.state,
            ),
        ).length,
    },
    priority: {
      priorities:
        priorityCounts,
    },
    type: {
      types:
        typeCounts,
    },
    executions: {
      totalExecutions,
      successfulExecutions:
        completedExecutions,
      failedExecutions,
      cancelledExecutions,
      timedOutExecutions,
      expiredExecutions,
      activeExecutions,
      retryExecutions,
      successRate:
        totalExecutions > 0
          ? completedExecutions /
            totalExecutions
          : 0,
      failureRate:
        totalExecutions > 0
          ? failedExecutions /
            totalExecutions
          : 0,
      duration: {
        minimumMs:
          durations.length > 0
            ? Math.min(
                ...durations,
              )
            : undefined,
        maximumMs:
          durations.length > 0
            ? Math.max(
                ...durations,
              )
            : undefined,
        averageMs:
          durations.length > 0
            ? totalDuration /
              durations.length
            : undefined,
        totalMs:
          totalDuration,
        sampleCount:
          durations.length,
      },
    },
    schedules: {
      totalSchedules:
        input.schedules.length,
      enabledSchedules:
        input.schedules.filter(
          (schedule) =>
            schedule.enabled,
        ).length,
      disabledSchedules:
        input.schedules.filter(
          (schedule) =>
            !schedule.enabled,
        ).length,
      recurringSchedules:
        recurringSchedules.length,
      delayedSchedules:
        input.schedules.filter(
          (schedule) =>
            schedule.definition
              .kind ===
            'delayed',
        ).length,
      cronSchedules:
        input.schedules.filter(
          (schedule) =>
            schedule.definition
              .kind ===
            'cron',
        ).length,
      intervalSchedules:
        input.schedules.filter(
          (schedule) =>
            schedule.definition
              .kind ===
            'interval',
        ).length,
      nextScheduledAt:
        nextScheduleCandidates[0],
    },
    queues:
      queueMetrics,
    generatedAt,
  }).toContract();
}

function createZeroJobStateCounts():
  Record<JobState, number> {
  return {
    draft: 0,
    scheduled: 0,
    queued: 0,
    waiting: 0,
    delayed: 0,
    running: 0,
    retry_scheduled: 0,
    paused: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    dead_lettered: 0,
    expired: 0,
  };
}

function createZeroJobPriorityCounts():
  Record<JobPriority, number> {
  return {
    lowest: 0,
    low: 0,
    normal: 0,
    high: 0,
    urgent: 0,
    critical: 0,
  };
}

function createZeroJobTypeCounts():
  Record<JobType, number> {
  return {
    one_time: 0,
    delayed: 0,
    recurring: 0,
    cron: 0,
    workflow: 0,
    capability: 0,
    content_generation: 0,
    content_publishing: 0,
    notification: 0,
    monitoring: 0,
    maintenance: 0,
    data_processing: 0,
    integration: 0,
    cleanup: 0,
    custom: 0,
  };
}
export function normalizeJobPriority(
  value?: JobPriority,
): JobPriority {
  return value ?? 'normal';
}

export function normalizeJobType(
  value?: JobType,
): JobType {
  return value ?? 'one_time';
}

export function assertJobProgressPercentage(
  value: number,
): number {
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    value > 100
  ) {
    throw new Error(
      'Job progress percentage must be between 0 and 100.',
    );
  }

  return value;
}