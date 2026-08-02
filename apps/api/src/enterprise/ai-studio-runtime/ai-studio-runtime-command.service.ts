import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AiStudioRuntimeRegistryService } from "./ai-studio-runtime-registry.service";
import type {
  AiStudioRuntimeCollection,
  AiStudioRuntimeCommandAction,
  AiStudioRuntimeCommandRequest,
  AiStudioRuntimeExecution,
} from "./ai-studio-runtime.contracts";

const supportedActions: AiStudioRuntimeCommandAction[] = [
  "inspect",
  "ping",
  "dry-run",
];

@Injectable()
export class AiStudioRuntimeCommandService {
  private readonly executions =
    new Map<string, AiStudioRuntimeExecution>();

  constructor(
    private readonly registry: AiStudioRuntimeRegistryService,
  ) {}

  execute(
    request: AiStudioRuntimeCommandRequest,
  ): AiStudioRuntimeExecution {
    if (!request.providerId?.trim()) {
      throw new BadRequestException(
        "providerId is required.",
      );
    }

    if (!supportedActions.includes(request.action)) {
      throw new BadRequestException(
        `Unsupported Runtime action: ${String(request.action)}`,
      );
    }

    const provider = this.registry.getProviderById(
      request.providerId,
    );

    if (!provider) {
      throw new NotFoundException(
        `Runtime provider was not found: ${request.providerId}`,
      );
    }

    const createdAt = new Date().toISOString();
    const approvalRequired = request.action === "dry-run";

    const execution: AiStudioRuntimeExecution = {
      id: randomUUID(),
      providerId: provider.id,
      providerName: provider.name,
      capability: provider.capability,
      action: request.action,
      status: approvalRequired
        ? "awaiting_approval"
        : "completed",
      approvalRequired,
      input: request.input ?? {},
      output: this.createOutput(
        request.action,
        provider,
      ),
      createdAt,
      completedAt: approvalRequired
        ? null
        : new Date().toISOString(),
    };

    this.executions.set(execution.id, execution);

    return execution;
  }

  getHistory(): AiStudioRuntimeCollection<AiStudioRuntimeExecution> {
    const items = [...this.executions.values()].sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt),
    );

    return {
      source: "creatoros-runtime",
      generatedAt: new Date().toISOString(),
      total: items.length,
      items,
    };
  }

  getExecution(
    executionId: string,
  ): AiStudioRuntimeExecution {
    const execution = this.executions.get(executionId);

    if (!execution) {
      throw new NotFoundException(
        `Runtime execution was not found: ${executionId}`,
      );
    }

    return execution;
  }

  approve(
    executionId: string,
  ): AiStudioRuntimeExecution {
    const execution = this.getExecution(executionId);

    if (execution.status !== "awaiting_approval") {
      throw new BadRequestException(
        "Execution is not awaiting approval.",
      );
    }

    const updated: AiStudioRuntimeExecution = {
      ...execution,
      status: "completed",
      approvalRequired: false,
      completedAt: new Date().toISOString(),
      output: {
        ...execution.output,
        approved: true,
        executionMode: "safe-dry-run",
      },
    };

    this.executions.set(updated.id, updated);

    return updated;
  }

  reject(
    executionId: string,
  ): AiStudioRuntimeExecution {
    const execution = this.getExecution(executionId);

    if (execution.status !== "awaiting_approval") {
      throw new BadRequestException(
        "Execution is not awaiting approval.",
      );
    }

    const updated: AiStudioRuntimeExecution = {
      ...execution,
      status: "failed",
      approvalRequired: false,
      completedAt: new Date().toISOString(),
      output: {
        ...execution.output,
        approved: false,
        rejected: true,
      },
    };

    this.executions.set(updated.id, updated);

    return updated;
  }

  private createOutput(
    action: AiStudioRuntimeCommandAction,
    provider: {
      id: string;
      name: string;
      module: string;
      capability: string;
      available: boolean;
      scope: string;
    },
  ): Record<string, unknown> {
    if (action === "inspect") {
      return {
        provider,
        inspected: true,
      };
    }

    if (action === "ping") {
      return {
        reachable: provider.available,
        providerId: provider.id,
        checkedAt: new Date().toISOString(),
      };
    }

    return {
      providerId: provider.id,
      providerName: provider.name,
      validated: provider.available,
      executionMode: "safe-dry-run",
      message:
        "Dry run validated. Human approval is required before completion.",
    };
  }
}
