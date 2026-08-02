import {
  Injectable,
} from "@nestjs/common";

import {
  ExecutionStatus,
  Prisma,
} from "../../generated/prisma/client";

import {
  PrismaService,
} from "../../modules/persistence/prisma.service";

import type {
  CreateExecutionJobInput,
  CreateExecutionResultInput,
  CreateExecutionSessionInput,
  CreateExecutionStepInput,
  UpdateExecutionStatusInput,
} from "./ai-team-execution.contracts";

@Injectable()
export class AiTeamExecutionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findWorkspaceByKey(
    workspaceKey: string,
  ) {
    return this.prisma.aiOrganizationWorkspaceState.findUnique({
      where: {
        workspaceKey,
      },
    });
  }

  listSessions() {
    return this.prisma.executionSession.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        jobs: {
          orderBy: {
            sequence: "asc",
          },
          include: {
            steps: {
              orderBy: {
                sequence: "asc",
              },
              include: {
                results: {
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findSessionById(
    sessionId: string,
  ) {
    return this.prisma.executionSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        workspace: true,
        jobs: {
          orderBy: [
            {
              priority: "desc",
            },
            {
              sequence: "asc",
            },
          ],
          include: {
            steps: {
              orderBy: {
                sequence: "asc",
              },
              include: {
                results: {
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findJobById(
    jobId: string,
  ) {
    return this.prisma.executionJob.findUnique({
      where: {
        id: jobId,
      },
      include: {
        session: true,
        steps: {
          orderBy: {
            sequence: "asc",
          },
          include: {
            results: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });
  }

  findStepById(
    stepId: string,
  ) {
    return this.prisma.executionStep.findUnique({
      where: {
        id: stepId,
      },
      include: {
        job: {
          include: {
            session: true,
          },
        },
        results: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  createSession(
    workspaceId: string,
    input: CreateExecutionSessionInput & {
      sessionKey: string;
    },
  ) {
    return this.prisma.executionSession.create({
      data: {
        workspaceId,
        projectId: input.projectId ?? null,
        sessionKey: input.sessionKey,
        name: input.name,
        objective: input.objective ?? null,
        requiresHumanApproval:
          input.requiresHumanApproval ?? false,
        metadata: this.json(input.metadata),
        context: this.json(input.context),
      },
      include: {
        jobs: true,
      },
    });
  }

  createJob(
    sessionId: string,
    input: CreateExecutionJobInput & {
      jobKey: string;
    },
  ) {
    return this.prisma.executionJob.create({
      data: {
        sessionId,
        jobKey: input.jobKey,
        name: input.name,
        description: input.description ?? null,
        assignedAgentId:
          input.assignedAgentId ?? null,
        runtimeProviderId:
          input.runtimeProviderId ?? null,
        capability: input.capability ?? null,
        priority: input.priority ?? 0,
        sequence: input.sequence,
        maxRetries: input.maxRetries ?? 3,
        requiresApproval:
          input.requiresApproval ?? false,
        input: this.json(input.input),
        metadata: this.json(input.metadata),
      },
      include: {
        steps: true,
      },
    });
  }

  createStep(
    jobId: string,
    input: CreateExecutionStepInput & {
      stepKey: string;
    },
  ) {
    return this.prisma.executionStep.create({
      data: {
        jobId,
        stepKey: input.stepKey,
        name: input.name,
        description: input.description ?? null,
        sequence: input.sequence,
        runtimeProviderId:
          input.runtimeProviderId ?? null,
        operation: input.operation ?? null,
        maxRetries: input.maxRetries ?? 3,
        requiresApproval:
          input.requiresApproval ?? false,
        input: this.json(input.input),
        metadata: this.json(input.metadata),
      },
      include: {
        results: true,
      },
    });
  }

  createResult(
    stepId: string,
    input: CreateExecutionResultInput,
  ) {
    return this.prisma.executionResult.create({
      data: {
        stepId,
        resultType: input.resultType,
        success: input.success,
        output: this.json(input.output),
        logs: this.json(input.logs),
        metrics: this.json(input.metrics),
        artifacts: this.json(input.artifacts),
        errorCode: input.errorCode ?? null,
        errorMessage:
          input.errorMessage ?? null,
        durationMs: input.durationMs ?? null,
      },
    });
  }

  updateSessionStatus(
    sessionId: string,
    input: UpdateExecutionStatusInput,
  ) {
    const now = new Date();

    return this.prisma.executionSession.update({
      where: {
        id: sessionId,
      },
      data: {
        status: input.status,
        progress:
          input.progress === undefined
            ? undefined
            : this.progress(input.progress),
        errorMessage:
          input.errorMessage === undefined
            ? undefined
            : input.errorMessage,
        finalOutput:
          input.output === undefined
            ? undefined
            : this.json(input.output),
        startedAt:
          input.status === ExecutionStatus.RUNNING
            ? now
            : undefined,
        completedAt:
          input.status === ExecutionStatus.COMPLETED
            ? now
            : undefined,
        failedAt:
          input.status === ExecutionStatus.FAILED
            ? now
            : undefined,
        cancelledAt:
          input.status === ExecutionStatus.CANCELLED
            ? now
            : undefined,
      },
    });
  }

  updateJobStatus(
    jobId: string,
    input: UpdateExecutionStatusInput,
  ) {
    const now = new Date();

    return this.prisma.executionJob.update({
      where: {
        id: jobId,
      },
      data: {
        status: input.status,
        progress:
          input.progress === undefined
            ? undefined
            : this.progress(input.progress),
        errorMessage:
          input.errorMessage === undefined
            ? undefined
            : input.errorMessage,
        output:
          input.output === undefined
            ? undefined
            : this.json(input.output),
        startedAt:
          input.status === ExecutionStatus.RUNNING
            ? now
            : undefined,
        completedAt:
          input.status === ExecutionStatus.COMPLETED
            ? now
            : undefined,
        failedAt:
          input.status === ExecutionStatus.FAILED
            ? now
            : undefined,
        cancelledAt:
          input.status === ExecutionStatus.CANCELLED
            ? now
            : undefined,
      },
    });
  }

  updateStepStatus(
    stepId: string,
    input: UpdateExecutionStatusInput,
  ) {
    const now = new Date();

    return this.prisma.executionStep.update({
      where: {
        id: stepId,
      },
      data: {
        status: input.status,
        progress:
          input.progress === undefined
            ? undefined
            : this.progress(input.progress),
        errorMessage:
          input.errorMessage === undefined
            ? undefined
            : input.errorMessage,
        output:
          input.output === undefined
            ? undefined
            : this.json(input.output),
        startedAt:
          input.status === ExecutionStatus.RUNNING
            ? now
            : undefined,
        completedAt:
          input.status === ExecutionStatus.COMPLETED
            ? now
            : undefined,
        failedAt:
          input.status === ExecutionStatus.FAILED
            ? now
            : undefined,
        cancelledAt:
          input.status === ExecutionStatus.CANCELLED
            ? now
            : undefined,
      },
    });
  }

  private progress(
    value: number,
  ): number {
    return Math.min(
      100,
      Math.max(0, Math.round(value)),
    );
  }

  private json(
    value:
      | Record<string, unknown>
      | undefined,
  ): Prisma.InputJsonValue | undefined {
    return value === undefined
      ? undefined
      : (value as Prisma.InputJsonValue);
  }
}