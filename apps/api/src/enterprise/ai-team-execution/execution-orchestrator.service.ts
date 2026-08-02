import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

import {
  ExecutionJobRunnerService,
} from "./execution-job-runner.service";

import {
  ExecutionSchedulerService,
} from "./execution-scheduler.service";

export interface ExecutionOrchestratorResult {
  sessionId: string;
  status: ExecutionStatus;
  progress: number;
  executedJobs: number;
  executedSteps: number;
  failedSteps: number;
  waitingApproval: boolean;
  waitingJobId: string | null;
  waitingStepId: string | null;
}

@Injectable()
export class ExecutionOrchestratorService {
  private readonly maximumCycles = 100;

  constructor(
    private readonly repository:
      AiTeamExecutionRepository,

    private readonly scheduler:
      ExecutionSchedulerService,

    private readonly jobRunner:
      ExecutionJobRunnerService,
  ) {}

  async executeSession(
    sessionId: string,
  ): Promise<ExecutionOrchestratorResult> {
    const initialSession =
      await this.repository.findSessionById(
        sessionId,
      );

    if (!initialSession) {
      throw new NotFoundException(
        `Execution session was not found: ${sessionId}`,
      );
    }

    if (
      initialSession.status ===
        ExecutionStatus.COMPLETED ||
      initialSession.status ===
        ExecutionStatus.CANCELLED
    ) {
      throw new ConflictException(
        `Execution session cannot run from status: ${initialSession.status}`,
      );
    }

    if (
      initialSession.requiresHumanApproval &&
      !initialSession.approvedAt
    ) {
      return this.result(
        initialSession,
        {
          waitingApproval: true,
        },
      );
    }

    let executedJobs = 0;
    let executedSteps = 0;
    let failedSteps = 0;

    for (
      let cycle = 0;
      cycle < this.maximumCycles;
      cycle++
    ) {
      const tick =
        await this.scheduler.tick(
          sessionId,
        );

      if (
        tick.action ===
        "session-started"
      ) {
        continue;
      }

      if (
        tick.action ===
        "session-completed"
      ) {
        break;
      }

      if (
        tick.action === "no-jobs"
      ) {
        await this.repository.updateSessionStatus(
          sessionId,
          {
            status: ExecutionStatus.COMPLETED,
            progress: 100,
          },
        );

        break;
      }

      const jobId =
        tick.jobId ??
        tick.snapshot.nextJobId;

      if (!jobId) {
        await this.scheduler
          .synchronizeSessionProgress(
            sessionId,
          );

        break;
      }

      const job =
        await this.repository.findJobById(
          jobId,
        );

      if (!job) {
        throw new NotFoundException(
          `Scheduled execution job was not found: ${jobId}`,
        );
      }

      if (
        job.requiresApproval &&
        !job.approvedAt
      ) {
        const current =
          await this.getSessionOrThrow(
            sessionId,
          );

        return this.result(
          current,
          {
            executedJobs,
            executedSteps,
            failedSteps,
            waitingApproval: true,
            waitingJobId: jobId,
          },
        );
      }

      const runResult =
        await this.jobRunner.runJob(
          jobId,
        );

      executedSteps +=
        runResult.executedSteps;

      failedSteps +=
        runResult.failedSteps;

      if (
        runResult.state ===
        "waiting-approval"
      ) {
        const current =
          await this.getSessionOrThrow(
            sessionId,
          );

        return this.result(
          current,
          {
            executedJobs,
            executedSteps,
            failedSteps,
            waitingApproval: true,
            waitingJobId: jobId,
            waitingStepId:
              runResult.waitingStepId,
          },
        );
      }

      if (
        runResult.state === "failed"
      ) {
        const current =
          await this.getSessionOrThrow(
            sessionId,
          );

        await this.repository.updateSessionStatus(
          sessionId,
          {
            status: ExecutionStatus.FAILED,
            progress: current.progress,
            errorMessage:
              runResult.errorMessage ||
              "Execution job failed.",
          },
        );

        break;
      }

      executedJobs++;

      await this.scheduler
        .synchronizeSessionProgress(
          sessionId,
        );
    }

    const finalSession =
      await this.getSessionOrThrow(
        sessionId,
      );

    return this.result(
      finalSession,
      {
        executedJobs,
        executedSteps,
        failedSteps,
      },
    );
  }

  private async getSessionOrThrow(
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

  private result(
    session: {
      id: string;
      status: ExecutionStatus;
      progress: number;
    },
    values: Partial<
      Omit<
        ExecutionOrchestratorResult,
        "sessionId" |
        "status" |
        "progress"
      >
    > = {},
  ): ExecutionOrchestratorResult {
    return {
      sessionId: session.id,
      status: session.status,
      progress: session.progress,
      executedJobs:
        values.executedJobs ?? 0,
      executedSteps:
        values.executedSteps ?? 0,
      failedSteps:
        values.failedSteps ?? 0,
      waitingApproval:
        values.waitingApproval ?? false,
      waitingJobId:
        values.waitingJobId ?? null,
      waitingStepId:
        values.waitingStepId ?? null,
    };
  }
}