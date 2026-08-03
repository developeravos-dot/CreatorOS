import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  Type,
} from 'class-transformer';

import {
  JOB_BACKOFF_STRATEGIES,
  JOB_PRIORITIES,
  JOB_QUEUE_DRIVERS,
  JOB_SCHEDULE_KINDS,
  JOB_STATES,
  JOB_TYPES,
  type JobBackoffStrategy,
  type JobPriority,
  type JobQueueDriver,
  type JobScheduleKind,
  type JobState,
  type JobType,
} from '../models';

export class JobDependencyDto {
  @IsString()
  @MinLength(1)
  jobId!: string;

  @IsOptional()
  @IsBoolean()
  optional?: boolean;
}

export class CreateJobDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(JOB_TYPES)
  type?: JobType;

  @IsOptional()
  @IsIn(JOB_PRIORITIES)
  priority?: JobPriority;

  @IsOptional()
  @IsString()
  queueName?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  schemaVersion?: string;

  @IsOptional()
  @IsObject()
  correlation?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  ownership?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => JobDependencyDto)
  dependencies?: JobDependencyDto[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(JOB_TYPES)
  type?: JobType;

  @IsOptional()
  @IsIn(JOB_PRIORITIES)
  priority?: JobPriority;

  @IsOptional()
  @IsString()
  queueName?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  schemaVersion?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}

export class JobStateTransitionDto {
  @IsIn(JOB_STATES)
  targetState!: JobState;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;
}

export class JobCommandDto {
  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class PauseJobDto
  extends JobCommandDto {
  @IsOptional()
  @IsBoolean()
  pauseRunningExecution?: boolean;
}

export class ResumeJobDto
  extends JobCommandDto {
  @IsOptional()
  @IsBoolean()
  enqueueImmediately?: boolean;
}

export class CancelJobDto
  extends JobCommandDto {
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}

export class RetryJobDto
  extends JobCommandDto {
  @IsOptional()
  @IsBoolean()
  resetAttemptCount?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  delayMs?: number;
}

export class CreateJobScheduleDto {
  @IsString()
  @MinLength(1)
  jobId!: string;

  @IsIn(JOB_SCHEDULE_KINDS)
  kind!: JobScheduleKind;

  @IsOptional()
  @IsString()
  runAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  delayMs?: number;

  @IsOptional()
  @IsString()
  expression?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  intervalMs?: number;

  @IsOptional()
  @IsString()
  startAt?: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maximumRuns?: number;

  @IsOptional()
  @IsBoolean()
  runImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateJobScheduleDto {
  @IsOptional()
  @IsIn(JOB_SCHEDULE_KINDS)
  kind?: JobScheduleKind;

  @IsOptional()
  @IsString()
  runAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  delayMs?: number;

  @IsOptional()
  @IsString()
  expression?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  intervalMs?: number;

  @IsOptional()
  @IsString()
  startAt?: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maximumRuns?: number;

  @IsOptional()
  @IsBoolean()
  runImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateJobQueueDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(JOB_QUEUE_DRIVERS)
  driver?: JobQueueDriver;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  concurrency?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  rateLimitPerSecond?: number;

  @IsOptional()
  @IsIn(JOB_PRIORITIES)
  defaultPriority?: JobPriority;

  @IsOptional()
  @IsBoolean()
  paused?: boolean;

  @IsOptional()
  @IsBoolean()
  removeCompletedJobs?: boolean;

  @IsOptional()
  @IsBoolean()
  removeFailedJobs?: boolean;
}

export class UpdateJobQueueDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(JOB_QUEUE_DRIVERS)
  driver?: JobQueueDriver;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  concurrency?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  rateLimitPerSecond?: number;

  @IsOptional()
  @IsIn(JOB_PRIORITIES)
  defaultPriority?: JobPriority;

  @IsOptional()
  @IsBoolean()
  paused?: boolean;

  @IsOptional()
  @IsBoolean()
  removeCompletedJobs?: boolean;

  @IsOptional()
  @IsBoolean()
  removeFailedJobs?: boolean;
}

export class StartJobExecutionDto {
  @IsString()
  @MinLength(1)
  workerId!: string;

  @IsOptional()
  @IsString()
  startedAt?: string;
}

export class CompleteJobExecutionDto {
  @IsOptional()
  @IsObject()
  result?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  producedResourceIds?: string[];

  @IsOptional()
  @IsString()
  finishedAt?: string;
}

export class FailJobExecutionDto {
  @IsString()
  @MinLength(1)
  kind!: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsBoolean()
  retryable!: boolean;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  finishedAt?: string;
}

export class UpdateJobProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage!: number;

  @IsOptional()
  @IsString()
  currentStep?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  completedUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalUnits?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class JobRetryPolicyDto {
  @IsInt()
  @Min(1)
  maximumAttempts!: number;

  @IsIn(JOB_BACKOFF_STRATEGIES)
  strategy!: JobBackoffStrategy;

  @IsInt()
  @Min(0)
  initialDelayMs!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maximumDelayMs?: number;

  @IsNumber()
  @Min(1)
  multiplier!: number;

  @IsArray()
  @IsString({
    each: true,
  })
  retryableFailureKinds!: string[];

  @IsArray()
  @IsString({
    each: true,
  })
  retryableErrorCodes!: string[];

  @IsBoolean()
  jitter!: boolean;
}

export class JobListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsIn(
    JOB_STATES,
    {
      each: true,
    },
  )
  states?: JobState[];

  @IsOptional()
  @IsArray()
  @IsIn(
    JOB_PRIORITIES,
    {
      each: true,
    },
  )
  priorities?: JobPriority[];

  @IsOptional()
  @IsArray()
  @IsIn(
    JOB_TYPES,
    {
      each: true,
    },
  )
  types?: JobType[];

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  queueNames?: string[];

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  hasFailure?: boolean;

  @IsOptional()
  @IsIn([
    'createdAt',
    'updatedAt',
    'name',
    'state',
    'priority',
    'type',
    'nextExecutionAt',
    'executionCount',
  ])
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'state'
    | 'priority'
    | 'type'
    | 'nextExecutionAt'
    | 'executionCount';

  @IsOptional()
  @IsIn([
    'asc',
    'desc',
  ])
  sortDirection?:
    | 'asc'
    | 'desc';

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}

export class BulkJobActionDto {
  @IsArray()
  @IsString({
    each: true,
  })
  jobIds!: string[];

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  force?: boolean;

  @IsOptional()
  @IsBoolean()
  enqueueImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  resetAttemptCount?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  delayMs?: number;
}