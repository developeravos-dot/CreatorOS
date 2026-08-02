import {
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  ExecutionOrchestratorService,
} from "./execution-orchestrator.service";

describe(
  "ExecutionOrchestratorService",
  () => {
    const repository = {
      findSessionById: jest.fn(),
      findJobById: jest.fn(),
      updateSessionStatus: jest.fn(),
    };

    const scheduler = {
      tick: jest.fn(),
      synchronizeSessionProgress: jest.fn(),
    };

    const jobRunner = {
      runJob: jest.fn(),
    };

    const service =
      new ExecutionOrchestratorService(
        repository as never,
        scheduler as never,
        jobRunner as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("throws when the session does not exist", async () => {
      repository.findSessionById.mockResolvedValue(
        null,
      );

      await expect(
        service.executeSession("missing"),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("rejects an already completed session", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.COMPLETED,
        progress: 100,
      });

      await expect(
        service.executeSession("session-1"),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("waits for session approval", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.PENDING,
        progress: 0,
        requiresHumanApproval: true,
        approvedAt: null,
      });

      const result =
        await service.executeSession(
          "session-1",
        );

      expect(result.waitingApproval).toBe(
        true,
      );

      expect(
        scheduler.tick,
      ).not.toHaveBeenCalled();
    });

    it("coordinates a successful job", async () => {
      repository.findSessionById
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.RUNNING,
          progress: 0,
          requiresHumanApproval: false,
          approvedAt: null,
        })
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        });

      scheduler.tick
        .mockResolvedValueOnce({
          action: "job-scheduled",
          jobId: "job-1",
          snapshot: {
            nextJobId: null,
          },
        })
        .mockResolvedValueOnce({
          action: "session-completed",
          jobId: null,
          snapshot: {
            nextJobId: null,
          },
        });

      repository.findJobById.mockResolvedValue({
        id: "job-1",
        requiresApproval: false,
        approvedAt: null,
      });

      jobRunner.runJob.mockResolvedValue({
        jobId: "job-1",
        state: "completed",
        executedSteps: 2,
        failedSteps: 0,
        waitingStepId: null,
        errorMessage: null,
      });

      const result =
        await service.executeSession(
          "session-1",
        );

      expect(
        jobRunner.runJob,
      ).toHaveBeenCalledWith(
        "job-1",
      );

      expect(result).toEqual(
        expect.objectContaining({
          status:
            ExecutionStatus.COMPLETED,
          executedJobs: 1,
          executedSteps: 2,
          failedSteps: 0,
          waitingApproval: false,
        }),
      );
    });

    it("returns waiting approval from the runner", async () => {
      repository.findSessionById
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.RUNNING,
          progress: 20,
          requiresHumanApproval: false,
          approvedAt: null,
        })
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.RUNNING,
          progress: 20,
        });

      scheduler.tick.mockResolvedValue({
        action: "waiting",
        jobId: "job-1",
        snapshot: {
          nextJobId: null,
        },
      });

      repository.findJobById.mockResolvedValue({
        id: "job-1",
        requiresApproval: false,
        approvedAt: null,
      });

      jobRunner.runJob.mockResolvedValue({
        jobId: "job-1",
        state: "waiting-approval",
        executedSteps: 0,
        failedSteps: 0,
        waitingStepId: "step-1",
        errorMessage: null,
      });

      const result =
        await service.executeSession(
          "session-1",
        );

      expect(result.waitingApproval).toBe(
        true,
      );

      expect(result.waitingStepId).toBe(
        "step-1",
      );
    });

    it("marks the session failed after runner failure", async () => {
      repository.findSessionById
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.RUNNING,
          progress: 30,
          requiresHumanApproval: false,
          approvedAt: null,
        })
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.RUNNING,
          progress: 30,
        })
        .mockResolvedValueOnce({
          id: "session-1",
          status: ExecutionStatus.FAILED,
          progress: 30,
        });

      scheduler.tick.mockResolvedValue({
        action: "job-scheduled",
        jobId: "job-1",
        snapshot: {
          nextJobId: null,
        },
      });

      repository.findJobById.mockResolvedValue({
        id: "job-1",
        requiresApproval: false,
        approvedAt: null,
      });

      jobRunner.runJob.mockResolvedValue({
        jobId: "job-1",
        state: "failed",
        executedSteps: 1,
        failedSteps: 1,
        waitingStepId: null,
        errorMessage:
          "Runtime provider failed.",
      });

      repository.updateSessionStatus.mockResolvedValue(
        {},
      );

      const result =
        await service.executeSession(
          "session-1",
        );

      expect(result.failedSteps).toBe(1);

      expect(
        repository.updateSessionStatus,
      ).toHaveBeenCalledWith(
        "session-1",
        expect.objectContaining({
          status: ExecutionStatus.FAILED,
          errorMessage:
            "Runtime provider failed.",
        }),
      );
    });
  },
);