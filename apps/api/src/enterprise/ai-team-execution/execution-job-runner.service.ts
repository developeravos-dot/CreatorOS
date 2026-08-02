import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

import type {
  ExecutionJobRunResult,
} from "./execution-job-runner.contracts";

import {
  RuntimeExecutionGatewayService,
} from "./runtime-execution-gateway.service";

@Injectable()
export class ExecutionJobRunnerService {
  constructor(
    private readonly repository:
      AiTeamExecutionRepository,

    private readonly gateway:
      RuntimeExecutionGatewayService,
  ) {}

  async runJob(
    jobId: string,
  ): Promise<ExecutionJobRunResult> {
    const job =
      await this.repository.findJobById(
        jobId,
      );

    if (!job) {
      throw new NotFoundException(
        `Execution job was not found: ${jobId}`,
      );
    }

    const executableSteps =
      job.steps
        .filter(
          (step) =>
            step.status ===
              ExecutionStatus.PENDING ||
            step.status ===
              ExecutionStatus.FAILED,
        )
        .sort(
          (left, right) =>
            left.sequence - right.sequence,
        );

    if (executableSteps.length === 0) {
      await this.repository.updateJobStatus(
        jobId,
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );

      return {
        jobId,
        state: "no-steps",
        executedSteps: 0,
        failedSteps: 0,
        waitingStepId: null,
        errorMessage: null,
      };
    }

    let executedSteps = 0;

    for (const step of executableSteps) {
      if (
        step.requiresApproval &&
        !step.approvedAt
      ) {
        return {
          jobId,
          state: "waiting-approval",
          executedSteps,
          failedSteps: 0,
          waitingStepId: step.id,
          errorMessage: null,
        };
      }

      const result =
        await this.gateway.executeStep(
          step.id,
        );

      executedSteps++;

      if (!result.success) {
        await this.repository.updateJobStatus(
          jobId,
          {
            status: ExecutionStatus.FAILED,
            progress: job.progress,
            errorMessage:
              result.errorMessage ||
              "Runtime step execution failed.",
          },
        );

        return {
          jobId,
          state: "failed",
          executedSteps,
          failedSteps: 1,
          waitingStepId: null,
          errorMessage:
            result.errorMessage ||
            "Runtime step execution failed.",
        };
      }
    }

    const refreshedJob =
      await this.repository.findJobById(
        jobId,
      );

    if (!refreshedJob) {
      throw new NotFoundException(
        `Execution job disappeared after execution: ${jobId}`,
      );
    }

    const allCompleted =
      refreshedJob.steps.every(
        (step) =>
          step.status ===
          ExecutionStatus.COMPLETED,
      );

    if (allCompleted) {
      await this.repository.updateJobStatus(
        jobId,
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );
    }

    return {
      jobId,
      state: allCompleted
        ? "completed"
        : "failed",
      executedSteps,
      failedSteps: allCompleted ? 0 : 1,
      waitingStepId: null,
      errorMessage: allCompleted
        ? null
        : "One or more execution steps did not complete.",
    };
  }
}