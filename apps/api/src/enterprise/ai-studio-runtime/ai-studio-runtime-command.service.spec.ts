import { BadRequestException } from "@nestjs/common";
import { AiStudioRuntimeCommandService } from "./ai-studio-runtime-command.service";
import type { AiStudioRuntimeRegistryService } from "./ai-studio-runtime-registry.service";

describe("AiStudioRuntimeCommandService", () => {
  const registry = {
    getProviderById: (providerId: string) =>
      providerId === "RuntimeModule:AgentService"
        ? {
            id: providerId,
            name: "AgentService",
            capability: "agent" as const,
            module: "RuntimeModule",
            available: true,
            scope: "0",
          }
        : null,
  } as AiStudioRuntimeRegistryService;

  it("creates a completed inspect execution", () => {
    const service =
      new AiStudioRuntimeCommandService(registry);

    const execution = service.execute({
      providerId: "RuntimeModule:AgentService",
      action: "inspect",
    });

    expect(execution.status).toBe("completed");
    expect(execution.approvalRequired).toBe(false);
    expect(service.getHistory().total).toBe(1);
  });

  it("creates a dry run awaiting human approval", () => {
    const service =
      new AiStudioRuntimeCommandService(registry);

    const execution = service.execute({
      providerId: "RuntimeModule:AgentService",
      action: "dry-run",
    });

    expect(execution.status).toBe(
      "awaiting_approval",
    );
    expect(execution.approvalRequired).toBe(true);

    const approved = service.approve(execution.id);

    expect(approved.status).toBe("completed");
    expect(approved.approvalRequired).toBe(false);
  });

  it("rejects approval for a completed execution", () => {
    const service =
      new AiStudioRuntimeCommandService(registry);

    const execution = service.execute({
      providerId: "RuntimeModule:AgentService",
      action: "ping",
    });

    expect(() =>
      service.approve(execution.id),
    ).toThrow(BadRequestException);
  });
});
