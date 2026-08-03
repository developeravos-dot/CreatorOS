import type {
  CreateJobInput,
  CreateJobQueueInput,
  CreateJobScheduleInput,
  Job,
  JobCancellationRequest,
  JobExecution,
  JobFailure,
  JobHistory,
  JobMetrics,
  JobPauseRequest,
  JobPriority,
  JobProgress,
  JobQueue,
  JobQueueConfiguration,
  JobQueueMetrics,
  JobResumeRequest,
  JobRetryDecision,
  JobRetryMetadata,
  JobRetryPolicy,
  JobRetryRequest,
  JobSchedule,
  JobScheduleDefinition,
  JobState,
  JobType,
} from '../models';

export interface JobIdentifierContract {
  readonly jobId: string;
}

export interface JobExecutionIdentifierContract
  extends JobIdentifierContract {
  readonly executionId: string;
}

export interface JobScheduleIdentifierContract
  extends JobIdentifierContract {
  readonly scheduleId: string;
}

export interface JobQueueIdentifierContract {
  readonly queueName: string;
}

export interface CreateJobContract
  extends CreateJobInput {}

export interface UpdateJobContract {
  readonly name?: string;
  readonly description?: string;
  readonly type?: JobType;
  readonly priority?: JobPriority;
  readonly queueName?: string;
  readonly payload?:
    Readonly<Record<string, unknown>>;
  readonly schemaVersion?: string;
  readonly enabled?: boolean;
  readonly tags?:
    readonly string[];
  readonly labels?:
    Readonly<Record<string, string>>;
}

export interface UpdateJobPayloadContract {
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly schemaVersion?: string;
}

export interface UpdateJobProgressContract {
  readonly progress:
    JobProgress;
}

export interface JobStateTransitionContract
  extends JobIdentifierContract {
  readonly targetState:
    JobState;
  readonly reason?: string;
  readonly requestedBy?: string;
}

export interface PauseJobContract
  extends JobIdentifierContract,
    JobPauseRequest {}

export interface ResumeJobContract
  extends JobIdentifierContract,
    JobResumeRequest {}

export interface CancelJobContract
  extends JobIdentifierContract,
    JobCancellationRequest {}

export interface RetryJobContract
  extends JobIdentifierContract,
    JobRetryRequest {}

export interface CreateJobScheduleContract
  extends CreateJobScheduleInput {}

export interface UpdateJobScheduleContract
  extends JobScheduleIdentifierContract {
  readonly definition?:
    JobScheduleDefinition;
  readonly enabled?: boolean;
}

export interface EnableJobScheduleContract
  extends JobScheduleIdentifierContract {
  readonly enabled: true;
}

export interface DisableJobScheduleContract
  extends JobScheduleIdentifierContract {
  readonly enabled: false;
}

export interface TriggerJobScheduleContract
  extends JobScheduleIdentifierContract {
  readonly requestedBy?: string;
  readonly reason?: string;
}

export interface CreateJobQueueContract
  extends CreateJobQueueInput {}

export interface UpdateJobQueueContract
  extends JobQueueIdentifierContract {
  readonly description?: string;
  readonly configuration?:
    Partial<JobQueueConfiguration>;
}

export interface PauseJobQueueContract
  extends JobQueueIdentifierContract {
  readonly reason?: string;
  readonly requestedBy?: string;
}

export interface ResumeJobQueueContract
  extends JobQueueIdentifierContract {
  readonly requestedBy?: string;
}

export interface PurgeJobQueueContract
  extends JobQueueIdentifierContract {
  readonly states?:
    readonly JobState[];
  readonly includeDelayed?: boolean;
  readonly includeFailed?: boolean;
  readonly includeCompleted?: boolean;
}

export interface EnqueueJobContract
  extends JobIdentifierContract {
  readonly queueName?: string;
  readonly delayMs?: number;
  readonly priority?: JobPriority;
}

export interface DequeueJobContract
  extends JobQueueIdentifierContract {
  readonly workerId: string;
  readonly leaseDurationMs: number;
}

export interface StartJobExecutionContract
  extends JobExecutionIdentifierContract {
  readonly workerId: string;
  readonly startedAt?: string;
}

export interface CompleteJobExecutionContract
  extends JobExecutionIdentifierContract {
  readonly result?:
    Readonly<Record<string, unknown>>;
  readonly summary?: string;
  readonly producedResourceIds?:
    readonly string[];
  readonly finishedAt?: string;
}

export interface FailJobExecutionContract
  extends JobExecutionIdentifierContract {
  readonly failure:
    JobFailure;
  readonly finishedAt?: string;
}

export interface CancelJobExecutionContract
  extends JobExecutionIdentifierContract {
  readonly reason?: string;
  readonly requestedBy?: string;
  readonly finishedAt?: string;
}

export interface UpdateJobExecutionProgressContract
  extends JobExecutionIdentifierContract {
  readonly percentage: number;
  readonly currentStep?: string;
  readonly completedUnits?: number;
  readonly totalUnits?: number;
  readonly message?: string;
}

export interface AcquireJobExecutionLeaseContract
  extends JobExecutionIdentifierContract {
  readonly workerId: string;
  readonly leaseDurationMs: number;
}

export interface RenewJobExecutionLeaseContract
  extends JobExecutionIdentifierContract {
  readonly workerId: string;
  readonly leaseDurationMs: number;
}

export interface ReleaseJobExecutionLeaseContract
  extends JobExecutionIdentifierContract {
  readonly workerId: string;
}

export interface EvaluateJobRetryContract
  extends JobExecutionIdentifierContract {
  readonly attemptNumber: number;
  readonly failure:
    JobFailure;
  readonly policy:
    JobRetryPolicy;
  readonly now?: string;
}

export interface ScheduleJobRetryContract
  extends JobExecutionIdentifierContract {
  readonly decision:
    JobRetryDecision;
  readonly metadata:
    JobRetryMetadata;
}

export interface JobListQueryContract {
  readonly search?: string;
  readonly ids?:
    readonly string[];
  readonly states?:
    readonly JobState[];
  readonly priorities?:
    readonly JobPriority[];
  readonly types?:
    readonly JobType[];
  readonly queueNames?:
    readonly string[];
  readonly ownerIds?:
    readonly string[];
  readonly tenantId?: string;
  readonly workspaceId?: string;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly tags?:
    readonly string[];
  readonly createdFrom?: string;
  readonly createdTo?: string;
  readonly updatedFrom?: string;
  readonly updatedTo?: string;
  readonly scheduledBefore?: string;
  readonly scheduledAfter?: string;
  readonly enabled?: boolean;
  readonly hasFailure?: boolean;
  readonly hasActiveExecution?: boolean;
  readonly sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'state'
    | 'priority'
    | 'type'
    | 'nextExecutionAt'
    | 'executionCount';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface JobExecutionListQueryContract {
  readonly jobId?: string;
  readonly executionIds?:
    readonly string[];
  readonly states?:
    readonly JobState[];
  readonly outcomes?:
    readonly (
      | 'success'
      | 'failure'
      | 'cancelled'
      | 'timeout'
      | 'expired'
      | 'unknown'
    )[];
  readonly queueNames?:
    readonly string[];
  readonly workerIds?:
    readonly string[];
  readonly attemptFrom?: number;
  readonly attemptTo?: number;
  readonly startedFrom?: string;
  readonly startedTo?: string;
  readonly finishedFrom?: string;
  readonly finishedTo?: string;
  readonly sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'startedAt'
    | 'finishedAt'
    | 'durationMs'
    | 'attemptNumber'
    | 'state';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface JobScheduleListQueryContract {
  readonly jobId?: string;
  readonly scheduleIds?:
    readonly string[];
  readonly kinds?:
    readonly (
      | 'immediate'
      | 'delayed'
      | 'cron'
      | 'interval'
      | 'manual'
    )[];
  readonly enabled?: boolean;
  readonly nextRunFrom?: string;
  readonly nextRunTo?: string;
  readonly sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'nextRunAt'
    | 'lastRunAt'
    | 'runCount';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface JobQueueListQueryContract {
  readonly search?: string;
  readonly names?:
    readonly string[];
  readonly drivers?:
    readonly (
      | 'memory'
      | 'bullmq'
    )[];
  readonly paused?: boolean;
  readonly sortBy?:
    | 'name'
    | 'createdAt'
    | 'updatedAt'
    | 'waiting'
    | 'active'
    | 'failed'
    | 'total';
  readonly sortDirection?:
    | 'asc'
    | 'desc';
  readonly page?: number;
  readonly pageSize?: number;
}

export interface PaginationContract {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface JobListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    PaginationContract;
  readonly jobs:
    readonly Job[];
}

export interface JobExecutionListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    PaginationContract;
  readonly executions:
    readonly JobExecution[];
}

export interface JobScheduleListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    PaginationContract;
  readonly schedules:
    readonly JobSchedule[];
}

export interface JobQueueListResultContract {
  readonly count: number;
  readonly total: number;
  readonly pagination:
    PaginationContract;
  readonly queues:
    readonly JobQueue[];
}

export interface JobDetailsContract {
  readonly job: Job;
  readonly currentExecution?:
    JobExecution;
  readonly schedule?:
    JobSchedule;
  readonly history:
    JobHistory;
  readonly queue?:
    JobQueue;
}

export interface JobQueueDetailsContract {
  readonly queue:
    JobQueue;
  readonly metrics:
    JobQueueMetrics;
  readonly activeExecutions:
    readonly JobExecution[];
  readonly waitingJobs:
    readonly Job[];
  readonly delayedJobs:
    readonly Job[];
}

export interface JobMetricsContract {
  readonly metrics:
    JobMetrics;
}

export interface JobOperationResultContract {
  readonly successful: boolean;
  readonly jobId: string;
  readonly state?: JobState;
  readonly executionId?: string;
  readonly scheduleId?: string;
  readonly queueName?: string;
  readonly message: string;
  readonly job?: Job;
  readonly execution?:
    JobExecution;
  readonly schedule?:
    JobSchedule;
}

export interface JobBulkOperationFailureContract {
  readonly jobId: string;
  readonly code?: string;
  readonly message: string;
}

export interface JobBulkOperationResultContract {
  readonly requested: number;
  readonly successful: number;
  readonly failed: number;
  readonly jobIds:
    readonly string[];
  readonly failures:
    readonly JobBulkOperationFailureContract[];
}

export interface BulkJobIdsContract {
  readonly jobIds:
    readonly string[];
}

export interface BulkPauseJobsContract
  extends BulkJobIdsContract {
  readonly requestedBy?: string;
  readonly reason?: string;
  readonly pauseRunningExecutions:
    boolean;
}

export interface BulkResumeJobsContract
  extends BulkJobIdsContract {
  readonly requestedBy?: string;
  readonly enqueueImmediately:
    boolean;
}

export interface BulkCancelJobsContract
  extends BulkJobIdsContract {
  readonly requestedBy?: string;
  readonly reason?: string;
  readonly force: boolean;
}

export interface BulkRetryJobsContract
  extends BulkJobIdsContract {
  readonly requestedBy?: string;
  readonly reason?: string;
  readonly resetAttemptCount:
    boolean;
  readonly delayMs?: number;
}

export interface BulkDeleteJobsContract
  extends BulkJobIdsContract {
  readonly force: boolean;
  readonly deleteHistory: boolean;
  readonly deleteExecutions: boolean;
  readonly deleteSchedule: boolean;
}

export interface JobHistoryQueryContract {
  readonly jobId: string;
  readonly eventTypes?:
    readonly string[];
  readonly states?:
    readonly JobState[];
  readonly executionId?: string;
  readonly occurredFrom?: string;
  readonly occurredTo?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export interface JobHistoryResultContract {
  readonly jobId: string;
  readonly history:
    JobHistory;
  readonly pagination:
    PaginationContract;
}

export interface JobSchedulerTickContract {
  readonly now?: string;
  readonly maximumJobs?: number;
  readonly queueNames?:
    readonly string[];
}

export interface JobSchedulerTickResultContract {
  readonly evaluatedSchedules: number;
  readonly dueSchedules: number;
  readonly enqueuedJobs: number;
  readonly skippedSchedules: number;
  readonly failedSchedules: number;
  readonly jobIds:
    readonly string[];
  readonly failures:
    readonly {
      scheduleId: string;
      jobId: string;
      message: string;
    }[];
  readonly processedAt: string;
}

export interface QueueMetricsAggregationContract {
  readonly queues:
    readonly JobQueue[];
  readonly aggregate:
    JobQueueMetrics;
  readonly generatedAt: string;
}

export interface JobHealthContract {
  readonly status:
    | 'healthy'
    | 'degraded'
    | 'unhealthy';
  readonly totalJobs: number;
  readonly activeJobs: number;
  readonly failedJobs: number;
  readonly deadLetteredJobs: number;
  readonly stalledExecutions: number;
  readonly expiredLeases: number;
  readonly delayedJobs: number;
  readonly pendingRetries: number;
  readonly generatedAt: string;
}

export interface JobExportContract {
  readonly format:
    | 'json'
    | 'csv';
  readonly query?:
    JobListQueryContract;
}

export interface JobExportResultContract {
  readonly format:
    | 'json'
    | 'csv';
  readonly filename: string;
  readonly contentType: string;
  readonly jobCount: number;
  readonly content: string;
  readonly generatedAt: string;
}