import {
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  ExecutionJobRunnerService,
} from "./execution-job-runner.service";

describe(
  "ExecutionJobRunnerService",
  () => {
    const repository = {
      findJobById: jest.fn(),
      updateJobStatus: jest.fn(),
    };

    const gateway = {
      executeStep: jest.fn(),
    };

    const service =
      new ExecutionJobRunnerService(
        repository as never,
        gateway as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("throws when the job does not exist", async () => {
      repository.findJobById.mockResolvedValue(
        null,
      );

      await expect(
        service.runJob("missing"),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("waits when a step requires approval", async () => {
      repository.findJobById.mockResolvedValue({
        id: "job-1",
        progress: 0,
        steps: [
          {
            id: "step-1",
            sequence: 1,
            status: ExecutionStatus.PENDING,
            requiresApproval: true,
            approvedAt: null,
          },
        ],
      });

      const result =
        await service.runJob("job-1");

      expect(result.state).toBe(
        "waiting-approval",
      );

      expect(result.waitingStepId).toBe(
        "step-1",
      );

      expect(
        gateway.executeStep,
      ).not.toHaveBeenCalled();
    });

    it("executes all steps successfully", async () => {
      repository.findJobById
        .mockResolvedValueOnce({
          id: "job-1",
          progress: 0,
          steps: [
            {
              id: "step-1",
              sequence: 1,
              status:
                ExecutionStatus.PENDING,
              requiresApproval: false,
              approvedAt: null,
            },
            {
              id: "step-2",
              sequence: 2,
              status:
                ExecutionStatus.PENDING,
              requiresApproval: false,
              approvedAt: null,
            },
          ],
        })
        .mockResolvedValueOnce({
          id: "job-1",
          progress: 100,
          steps: [
            {
              id: "step-1",
              status:
                ExecutionStatus.COMPLETED,
            },
            {
              id: "step-2",
              status:
                ExecutionStatus.COMPLETED,
            },
          ],
        });

      gateway.executeStep.mockResolvedValue({
        success: true,
      });

      const result =
        await service.runJob("job-1");

      expect(result.state).toBe(
        "completed",
      );

      expect(result.executedSteps).toBe(2);

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

    it("marks the job failed after Runtime failure", async () => {
      repository.findJobById.mockResolvedValue({
        id: "job-1",
        progress: 25,
        steps: [
          {
            id: "step-1",
            sequence: 1,
            status: ExecutionStatus.PENDING,
            requiresApproval: false,
            approvedAt: null,
          },
        ],
      });

      gateway.executeStep.mockResolvedValue({
        success: false,
        errorMessage:
          "Runtime provider failed.",
      });

      const result =
        await service.runJob("job-1");

      expect(result.state).toBe("failed");
      expect(result.failedSteps).toBe(1);

      expect(
        repository.updateJobStatus,
      ).toHaveBeenCalledWith(
        "job-1",
        expect.objectContaining({
          status: ExecutionStatus.FAILED,
        }),
      );
    });
  },
);