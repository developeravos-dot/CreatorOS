import { Test } from "@nestjs/testing";
import { DiscoveryService } from "@nestjs/core";
import { AiStudioRuntimeRegistryService } from "./ai-studio-runtime-registry.service";

describe("AiStudioRuntimeRegistryService", () => {
  it("categorizes registered runtime providers", async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AiStudioRuntimeRegistryService,
        {
          provide: DiscoveryService,
          useValue: {
            getProviders: () => [
              {
                name: "AgentRegistryService",
                instance: {},
                host: { name: "OrganizationModule" },
              },
              {
                name: "WorkflowOrchestratorService",
                instance: {},
                host: { name: "WorkflowModule" },
              },
              {
                name: "HumanApprovalService",
                instance: {},
                host: { name: "ApprovalModule" },
              },
            ],
          },
        },
      ],
    }).compile();

    const service = moduleRef.get(
      AiStudioRuntimeRegistryService,
    );

    expect(service.getAgents().total).toBe(1);
    expect(service.getWorkflows().total).toBe(1);
    expect(service.getApprovals().total).toBe(1);
    expect(service.getOverview().providers).toBe(3);
  });
});
