import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ExecutionStatus,
} from "../../generated/prisma/client";

import {
  AiTeamExecutionRepository,
} from "./ai-team-execution.repository";

export interface ExecutionSchedulerSnapshot {
  sessionId: string;
  status: ExecutionStatus;
  progress: number;
  totalJobs: number;
  pendingJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  nextJobId: string | null;
}

export interface ExecutionSchedulerTickResult {
  action:
    | "session-started"
    | "job-scheduled"
    | "session-completed"
    | "waiting"
    | "no-jobs";
  sessionId: string;
  jobId: string | null;
  snapshot: ExecutionSchedulerSnapshot;
}

@Injectable()
export class ExecutionSchedulerService {
  constructor(
    private readonly repository:
      AiTeamExecutionRepository,
  ) {}

  async getSnapshot(
    sessionId: string,
  ): Promise<ExecutionSchedulerSnapshot> {
    const session =
      await this.getSessionOrThrow(sessionId);

    const totalJobs = session.jobs.length;

    const pendingJobs = session.jobs.filter(
      (job) =>
        job.status === ExecutionStatus.PENDING,
    ).length;

    const runningJobs = session.jobs.filter(
      (job) =>
        job.status === ExecutionStatus.RUNNING,
    ).length;

    const completedJobs = session.jobs.filter(
      (job) =>
        job.status === ExecutionStatus.COMPLETED,
    ).length;

    const failedJobs = session.jobs.filter(
      (job) =>
        job.status === ExecutionStatus.FAILED,
    ).length;

    const cancelledJobs = session.jobs.filter(
      (job) =>
        job.status === ExecutionStatus.CANCELLED,
    ).length;

    const progress =
      totalJobs === 0
        ? session.progress
        : Math.round(
            session.jobs.reduce(
              (total, job) =>
                total + job.progress,
              0,
            ) / totalJobs,
          );

    const nextJob =
      session.jobs.find(
        (job) =>
          job.status === ExecutionStatus.PENDING,
      ) ?? null;

    return {
      sessionId: session.id,
      status: session.status,
      progress,
      totalJobs,
      pendingJobs,
      runningJobs,
      completedJobs,
      failedJobs,
      cancelledJobs,
      nextJobId: nextJob?.id ?? null,
    };
  }

  async startSession(
    sessionId: string,
  ) {
    const session =
      await this.getSessionOrThrow(sessionId);

    if (
      session.status === ExecutionStatus.COMPLETED ||
      session.status === ExecutionStatus.FAILED ||
      session.status === ExecutionStatus.CANCELLED
    ) {
      throw new ConflictException(
        `Execution session cannot be started from status: ${session.status}`,
      );
    }

    if (
      session.requiresHumanApproval &&
      !session.approvedAt
    ) {
      throw new ConflictException({
        message:
          "Execution session requires human approval before starting.",
        sessionId,
        humanFinalAuthority: true,
      });
    }

    if (
      session.status === ExecutionStatus.RUNNING
    ) {
      return session;
    }

    return this.repository.updateSessionStatus(
      sessionId,
      {
        status: ExecutionStatus.RUNNING,
        progress: session.progress,
      },
    );
  }

  async scheduleNextJob(
    sessionId: string,
  ) {
    const session =
      await this.getSessionOrThrow(sessionId);

    if (
      session.status !== ExecutionStatus.RUNNING
    ) {
      throw new ConflictException(
        `Execution session must be RUNNING before scheduling jobs. Current status: ${session.status}`,
      );
    }

    const runningJob =
      session.jobs.find(
        (job) =>
          job.status === ExecutionStatus.RUNNING,
      );

    if (runningJob) {
      return runningJob;
    }

    const nextJob =
      session.jobs.find(
        (job) =>
          job.status === ExecutionStatus.PENDING,
      );

    if (!nextJob) {
      return null;
    }

    if (
      nextJob.requiresApproval &&
      !nextJob.approvedAt
    ) {
      throw new ConflictException({
        message:
          "The next execution job requires human approval.",
        sessionId,
        jobId: nextJob.id,
        humanFinalAuthority: true,
      });
    }

    return this.repository.updateJobStatus(
      nextJob.id,
      {
        status: ExecutionStatus.RUNNING,
        progress: Math.max(
          1,
          nextJob.progress,
        ),
      },
    );
  }

  async synchronizeSessionProgress(
    sessionId: string,
  ) {
    const snapshot =
      await this.getSnapshot(sessionId);

    if (
      snapshot.totalJobs > 0 &&
      snapshot.completedJobs ===
        snapshot.totalJobs
    ) {
      return this.repository.updateSessionStatus(
        sessionId,
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );
    }

    return this.repository.updateSessionStatus(
      sessionId,
      {
        status: snapshot.status,
        progress: snapshot.progress,
      },
    );
  }

  async cancelSession(
    sessionId: string,
  ) {
    const session =
      await this.getSessionOrThrow(sessionId);

    if (
      session.status === ExecutionStatus.COMPLETED
    ) {
      throw new ConflictException(
        "A completed execution session cannot be cancelled.",
      );
    }

    const cancellableJobs =
      session.jobs.filter(
        (job) =>
          job.status === ExecutionStatus.PENDING ||
          job.status === ExecutionStatus.RUNNING,
      );

    await Promise.all(
      cancellableJobs.map((job) =>
        this.repository.updateJobStatus(
          job.id,
          {
            status: ExecutionStatus.CANCELLED,
            progress: job.progress,
          },
        ),
      ),
    );

    return this.repository.updateSessionStatus(
      sessionId,
      {
        status: ExecutionStatus.CANCELLED,
        progress: session.progress,
      },
    );
  }

  async tick(
    sessionId: string,
  ): Promise<ExecutionSchedulerTickResult> {
    let session =
      await this.getSessionOrThrow(sessionId);

    if (
      session.status === ExecutionStatus.PENDING
    ) {
      await this.startSession(sessionId);

      const snapshot =
        await this.getSnapshot(sessionId);

      return {
        action: "session-started",
        sessionId,
        jobId: null,
        snapshot,
      };
    }

    if (
      session.status !== ExecutionStatus.RUNNING
    ) {
      throw new ConflictException(
        `Scheduler cannot tick a session with status: ${session.status}`,
      );
    }

    session =
      await this.getSessionOrThrow(sessionId);

    if (session.jobs.length === 0) {
      const snapshot =
        await this.getSnapshot(sessionId);

      return {
        action: "no-jobs",
        sessionId,
        jobId: null,
        snapshot,
      };
    }

    const activeJob =
      session.jobs.find(
        (job) =>
          job.status === ExecutionStatus.RUNNING,
      );

    if (activeJob) {
      const snapshot =
        await this.getSnapshot(sessionId);

      return {
        action: "waiting",
        sessionId,
        jobId: activeJob.id,
        snapshot,
      };
    }

    const allCompleted =
      session.jobs.every(
        (job) =>
          job.status ===
          ExecutionStatus.COMPLETED,
      );

    if (allCompleted) {
      await this.repository.updateSessionStatus(
        sessionId,
        {
          status: ExecutionStatus.COMPLETED,
          progress: 100,
        },
      );

      const snapshot =
        await this.getSnapshot(sessionId);

      return {
        action: "session-completed",
        sessionId,
        jobId: null,
        snapshot,
      };
    }

    const scheduledJob =
      await this.scheduleNextJob(sessionId);

    const snapshot =
      await this.getSnapshot(sessionId);

    return {
      action: scheduledJob
        ? "job-scheduled"
        : "waiting",
      sessionId,
      jobId: scheduledJob?.id ?? null,
      snapshot,
    };
  }

  private async getSessionOrThrow(
    sessionId: string,
  ) {
    const session =
      await this.repository.findSessionById(
        sessionId,
      );

    if (!session) {
      throw new NotFoundException(
        `Execution session was not found: ${sessionId}`,
      );
    }

    return session;
  }
}