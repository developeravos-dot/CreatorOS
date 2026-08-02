import {
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  RuntimeExecutionGatewayService,
} from "./runtime-execution-gateway.service";

describe(
  "RuntimeExecutionGatewayService",
  () => {
    const repository = {
      findStepById: jest.fn(),
      findJobById: jest.fn(),
      createResult: jest.fn(),
      updateStepStatus: jest.fn(),
      updateJobStatus: jest.fn(),
    };

    const runtime = {
      executeCommand: jest.fn(),
    };

    const moduleRef = {
      get: jest.fn(() => runtime),
    };

    const service =
      new RuntimeExecutionGatewayService(
        repository as never,
        moduleRef as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();

      moduleRef.get.mockReturnValue(
        runtime,
      );
    });

    it("throws when the step does not exist", async () => {
      repository.findStepById.mockResolvedValue(
        null,
      );

      await expect(
        service.executeStep("missing"),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("blocks a step that requires approval", async () => {
      repository.findStepById.mockResolvedValue({
        id: "step-1",
        status: ExecutionStatus.PENDING,
        requiresApproval: true,
        approvedAt: null,
        runtimeProviderId: "provider-1",
        jobId: "job-1",
        job: {
          id: "job-1",
          sessionId: "session-1",
          runtimeProviderId:
            "provider-1",
        },
      });

      await expect(
        service.executeStep("step-1"),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("executes a dry-run and persists the result", async () => {
      repository.findStepById.mockResolvedValue({
        id: "step-1",
        jobId: "job-1",
        status: ExecutionStatus.PENDING,
        progress: 0,
        requiresApproval: false,
        approvedAt: null,
        runtimeProviderId: "provider-1",
        operation: "dry-run",
        input: {
          topic: "CreatorOS",
        },
        metadata: null,
        job: {
          id: "job-1",
          sessionId: "session-1",
          runtimeProviderId:
            "provider-1",
        },
      });

      repository.findJobById.mockResolvedValue({
        id: "job-1",
        steps: [
          {
            id: "step-1",
            status:
              ExecutionStatus.COMPLETED,
            progress: 100,
          },
        ],
      });

      runtime.executeCommand.mockResolvedValue({
        status: "completed",
        output: "Dry run passed",
      });

      repository.createResult.mockResolvedValue({
        id: "result-1",
      });

      repository.updateStepStatus.mockResolvedValue(
        {},
      );

      repository.updateJobStatus.mockResolvedValue(
        {},
      );

      const result =
        await service.executeStep(
          "step-1",
        );

      expect(
        runtime.executeCommand,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          providerId: "provider-1",
          command: "dry-run",
          operation: "dry-run",
          action: "dry-run",
          payload: {
            topic: "CreatorOS",
          },
          metadata:
            expect.objectContaining({
              sessionId: "session-1",
              jobId: "job-1",
              stepId: "step-1",
            }),
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          stepId: "step-1",
          jobId: "job-1",
          sessionId: "session-1",
          providerId: "provider-1",
          operation: "dry-run",
          success: true,
          resultId: "result-1",
        }),
      );

      expect(
        repository.updateStepStatus,
      ).toHaveBeenLastCalledWith(
        "step-1",
        expect.objectContaining({
          status:
            ExecutionStatus.COMPLETED,
          progress: 100,
        }),
      );

      expect(
        repository.updateJobStatus,
      ).toHaveBeenCalledWith(
        "job-1",
        {
          status:
            ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );
    });

    it("persists Runtime failures", async () => {
      repository.findStepById.mockResolvedValue({
        id: "step-1",
        jobId: "job-1",
        status: ExecutionStatus.PENDING,
        progress: 0,
        requiresApproval: false,
        approvedAt: null,
        runtimeProviderId: "provider-1",
        operation: "ping",
        input: null,
        metadata: null,
        job: {
          id: "job-1",
          sessionId: "session-1",
          runtimeProviderId:
            "provider-1",
        },
      });

      runtime.executeCommand.mockRejectedValue(
        new Error(
          "Provider unavailable",
        ),
      );

      repository.createResult.mockResolvedValue({
        id: "result-failed",
      });

      repository.updateStepStatus.mockResolvedValue(
        {},
      );

      const result =
        await service.executeStep(
          "step-1",
        );

      expect(result).toEqual(
        expect.objectContaining({
          success: false,
          resultId: "result-failed",
          errorCode:
            "RUNTIME_EXECUTION_FAILED",
          errorMessage:
            "Provider unavailable",
        }),
      );

      expect(
        repository.updateStepStatus,
      ).toHaveBeenLastCalledWith(
        "step-1",
        expect.objectContaining({
          status:
            ExecutionStatus.FAILED,
          errorMessage:
            "Provider unavailable",
        }),
      );
    });
  },
);