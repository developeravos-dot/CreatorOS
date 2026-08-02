import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  AgentAssignmentService,
} from "./agent-assignment.service";

describe(
  "AgentAssignmentService",
  () => {
    const repository = {
      findJobById: jest.fn(),
      findSessionById: jest.fn(),
      assignJobProvider: jest.fn(),
    };

    const dispatcher = {
      listProviders: jest.fn(),
      selectProvider: jest.fn(),
    };

    const service =
      new AgentAssignmentService(
        repository as never,
        dispatcher as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("throws when the job does not exist", async () => {
      repository.findJobById.mockResolvedValue(
        null,
      );

      await expect(
        service.assignJob("missing"),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("rejects completed jobs", async () => {
      repository.findJobById.mockResolvedValue({
        id: "job-1",
        status: ExecutionStatus.COMPLETED,
      });

      await expect(
        service.assignJob("job-1", {
          capability: "agent",
        }),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("requires a capability", async () => {
      repository.findJobById.mockResolvedValue({
        id: "job-1",
        status: ExecutionStatus.PENDING,
        capability: null,
      });

      await expect(
        service.assignJob("job-1"),
      ).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("automatically assigns the best Runtime provider", async () => {
      repository.findJobById.mockResolvedValue({
        id: "job-1",
        sessionId: "session-1",
        status: ExecutionStatus.PENDING,
        capability: "agent",
        runtimeProviderId: null,
      });

      dispatcher.selectProvider.mockResolvedValue({
        selected: {
          provider: {
            id: "provider-1",
            name: "AgentApplicationService",
          },
          score: 95,
          reasons: [
            "health:100",
            "available",
          ],
        },
        alternatives: [
          {
            provider: {
              id: "provider-2",
              name: "AgentCoordinationService",
            },
            score: 80,
          },
        ],
      });

      repository.assignJobProvider.mockResolvedValue({
        id: "job-1",
        sessionId: "session-1",
        assignedAgentId:
          "AgentApplicationService",
        runtimeProviderId: "provider-1",
        capability: "agent",
      });

      const result =
        await service.assignJob("job-1");

      expect(
        repository.assignJobProvider,
      ).toHaveBeenCalledWith(
        "job-1",
        {
          assignedAgentId:
            "AgentApplicationService",
          runtimeProviderId:
            "provider-1",
          capability: "agent",
        },
      );

      expect(result).toEqual(
        expect.objectContaining({
          jobId: "job-1",
          runtimeProviderId:
            "provider-1",
          humanOverride: false,
          score: 95,
        }),
      );
    });

    it("supports human provider override", async () => {
      repository.findJobById.mockResolvedValue({
        id: "job-1",
        sessionId: "session-1",
        status: ExecutionStatus.PENDING,
        capability: "agent",
      });

      dispatcher.listProviders.mockResolvedValue([
        {
          id: "provider-manual",
          name: "ManualAgent",
        },
      ]);

      repository.assignJobProvider.mockResolvedValue({
        id: "job-1",
        sessionId: "session-1",
        assignedAgentId:
          "HumanSelectedAgent",
        runtimeProviderId:
          "provider-manual",
        capability: "agent",
      });

      const result =
        await service.assignJob(
          "job-1",
          {
            capability: "agent",
            preferredProviderId:
              "provider-manual",
            preferredAgentId:
              "HumanSelectedAgent",
            humanOverride: true,
          },
        );

      expect(result.humanOverride).toBe(
        true,
      );

      expect(
        result.runtimeProviderId,
      ).toBe("provider-manual");
    });
  },
);