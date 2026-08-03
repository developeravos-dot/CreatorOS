import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import type {
  JobListQueryContract,
} from '../contracts';
import {
  BulkJobActionDto,
  CancelJobDto,
  CompleteJobExecutionDto,
  CreateJobDto,
  CreateJobQueueDto,
  CreateJobScheduleDto,
  FailJobExecutionDto,
  JobListQueryDto,
  PauseJobDto,
  ResumeJobDto,
  RetryJobDto,
  StartJobExecutionDto,
  UpdateJobDto,
  UpdateJobProgressDto,
  UpdateJobQueueDto,
  UpdateJobScheduleDto,
} from '../dto';
import type {
  JobFailureKind,
  JobQueueConfiguration,
  JobScheduleDefinition,
} from '../models';
import {
  JobEngineService,
  JobOperationsService,
  JobQueryService,
  JobQueueFactoryService,
  JobSchedulerService,
} from '../services';

@Controller('jobs')
export class SchedulingJobsController {
  constructor(
    private readonly engine:
      JobEngineService,

    private readonly scheduler:
      JobSchedulerService,

    private readonly query:
      JobQueryService,

    private readonly operations:
      JobOperationsService,

    private readonly queues:
      JobQueueFactoryService,
  ) {}

  @Get()
  list(
    @Query()
    query:
      JobListQueryDto,
  ) {
    return this.query.searchJobs(
      query as JobListQueryContract,
    );
  }

  @Get('executions')
  executions() {
    return this.engine
      .listExecutions();
  }

  @Get('schedules')
  schedules() {
    return this.scheduler.list();
  }

  @Get('queues')
  queuesList() {
    return this.query
      .searchQueues();
  }

  @Get('statistics')
  statistics() {
    return this.operations
      .statistics();
  }

  @Get('metrics')
  metrics() {
    return this.operations
      .metrics();
  }

  @Get('health')
  health() {
    return this.operations
      .health();
  }

  @Get('delayed')
  delayedJobs() {
    return this.operations
      .delayedJobs();
  }

  @Get('failed')
  failedJobs() {
    return this.operations
      .failedJobs();
  }

  @Get('retries')
  pendingRetries() {
    return this.operations
      .pendingRetries();
  }

  @Get('running')
  runningJobs() {
    return this.operations
      .runningJobs();
  }

  @Get('scheduled')
  scheduledJobs() {
    return this.operations
      .scheduledJobs();
  }

  @Post()
  create(
    @Body()
    input:
      CreateJobDto,
  ) {
    return this.engine.create({
      id:
        input.id,
      name:
        input.name,
      description:
        input.description,
      type:
        input.type,
      priority:
        input.priority,
      queueName:
        input.queueName,
      payload:
        input.payload,
      schemaVersion:
        input.schemaVersion,
      correlation:
        input.correlation,
      ownership:
        input.ownership,
      dependencies:
        input.dependencies?.map(
          (dependency) => ({
            jobId:
              dependency.jobId,
            requiredState:
              'completed',
            optional:
              dependency.optional ??
              false,
          }),
        ),
      tags:
        input.tags,
      labels:
        input.labels,
    });
  }

  @Post('scheduler/tick')
  schedulerTick(
    @Body()
    input: {
      now?: string;
      maximumJobs?: number;
      queueNames?: string[];
    },
  ) {
    return this.scheduler.tick(
      input,
    );
  }

  @Post('bulk/pause')
  bulkPause(
    @Body()
    input:
      BulkJobActionDto,
  ) {
    return this.operations.bulkPause({
      jobIds:
        input.jobIds,
      requestedBy:
        input.requestedBy,
      reason:
        input.reason,
      pauseRunningExecutions:
        false,
    });
  }

  @Post('bulk/resume')
  bulkResume(
    @Body()
    input:
      BulkJobActionDto,
  ) {
    return this.operations.bulkResume({
      jobIds:
        input.jobIds,
      requestedBy:
        input.requestedBy,
      enqueueImmediately:
        input.enqueueImmediately ??
        false,
    });
  }

  @Post('bulk/cancel')
  bulkCancel(
    @Body()
    input:
      BulkJobActionDto,
  ) {
    return this.operations.bulkCancel({
      jobIds:
        input.jobIds,
      requestedBy:
        input.requestedBy,
      reason:
        input.reason,
      force:
        input.force ??
        false,
    });
  }

  @Post('bulk/retry')
  bulkRetry(
    @Body()
    input:
      BulkJobActionDto,
  ) {
    return this.operations.bulkRetry({
      jobIds:
        input.jobIds,
      requestedBy:
        input.requestedBy,
      reason:
        input.reason,
      resetAttemptCount:
        input.resetAttemptCount ??
        false,
      delayMs:
        input.delayMs,
    });
  }

  @Post('bulk/delete')
  bulkDelete(
    @Body()
    input:
      BulkJobActionDto,
  ) {
    return this.operations.bulkDelete({
      jobIds:
        input.jobIds,
      force:
        input.force ??
        false,
      deleteHistory:
        true,
      deleteExecutions:
        true,
      deleteSchedule:
        true,
    });
  }

  @Post('queues')
  createQueue(
    @Body()
    input:
      CreateJobQueueDto,
  ) {
    return this.queues.create(
      input.name,
      {
        driver:
          input.driver ??
          'memory',
        concurrency:
          input.concurrency ??
          1,
        rateLimitPerSecond:
          input.rateLimitPerSecond,
        defaultPriority:
          input.defaultPriority ??
          'normal',
        paused:
          input.paused ??
          false,
        removeCompletedJobs:
          input.removeCompletedJobs ??
          false,
        removeFailedJobs:
          input.removeFailedJobs ??
          false,
      },
    ).getConfiguration();
  }

  @Patch('queues/:queueName')
  updateQueue(
    @Param('queueName')
    queueName: string,

    @Body()
    input:
      UpdateJobQueueDto,
  ) {
    const adapter =
      this.queues.require(
        queueName,
      );

    const current =
      adapter.getConfiguration();

    const configuration:
      JobQueueConfiguration = {
        ...current,
        driver:
          input.driver ??
          current.driver,
        concurrency:
          input.concurrency ??
          current.concurrency,
        rateLimitPerSecond:
          input.rateLimitPerSecond ??
          current.rateLimitPerSecond,
        defaultPriority:
          input.defaultPriority ??
          current.defaultPriority,
        paused:
          input.paused ??
          current.paused,
        removeCompletedJobs:
          input.removeCompletedJobs ??
          current.removeCompletedJobs,
        removeFailedJobs:
          input.removeFailedJobs ??
          current.removeFailedJobs,
      };

    adapter.configure(
      configuration,
    );

    return adapter
      .getConfiguration();
  }

  @Post('queues/:queueName/pause')
  pauseQueue(
    @Param('queueName')
    queueName: string,
  ) {
    const adapter =
      this.queues.require(
        queueName,
      );

    adapter.pause();

    return {
      queueName,
      paused: true,
    };
  }

  @Post('queues/:queueName/resume')
  resumeQueue(
    @Param('queueName')
    queueName: string,
  ) {
    const adapter =
      this.queues.require(
        queueName,
      );

    adapter.resume();

    return {
      queueName,
      paused: false,
    };
  }

  @Delete('queues/:queueName')
  deleteQueue(
    @Param('queueName')
    queueName: string,
  ) {
    return {
      queueName,
      deleted:
        this.queues.remove(
          queueName,
        ),
    };
  }

  @Get('executions/:executionId')
  executionDetails(
    @Param('executionId')
    executionId: string,
  ) {
    const execution =
      this.engine.getExecutionById(
        executionId,
      );

    if (!execution) {
      throw new NotFoundException(
        `Execution ${executionId} was not found.`,
      );
    }

    return execution;
  }

  @Post('executions/:executionId/start')
  startExecution(
    @Param('executionId')
    executionId: string,

    @Body()
    input:
      StartJobExecutionDto,
  ) {
    return this.engine.startExecution(
      executionId,
      input.workerId,
    );
  }

  @Patch('executions/:executionId/progress')
  updateExecutionProgress(
    @Param('executionId')
    executionId: string,

    @Body()
    input:
      UpdateJobProgressDto,
  ) {
    return this.engine.updateProgress(
      executionId,
      input,
    );
  }

  @Post('executions/:executionId/complete')
  completeExecution(
    @Param('executionId')
    executionId: string,

    @Body()
    input:
      CompleteJobExecutionDto,
  ) {
    return this.engine.completeExecution(
      executionId,
      input,
    );
  }

  @Post('executions/:executionId/fail')
  failExecution(
    @Param('executionId')
    executionId: string,

    @Body()
    input:
      FailJobExecutionDto,
  ) {
    return this.engine.failExecution(
      executionId,
      {
        kind:
          input.kind as
            JobFailureKind,
        code:
          input.code,
        message:
          input.message,
        retryable:
          input.retryable,
        occurredAt:
          input.finishedAt ??
          new Date()
            .toISOString(),
        details:
          input.details,
      },
    );
  }

  @Get('schedules/:scheduleId')
  scheduleDetails(
    @Param('scheduleId')
    scheduleId: string,
  ) {
    const schedule =
      this.scheduler.getById(
        scheduleId,
      );

    if (!schedule) {
      throw new NotFoundException(
        `Schedule ${scheduleId} was not found.`,
      );
    }

    return schedule;
  }

  @Post('schedules')
  createSchedule(
    @Body()
    input:
      CreateJobScheduleDto,
  ) {
    return this.scheduler.createSchedule({
      jobId:
        input.jobId,
      definition:
        this.toScheduleDefinition(
          input,
        ),
      enabled:
        input.enabled,
    });
  }

  @Patch('schedules/:scheduleId')
  updateSchedule(
    @Param('scheduleId')
    scheduleId: string,

    @Body()
    input:
      UpdateJobScheduleDto,
  ) {
    return this.scheduler.updateSchedule(
      scheduleId,
      {
        definition:
          input.kind
            ? this.toScheduleDefinition(
                input as
                  CreateJobScheduleDto,
              )
            : undefined,
        enabled:
          input.enabled,
      },
    );
  }

  @Post('schedules/:scheduleId/enable')
  enableSchedule(
    @Param('scheduleId')
    scheduleId: string,
  ) {
    return this.scheduler
      .enableSchedule(
        scheduleId,
      );
  }

  @Post('schedules/:scheduleId/disable')
  disableSchedule(
    @Param('scheduleId')
    scheduleId: string,
  ) {
    return this.scheduler
      .disableSchedule(
        scheduleId,
      );
  }

  @Post('schedules/:scheduleId/trigger')
  triggerSchedule(
    @Param('scheduleId')
    scheduleId: string,
  ) {
    return this.scheduler
      .triggerNow(
        scheduleId,
      );
  }

  @Delete('schedules/:scheduleId')
  deleteSchedule(
    @Param('scheduleId')
    scheduleId: string,
  ) {
    return {
      scheduleId,
      deleted:
        this.scheduler
          .deleteSchedule(
            scheduleId,
          ),
    };
  }

  @Get(':jobId/history')
  history(
    @Param('jobId')
    jobId: string,
  ) {
    const history =
      this.engine.getHistory(
        jobId,
      );

    if (!history) {
      throw new NotFoundException(
        `Job ${jobId} was not found.`,
      );
    }

    return history;
  }

  @Post(':jobId/enqueue')
  enqueue(
    @Param('jobId')
    jobId: string,

    @Body()
    input: {
      queueName?: string;
      delayMs?: number;
    },
  ) {
    return this.engine.enqueue(
      jobId,
      input,
    );
  }

  @Post(':jobId/pause')
  pause(
    @Param('jobId')
    jobId: string,

    @Body()
    input:
      PauseJobDto,
  ) {
    return this.engine.pause(
      jobId,
      input.reason,
      input.requestedBy,
    );
  }

  @Post(':jobId/resume')
  resume(
    @Param('jobId')
    jobId: string,

    @Body()
    _input:
      ResumeJobDto,
  ) {
    return this.engine.resume(
      jobId,
    );
  }

  @Post(':jobId/cancel')
  cancel(
    @Param('jobId')
    jobId: string,

    @Body()
    input:
      CancelJobDto,
  ) {
    return this.engine.cancel(
      jobId,
      input.reason,
      input.requestedBy,
    );
  }

  @Post(':jobId/retry')
  retry(
    @Param('jobId')
    jobId: string,

    @Body()
    input:
      RetryJobDto,
  ) {
    return this.engine.retry(
      jobId,
      input.delayMs ?? 0,
    );
  }

  @Patch(':jobId')
  update(
    @Param('jobId')
    jobId: string,

    @Body()
    input:
      UpdateJobDto,
  ) {
    return this.engine.update(
      jobId,
      input,
    );
  }

  @Delete(':jobId')
  delete(
    @Param('jobId')
    jobId: string,
  ) {
    return {
      jobId,
      deleted:
        this.engine.delete(
          jobId,
        ),
    };
  }

  @Get(':jobId')
  details(
    @Param('jobId')
    jobId: string,
  ) {
    const job =
      this.engine.getById(
        jobId,
      );

    if (!job) {
      throw new NotFoundException(
        `Job ${jobId} was not found.`,
      );
    }

    return job;
  }

  private toScheduleDefinition(
    input:
      CreateJobScheduleDto,
  ): JobScheduleDefinition {
    switch (input.kind) {
      case 'immediate':
        return {
          kind: 'immediate',
          enqueueAt:
            input.startAt ??
            new Date()
              .toISOString(),
        };

      case 'delayed':
        return {
          kind: 'delayed',
          runAt:
            input.runAt!,
          delayMs:
            input.delayMs ??
            0,
        };

      case 'cron':
        return {
          kind: 'cron',
          expression:
            input.expression!,
          timezone:
            input.timezone ??
            'UTC',
          startAt:
            input.startAt,
          endAt:
            input.endAt,
          maximumRuns:
            input.maximumRuns,
        };

      case 'interval':
        return {
          kind: 'interval',
          intervalMs:
            input.intervalMs!,
          startAt:
            input.startAt ??
            new Date()
              .toISOString(),
          endAt:
            input.endAt,
          maximumRuns:
            input.maximumRuns,
          runImmediately:
            input.runImmediately ??
            false,
        };

      case 'manual':
        return {
          kind: 'manual',
        };
    }
  }
}