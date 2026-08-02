import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import type {
  CreateExecutionJobInput,
  CreateExecutionResultInput,
  CreateExecutionSessionInput,
  CreateExecutionStepInput,
  UpdateExecutionStatusInput,
} from "./ai-team-execution.contracts";

import {
  AiTeamExecutionService,
} from "./ai-team-execution.service";

import {
  ExecutionSchedulerService,
} from "./execution-scheduler.service";

@Controller(
  "enterprise/ai-team-execution",
)
export class AiTeamExecutionController {
  constructor(
    private readonly service:
      AiTeamExecutionService,

    private readonly scheduler:
      ExecutionSchedulerService,
  ) {}

  @Get("health")
  getHealth() {
    return this.service.getHealth();
  }

  @Get("sessions")
  listSessions() {
    return this.service.listSessions();
  }

  @Get("sessions/:sessionId")
  getSession(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.service.getSession(sessionId);
  }

  @Post("sessions")
  createSession(
    @Body()
    input: CreateExecutionSessionInput,
  ) {
    return this.service.createSession(input);
  }

  @Patch("sessions/:sessionId/status")
  updateSessionStatus(
    @Param("sessionId")
    sessionId: string,

    @Body()
    input: UpdateExecutionStatusInput,
  ) {
    return this.service.updateSessionStatus(
      sessionId,
      input,
    );
  }

  @Post("sessions/:sessionId/jobs")
  createJob(
    @Param("sessionId")
    sessionId: string,

    @Body()
    input: CreateExecutionJobInput,
  ) {
    return this.service.createJob(
      sessionId,
      input,
    );
  }

  @Patch("jobs/:jobId/status")
  updateJobStatus(
    @Param("jobId")
    jobId: string,

    @Body()
    input: UpdateExecutionStatusInput,
  ) {
    return this.service.updateJobStatus(
      jobId,
      input,
    );
  }

  @Post("jobs/:jobId/steps")
  createStep(
    @Param("jobId")
    jobId: string,

    @Body()
    input: CreateExecutionStepInput,
  ) {
    return this.service.createStep(
      jobId,
      input,
    );
  }

  @Patch("steps/:stepId/status")
  updateStepStatus(
    @Param("stepId")
    stepId: string,

    @Body()
    input: UpdateExecutionStatusInput,
  ) {
    return this.service.updateStepStatus(
      stepId,
      input,
    );
  }

  @Post("steps/:stepId/results")
  createResult(
    @Param("stepId")
    stepId: string,

    @Body()
    input: CreateExecutionResultInput,
  ) {
    return this.service.createResult(
      stepId,
      input,
    );
  }

  @Get("sessions/:sessionId/scheduler")
  getSchedulerSnapshot(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.scheduler.getSnapshot(
      sessionId,
    );
  }

  @Post("sessions/:sessionId/scheduler/start")
  startScheduledSession(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.scheduler.startSession(
      sessionId,
    );
  }

  @Post("sessions/:sessionId/scheduler/next")
  scheduleNextJob(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.scheduler.scheduleNextJob(
      sessionId,
    );
  }

  @Post("sessions/:sessionId/scheduler/tick")
  tickScheduler(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.scheduler.tick(sessionId);
  }

  @Post("sessions/:sessionId/scheduler/sync")
  synchronizeScheduler(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.scheduler.synchronizeSessionProgress(
      sessionId,
    );
  }

  @Post("sessions/:sessionId/scheduler/cancel")
  cancelScheduledSession(
    @Param("sessionId")
    sessionId: string,
  ) {
    return this.scheduler.cancelSession(
      sessionId,
    );
  }}