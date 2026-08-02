import {
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  ExecutionSchedulerService,
} from "./execution-scheduler.service";

describe(
  "ExecutionSchedulerService",
  () => {
    const repository = {
      findSessionById: jest.fn(),
      updateSessionStatus: jest.fn(),
      updateJobStatus: jest.fn(),
    };

    const service =
      new ExecutionSchedulerService(
        repository as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("throws when the session does not exist", async () => {
      repository.findSessionById.mockResolvedValue(
        null,
      );

      await expect(
        service.getSnapshot("missing"),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("calculates a scheduler snapshot", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.RUNNING,
        progress: 0,
        requiresHumanApproval: false,
        approvedAt: null,
        jobs: [
          {
            id: "job-1",
            status: ExecutionStatus.COMPLETED,
            progress: 100,
          },
          {
            id: "job-2",
            status: ExecutionStatus.PENDING,
            progress: 0,
          },
        ],
      });

      await expect(
        service.getSnapshot("session-1"),
      ).resolves.toEqual({
        sessionId: "session-1",
        status: ExecutionStatus.RUNNING,
        progress: 50,
        totalJobs: 2,
        pendingJobs: 1,
        runningJobs: 0,
        completedJobs: 1,
        failedJobs: 0,
        cancelledJobs: 0,
        nextJobId: "job-2",
      });
    });

    it("blocks starting a session that requires approval", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.PENDING,
        progress: 0,
        requiresHumanApproval: true,
        approvedAt: null,
        jobs: [],
      });

      await expect(
        service.startSession("session-1"),
      ).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(
        repository.updateSessionStatus,
      ).not.toHaveBeenCalled();
    });

    it("starts an approved pending session", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.PENDING,
        progress: 0,
        requiresHumanApproval: true,
        approvedAt: new Date(),
        jobs: [],
      });

      repository.updateSessionStatus.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.RUNNING,
      });

      await service.startSession("session-1");

      expect(
        repository.updateSessionStatus,
      ).toHaveBeenCalledWith(
        "session-1",
        {
          status: ExecutionStatus.RUNNING,
          progress: 0,
        },
      );
    });

    it("schedules the next pending job", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.RUNNING,
        progress: 0,
        requiresHumanApproval: false,
        approvedAt: null,
        jobs: [
          {
            id: "job-1",
            status: ExecutionStatus.PENDING,
            progress: 0,
            requiresApproval: false,
            approvedAt: null,
          },
        ],
      });

      repository.updateJobStatus.mockResolvedValue({
        id: "job-1",
        status: ExecutionStatus.RUNNING,
      });

      await service.scheduleNextJob(
        "session-1",
      );

      expect(
        repository.updateJobStatus,
      ).toHaveBeenCalledWith(
        "job-1",
        {
          status: ExecutionStatus.RUNNING,
          progress: 1,
        },
      );
    });

    it("returns the currently running job instead of starting another", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.RUNNING,
        progress: 20,
        requiresHumanApproval: false,
        approvedAt: null,
        jobs: [
          {
            id: "job-running",
            status: ExecutionStatus.RUNNING,
            progress: 20,
            requiresApproval: false,
            approvedAt: null,
          },
          {
            id: "job-pending",
            status: ExecutionStatus.PENDING,
            progress: 0,
            requiresApproval: false,
            approvedAt: null,
          },
        ],
      });

      await expect(
        service.scheduleNextJob("session-1"),
      ).resolves.toEqual(
        expect.objectContaining({
          id: "job-running",
        }),
      );

      expect(
        repository.updateJobStatus,
      ).not.toHaveBeenCalled();
    });

    it("completes the session when all jobs are completed", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.RUNNING,
        progress: 80,
        requiresHumanApproval: false,
        approvedAt: null,
        jobs: [
          {
            id: "job-1",
            status: ExecutionStatus.COMPLETED,
            progress: 100,
          },
          {
            id: "job-2",
            status: ExecutionStatus.COMPLETED,
            progress: 100,
          },
        ],
      });

      repository.updateSessionStatus.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.COMPLETED,
        progress: 100,
      });

      await service.synchronizeSessionProgress(
        "session-1",
      );

      expect(
        repository.updateSessionStatus,
      ).toHaveBeenCalledWith(
        "session-1",
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );
    });

    it("cancels pending and running jobs before cancelling the session", async () => {
      repository.findSessionById.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.RUNNING,
        progress: 30,
        requiresHumanApproval: false,
        approvedAt: null,
        jobs: [
          {
            id: "job-1",
            status: ExecutionStatus.RUNNING,
            progress: 30,
          },
          {
            id: "job-2",
            status: ExecutionStatus.PENDING,
            progress: 0,
          },
          {
            id: "job-3",
            status: ExecutionStatus.COMPLETED,
            progress: 100,
          },
        ],
      });

      repository.updateJobStatus.mockResolvedValue({
        status: ExecutionStatus.CANCELLED,
      });

      repository.updateSessionStatus.mockResolvedValue({
        id: "session-1",
        status: ExecutionStatus.CANCELLED,
      });

      await service.cancelSession("session-1");

      expect(
        repository.updateJobStatus,
      ).toHaveBeenCalledTimes(2);

      expect(
        repository.updateJobStatus,
      ).toHaveBeenCalledWith(
        "job-1",
        {
          status: ExecutionStatus.CANCELLED,
          progress: 30,
        },
      );

      expect(
        repository.updateJobStatus,
      ).toHaveBeenCalledWith(
        "job-2",
        {
          status: ExecutionStatus.CANCELLED,
          progress: 0,
        },
      );

      expect(
        repository.updateSessionStatus,
      ).toHaveBeenCalledWith(
        "session-1",
        {
          status: ExecutionStatus.CANCELLED,
          progress: 30,
        },
      );
    });
  },
);