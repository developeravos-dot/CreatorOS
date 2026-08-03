import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateWorkflowExecutionRequest,
  WorkflowExecutionRuntime,
  WorkflowStepDefinition,
  WorkflowStepOrchestratorService,
  WorkflowStepRuntime,
} from '../orchestrator';
import {
  WorkflowExecutionEngineRunOptions,
  WorkflowExecutionEngineRunResult,
  WorkflowExecutionEngineService,
  WorkflowScheduledRetryActivationResult,
} from '../execution-engine';
import {
  CronScheduleRequest,
  DelayedScheduleRequest,
  ImmediateScheduleRequest,
  RecurringScheduleRequest,
  RetryScheduleRequest,
  WorkflowSchedule,
  WorkflowSchedulerService,
} from '../scheduler';

interface CreateExecutionBody {
  executionId?: string;
  workflowId: string;
  steps: WorkflowStepDefinition[];
  maxParallelSteps?: number;
}

interface RunExecutionBody {
  maxSteps?: number;
  stopOnFailure?: boolean;
}

interface SkipStepBody {
  reason?: string;
}

interface ImmediateScheduleBody
  extends ImmediateScheduleRequest {}

interface DelayedScheduleBody
  extends DelayedScheduleRequest {}

interface CronScheduleBody extends CronScheduleRequest {}

interface RecurringScheduleBody
  extends RecurringScheduleRequest {}

interface RetryScheduleBody extends RetryScheduleRequest {}

@Controller('enterprise/ai-team-execution/workflows')
export class WorkflowExecutionController {
  constructor(
    private readonly orchestrator:
      WorkflowStepOrchestratorService,
    private readonly engine:
      WorkflowExecutionEngineService,
    private readonly scheduler:
      WorkflowSchedulerService,
  ) {}

  @Post('executions')
  createExecution(
    @Body() body: CreateExecutionBody,
  ): WorkflowExecutionRuntime {
    const request: CreateWorkflowExecutionRequest = {
      workflowId: body.workflowId,
      steps: body.steps,
      ...(body.executionId !== undefined
        ? { executionId: body.executionId }
        : {}),
      ...(body.maxParallelSteps !== undefined
        ? {
            maxParallelSteps:
              body.maxParallelSteps,
          }
        : {}),
    };

    return this.orchestrator.createExecution(request);
  }

  @Get('executions')
  listExecutions(
    @Query('workflowId') workflowId?: string,
  ): WorkflowExecutionRuntime[] {
    return this.orchestrator.listExecutions(
      workflowId?.trim() || undefined,
    );
  }

  @Get('executions/:executionId')
  getExecution(
    @Param('executionId') executionId: string,
  ): WorkflowExecutionRuntime {
    return this.orchestrator.getExecution(
      executionId,
    );
  }

  @Post('executions/:executionId/run')
  @HttpCode(HttpStatus.OK)
  runExecution(
    @Param('executionId') executionId: string,
    @Body() body: RunExecutionBody = {},
  ): Promise<WorkflowExecutionEngineRunResult> {
    const options: WorkflowExecutionEngineRunOptions = {
      ...(body.maxSteps !== undefined
        ? { maxSteps: body.maxSteps }
        : {}),
      ...(body.stopOnFailure !== undefined
        ? {
            stopOnFailure:
              body.stopOnFailure,
          }
        : {}),
    };

    return this.engine.runExecution(
      executionId,
      options,
    );
  }

  @Post(
    'executions/:executionId/steps/:stepId/run',
  )
  @HttpCode(HttpStatus.OK)
  runSingleStep(
    @Param('executionId') executionId: string,
    @Param('stepId') stepId: string,
  ): Promise<WorkflowExecutionEngineRunResult> {
    return this.engine.runSingleStep(
      executionId,
      stepId,
    );
  }

  @Get(
    'executions/:executionId/steps/ready',
  )
  listReadySteps(
    @Param('executionId') executionId: string,
  ): WorkflowStepRuntime[] {
    return this.orchestrator.listReadySteps(
      executionId,
    );
  }

  @Post(
    'executions/:executionId/steps/:stepId/skip',
  )
  @HttpCode(HttpStatus.OK)
  skipStep(
    @Param('executionId') executionId: string,
    @Param('stepId') stepId: string,
    @Body() body: SkipStepBody = {},
  ): WorkflowStepRuntime {
    return this.orchestrator.skipStep(
      executionId,
      stepId,
      body.reason,
    );
  }

  @Post('executions/:executionId/pause')
  @HttpCode(HttpStatus.OK)
  pauseExecution(
    @Param('executionId') executionId: string,
  ): WorkflowExecutionRuntime {
    return this.orchestrator.pauseExecution(
      executionId,
    );
  }

  @Post('executions/:executionId/resume')
  @HttpCode(HttpStatus.OK)
  resumeExecution(
    @Param('executionId') executionId: string,
  ): WorkflowExecutionRuntime {
    return this.orchestrator.resumeExecution(
      executionId,
    );
  }

  @Post('executions/:executionId/cancel')
  @HttpCode(HttpStatus.OK)
  cancelExecution(
    @Param('executionId') executionId: string,
  ): WorkflowExecutionRuntime {
    return this.orchestrator.cancelExecution(
      executionId,
    );
  }

  @Post('schedules/immediate')
  createImmediateSchedule(
    @Body() body: ImmediateScheduleBody,
  ): WorkflowSchedule {
    return this.scheduler.scheduleImmediate(body);
  }

  @Post('schedules/delayed')
  createDelayedSchedule(
    @Body() body: DelayedScheduleBody,
  ): WorkflowSchedule {
    return this.scheduler.scheduleDelayed(body);
  }

  @Post('schedules/cron')
  createCronSchedule(
    @Body() body: CronScheduleBody,
  ): WorkflowSchedule {
    return this.scheduler.scheduleCron(body);
  }

  @Post('schedules/recurring')
  createRecurringSchedule(
    @Body() body: RecurringScheduleBody,
  ): WorkflowSchedule {
    return this.scheduler.scheduleRecurring(body);
  }

  @Post('schedules/retry')
  createRetrySchedule(
    @Body() body: RetryScheduleBody,
  ): WorkflowSchedule {
    return this.scheduler.scheduleRetry(body);
  }

  @Get('schedules')
  listSchedules(
    @Query('workflowId') workflowId?: string,
  ): WorkflowSchedule[] {
    return this.scheduler.listSchedules(
      workflowId?.trim() || undefined,
    );
  }

  @Get('schedules/due')
  listDueSchedules(
    @Query('at') at?: string,
  ): WorkflowSchedule[] {
    return this.scheduler.listDueSchedules(
      this.parseOptionalDate(at),
    );
  }

  @Get('schedules/:scheduleId')
  getSchedule(
    @Param('scheduleId') scheduleId: string,
  ): WorkflowSchedule {
    return this.scheduler.getSchedule(scheduleId);
  }

  @Post('schedules/:scheduleId/pause')
  @HttpCode(HttpStatus.OK)
  pauseSchedule(
    @Param('scheduleId') scheduleId: string,
  ): WorkflowSchedule {
    return this.scheduler.pauseSchedule(scheduleId);
  }

  @Post('schedules/:scheduleId/resume')
  @HttpCode(HttpStatus.OK)
  resumeSchedule(
    @Param('scheduleId') scheduleId: string,
  ): WorkflowSchedule {
    return this.scheduler.resumeSchedule(scheduleId);
  }

  @Post('schedules/:scheduleId/cancel')
  @HttpCode(HttpStatus.OK)
  cancelSchedule(
    @Param('scheduleId') scheduleId: string,
  ): WorkflowSchedule {
    return this.scheduler.cancelSchedule(scheduleId);
  }

  @Post('retries/activate-due')
  @HttpCode(HttpStatus.OK)
  activateDueRetries(
    @Query('at') at?: string,
  ): WorkflowScheduledRetryActivationResult[] {
    return this.engine.activateDueRetrySchedules(
      this.parseOptionalDate(at),
    );
  }

  @Post('executions/run-due')
  @HttpCode(HttpStatus.OK)
  runDueExecutions(
    @Query('at') at?: string,
    @Body() body: RunExecutionBody = {},
  ): Promise<WorkflowExecutionEngineRunResult[]> {
    return this.engine.runDueExecutions(
      this.parseOptionalDate(at),
      {
        ...(body.maxSteps !== undefined
          ? { maxSteps: body.maxSteps }
          : {}),
        ...(body.stopOnFailure !== undefined
          ? {
              stopOnFailure:
                body.stopOnFailure,
            }
          : {}),
      },
    );
  }

  private parseOptionalDate(
    value?: string,
  ): Date {
    if (!value?.trim()) {
      return new Date();
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        'at must be a valid ISO date.',
      );
    }

    return date;
  }
}
