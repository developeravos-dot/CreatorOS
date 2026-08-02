import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";

import {
  ModuleRef,
} from "@nestjs/core";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  AiStudioRuntimeCommandService,
} from "../ai-studio-runtime/ai-studio-runtime-command.service";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

import type {
  ExecuteRuntimeStepInput,
  RuntimeExecutionOperation,
  RuntimeGatewayCommand,
  RuntimeGatewayExecutionResult,
  RuntimeGatewayFailureResult,
} from "./runtime-execution-gateway.contracts";

type UnknownRecord = Record<string, unknown>;

@Injectable()
export class RuntimeExecutionGatewayService {
  constructor(
    private readonly repository:
      AiTeamExecutionRepository,

    private readonly moduleRef:
      ModuleRef,
  ) {}

  async executeStep(
    stepId: string,
    input: ExecuteRuntimeStepInput = {},
  ): Promise<
    | RuntimeGatewayExecutionResult
    | RuntimeGatewayFailureResult
  > {
    const step =
      await this.repository.findStepById(stepId);

    if (!step) {
      throw new NotFoundException(
        `Execution step was not found: ${stepId}`,
      );
    }

    if (
      step.status === ExecutionStatus.COMPLETED ||
      step.status === ExecutionStatus.CANCELLED
    ) {
      throw new ConflictException(
        `Execution step cannot run from status: ${step.status}`,
      );
    }

    if (
      step.requiresApproval &&
      !step.approvedAt
    ) {
      throw new ConflictException({
        message:
          "Execution step requires human approval before Runtime execution.",
        stepId,
        humanFinalAuthority: true,
      });
    }

    const providerId =
      step.runtimeProviderId ??
      step.job.runtimeProviderId;

    if (!providerId) {
      throw new ConflictException({
        message:
          "Execution step has no assigned Runtime provider.",
        stepId,
        jobId: step.jobId,
      });
    }

    const operation =
      this.resolveOperation(
        input.operation ??
        step.operation,
      );

    const startedAt = Date.now();

    await this.repository.updateStepStatus(
      stepId,
      {
        status: ExecutionStatus.RUNNING,
        progress: Math.max(
          1,
          step.progress,
        ),
      },
    );

    const command: RuntimeGatewayCommand = {
      providerId,
      command: operation,
      payload: {
        ...(this.recordValue(step.input)),
        ...(input.payload ?? {}),
      },
      metadata: {
        sessionId: step.job.sessionId,
        jobId: step.jobId,
        stepId,
        requestedBy:
          input.requestedBy ?? "creatoros",
        ...(this.recordValue(step.metadata)),
        ...(input.metadata ?? {}),
      },
    };

    try {
      const runtimeOutput =
        await this.invokeRuntime(command);

      const durationMs =
        Date.now() - startedAt;

      const normalizedOutput =
        this.normalizeOutput(runtimeOutput);

      const result =
        await this.repository.createResult(
          stepId,
          {
            resultType: operation,
            success: true,
            output: normalizedOutput,
            logs: {
              providerId,
              operation,
              status: "completed",
            },
            metrics: {
              durationMs,
            },
            durationMs,
          },
        );

      await this.repository.updateStepStatus(
        stepId,
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
          output: normalizedOutput,
        },
      );

      await this.synchronizeJob(step.jobId);

      return {
        stepId,
        jobId: step.jobId,
        sessionId: step.job.sessionId,
        providerId,
        operation,
        success: true,
        resultId: result.id,
        output: normalizedOutput,
        durationMs,
        completedAt:
          new Date().toISOString(),
      };
    } catch (error) {
      const durationMs =
        Date.now() - startedAt;

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown Runtime execution failure.";

      const errorCode =
        this.errorCode(error);

      const result =
        await this.repository.createResult(
          stepId,
          {
            resultType: operation,
            success: false,
            logs: {
              providerId,
              operation,
              status: "failed",
            },
            metrics: {
              durationMs,
            },
            errorCode,
            errorMessage,
            durationMs,
          },
        );

      await this.repository.updateStepStatus(
        stepId,
        {
          status: ExecutionStatus.FAILED,
          progress: step.progress,
          errorMessage,
        },
      );

      return {
        stepId,
        jobId: step.jobId,
        sessionId: step.job.sessionId,
        providerId,
        operation,
        success: false,
        resultId: result.id,
        errorCode,
        errorMessage,
        durationMs,
        failedAt:
          new Date().toISOString(),
      };
    }
  }

  async pingProvider(
    providerId: string,
  ) {
    return this.invokeRuntime({
      providerId,
      command: "ping",
      payload: {},
      metadata: {
        source:
          "runtime-execution-gateway",
      },
    });
  }

  async inspectProvider(
    providerId: string,
  ) {
    return this.invokeRuntime({
      providerId,
      command: "inspect",
      payload: {},
      metadata: {
        source:
          "runtime-execution-gateway",
      },
    });
  }

  private async synchronizeJob(
    jobId: string,
  ) {
    const job =
      await this.repository.findJobById(
        jobId,
      );

    if (!job || job.steps.length === 0) {
      return;
    }

    const completedSteps =
      job.steps.filter(
        (step) =>
          step.status ===
          ExecutionStatus.COMPLETED,
      );

    const progress = Math.round(
      job.steps.reduce(
        (total, step) =>
          total + step.progress,
        0,
      ) / job.steps.length,
    );

    if (
      completedSteps.length ===
      job.steps.length
    ) {
      await this.repository.updateJobStatus(
        jobId,
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );

      return;
    }

    await this.repository.updateJobStatus(
      jobId,
      {
        status: ExecutionStatus.RUNNING,
        progress,
      },
    );
  }

  private async invokeRuntime(
    command: RuntimeGatewayCommand,
  ): Promise<unknown> {
    let runtime:
      | AiStudioRuntimeCommandService
      | undefined;

    try {
      runtime =
        this.moduleRef.get(
          AiStudioRuntimeCommandService,
          {
            strict: false,
          },
        );
    } catch {
      runtime = undefined;
    }

    if (!runtime) {
      throw new ServiceUnavailableException(
        "AI Studio Runtime command service is unavailable.",
      );
    }

    const runtimeRecord =
      runtime as unknown as
        Record<string, unknown>;

    /*
     * AiStudioRuntimeCommandService receives one command object.
     * Passing providerId, command and options as separate arguments
     * causes its validation layer to report:
     * "providerId is required."
     */
    const request = {
      providerId: command.providerId,
      command: command.command,
      operation: command.command,
      action: command.command,
      payload: command.payload,
      metadata: command.metadata,
    };

    const genericMethods = [
      "executeCommand",
      "execute",
      "dispatch",
      "invoke",
      "run",
    ];

    for (const methodName of genericMethods) {
      const candidate =
        runtimeRecord[methodName];

      if (typeof candidate !== "function") {
        continue;
      }

      return Promise.resolve(
        candidate.call(
          runtime,
          request,
        ),
      );
    }

    const commandSpecificMethods:
      Record<
        RuntimeExecutionOperation,
        string[]
      > = {
        inspect: [
          "inspect",
          "inspectProvider",
        ],
        ping: [
          "ping",
          "pingProvider",
          "testConnection",
        ],
        "dry-run": [
          "dryRun",
          "runDryRun",
          "simulate",
        ],
      };

    for (
      const methodName
      of commandSpecificMethods[
        command.command
      ]
    ) {
      const candidate =
        runtimeRecord[methodName];

      if (typeof candidate !== "function") {
        continue;
      }

      return Promise.resolve(
        candidate.call(
          runtime,
          request,
        ),
      );
    }

    throw new ServiceUnavailableException({
      message:
        "AI Studio Runtime exposes no supported command method.",
      providerId:
        command.providerId,
      command: command.command,
    });
  }
  private resolveOperation(
    value: string | null | undefined,
  ): RuntimeExecutionOperation {
    const normalized =
      value?.trim().toLowerCase();

    if (
      normalized === "inspect" ||
      normalized === "ping" ||
      normalized === "dry-run"
    ) {
      return normalized;
    }

    return "dry-run";
  }

  private normalizeOutput(
    value: unknown,
  ): Record<string, unknown> {
    if (this.isRecord(value)) {
      return value;
    }

    return {
      value,
    };
  }

  private recordValue(
    value: unknown,
  ): Record<string, unknown> {
    return this.isRecord(value)
      ? value
      : {};
  }

  private errorCode(
    error: unknown,
  ): string {
    if (
      this.isRecord(error) &&
      typeof error.code === "string"
    ) {
      return error.code;
    }

    return "RUNTIME_EXECUTION_FAILED";
  }

  private isRecord(
    value: unknown,
  ): value is UnknownRecord {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    );
  }
}