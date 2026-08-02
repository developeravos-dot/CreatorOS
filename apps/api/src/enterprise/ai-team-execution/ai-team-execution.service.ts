import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  randomUUID,
} from "node:crypto";

import type {
  CreateExecutionJobInput,
  CreateExecutionResultInput,
  CreateExecutionSessionInput,
  CreateExecutionStepInput,
  ExecutionDomainHealth,
  UpdateExecutionStatusInput,
} from "./ai-team-execution.contracts";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

@Injectable()
export class AiTeamExecutionService {
  constructor(
    private readonly repository:
      AiTeamExecutionRepository,
  ) {}

  getHealth(): ExecutionDomainHealth {
    return {
      status: "operational",
      persistence: "postgresql",
      orm: "prisma",
      runtimeIntegration: "ready",
      humanFinalAuthority: true,
    };
  }

  listSessions() {
    return this.repository.listSessions();
  }

  async getSession(
    sessionId: string,
  ) {
    const session =
      await this.repository.findSessionById(
        sessionId,
      );

    if (!session) {
      throw new NotFoundException(
        `Execution session was not found: ${sessionId}`,
      );
    }

    return session;
  }

  async createSession(
    input: CreateExecutionSessionInput,
  ) {
    if (!input.name?.trim()) {
      throw new BadRequestException(
        "Execution session name is required.",
      );
    }

    const workspace =
      await this.repository.findWorkspaceByKey(
        input.workspaceKey,
      );

    if (!workspace) {
      throw new NotFoundException(
        `AI Organization workspace was not found: ${input.workspaceKey}`,
      );
    }

    return this.repository.createSession(
      workspace.id,
      {
        ...input,
        name: input.name.trim(),
        sessionKey:
          input.sessionKey?.trim() ||
          `execution-session-${randomUUID()}`,
      },
    );
  }

  async createJob(
    sessionId: string,
    input: CreateExecutionJobInput,
  ) {
    if (!input.name?.trim()) {
      throw new BadRequestException(
        "Execution job name is required.",
      );
    }

    await this.getSession(sessionId);

    return this.repository.createJob(
      sessionId,
      {
        ...input,
        name: input.name.trim(),
        jobKey:
          input.jobKey?.trim() ||
          `execution-job-${randomUUID()}`,
      },
    );
  }

  async createStep(
    jobId: string,
    input: CreateExecutionStepInput,
  ) {
    if (!input.name?.trim()) {
      throw new BadRequestException(
        "Execution step name is required.",
      );
    }

    const job =
      await this.repository.findJobById(jobId);

    if (!job) {
      throw new NotFoundException(
        `Execution job was not found: ${jobId}`,
      );
    }

    return this.repository.createStep(
      jobId,
      {
        ...input,
        name: input.name.trim(),
        stepKey:
          input.stepKey?.trim() ||
          `execution-step-${randomUUID()}`,
      },
    );
  }

  async createResult(
    stepId: string,
    input: CreateExecutionResultInput,
  ) {
    if (!input.resultType?.trim()) {
      throw new BadRequestException(
        "Execution result type is required.",
      );
    }

    const step =
      await this.repository.findStepById(stepId);

    if (!step) {
      throw new NotFoundException(
        `Execution step was not found: ${stepId}`,
      );
    }

    return this.repository.createResult(
      stepId,
      {
        ...input,
        resultType: input.resultType.trim(),
      },
    );
  }

  async updateSessionStatus(
    sessionId: string,
    input: UpdateExecutionStatusInput,
  ) {
    await this.getSession(sessionId);

    return this.repository.updateSessionStatus(
      sessionId,
      input,
    );
  }

  async updateJobStatus(
    jobId: string,
    input: UpdateExecutionStatusInput,
  ) {
    const job =
      await this.repository.findJobById(jobId);

    if (!job) {
      throw new NotFoundException(
        `Execution job was not found: ${jobId}`,
      );
    }

    return this.repository.updateJobStatus(
      jobId,
      input,
    );
  }

  async updateStepStatus(
    stepId: string,
    input: UpdateExecutionStatusInput,
  ) {
    const step =
      await this.repository.findStepById(stepId);

    if (!step) {
      throw new NotFoundException(
        `Execution step was not found: ${stepId}`,
      );
    }

    return this.repository.updateStepStatus(
      stepId,
      input,
    );
  }
}