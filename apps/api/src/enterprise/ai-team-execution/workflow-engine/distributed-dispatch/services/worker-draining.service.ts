import {
  Injectable,
} from '@nestjs/common';

import {
  QueueAffinityService,
} from './queue-affinity.service';

export const WORKER_DRAINING_STATES = [
  'draining',
  'drained',
  'cancelled',
  'forced',
  'timed_out',
] as const;

export type WorkerDrainingState =
  (typeof WORKER_DRAINING_STATES)[number];

export const WORKER_DRAINING_EVENT_TYPES = [
  'drain.started',
  'drain.progressed',
  'drain.completed',
  'drain.cancelled',
  'drain.forced',
  'drain.timed_out',
] as const;

export type WorkerDrainingEventType =
  (typeof WORKER_DRAINING_EVENT_TYPES)[number];

export interface StartWorkerDrainingInput {
  readonly workerName: string;
  readonly activeJobs?: number;
  readonly timeoutMs?: number;
  readonly force?: boolean;
  readonly removeAffinity?: boolean;
  readonly reason?: string;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
  readonly now?: Date;
}

export interface UpdateWorkerDrainProgressInput {
  readonly workerName: string;
  readonly activeJobs: number;
  readonly completedJobs?: number;
  readonly failedJobs?: number;
  readonly now?: Date;
}

export interface WorkerDrainingRecord {
  readonly workerName: string;
  readonly state:
    WorkerDrainingState;
  readonly activeJobs: number;
  readonly initialActiveJobs: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
  readonly affinityBindingsRemoved: number;
  readonly reason: string | null;
  readonly metadata:
    Readonly<Record<string, unknown>>;
  readonly startedAt: Date;
  readonly updatedAt: Date;
  readonly deadlineAt: Date | null;
  readonly completedAt: Date | null;
  readonly cancelledAt: Date | null;
}

export interface WorkerDrainingEvent {
  readonly id: number;
  readonly workerName: string;
  readonly type:
    WorkerDrainingEventType;
  readonly state:
    WorkerDrainingState;
  readonly activeJobs: number;
  readonly occurredAt: Date;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface WorkerDrainingMetrics {
  readonly totalDrainRequests: number;
  readonly activeDrains: number;
  readonly completedDrains: number;
  readonly cancelledDrains: number;
  readonly forcedDrains: number;
  readonly timedOutDrains: number;
  readonly activeJobsRemaining: number;
  readonly affinityBindingsRemoved: number;
  readonly collectedAt: Date;
}

@Injectable()
export class WorkerDrainingService {
  private readonly records =
    new Map<string, WorkerDrainingRecord>();

  private readonly events:
    WorkerDrainingEvent[] = [];

  private nextEventId = 1;

  private totalDrainRequests = 0;

  private completedDrains = 0;

  private cancelledDrains = 0;

  private forcedDrains = 0;

  private timedOutDrains = 0;

  constructor(
    private readonly affinity:
      QueueAffinityService,
  ) {}

  start(
    input:
      StartWorkerDrainingInput,
  ): WorkerDrainingRecord {
    const workerName =
      this.requireText(
        input.workerName,
        'workerName',
      );

    const existing =
      this.records.get(
        workerName,
      );

    if (
      existing &&
      existing.state === 'draining'
    ) {
      throw new Error(
        `Worker ${workerName} is already draining.`,
      );
    }

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    const activeJobs =
      this.normalizeCount(
        input.activeJobs ?? 0,
        'activeJobs',
      );

    const timeoutMs =
      input.timeoutMs === undefined
        ? null
        : this.normalizeTimeout(
            input.timeoutMs,
          );

    const removeAffinity =
      input.removeAffinity ?? true;

    const affinityBindingsRemoved =
      removeAffinity
        ? this.affinity.unbindWorker(
            workerName,
          )
        : 0;

    const forced =
      input.force ?? false;

    let state:
      WorkerDrainingState =
        'draining';

    let completedAt:
      Date | null = null;

    if (forced) {
      state = 'forced';
      completedAt = now;
      this.forcedDrains += 1;
    } else if (activeJobs === 0) {
      state = 'drained';
      completedAt = now;
      this.completedDrains += 1;
    }

    const record:
      WorkerDrainingRecord = {
      workerName,
      state,
      activeJobs:
        forced ? 0 : activeJobs,
      initialActiveJobs:
        activeJobs,
      completedJobs: 0,
      failedJobs: 0,
      affinityBindingsRemoved,
      reason:
        this.normalizeOptionalText(
          input.reason,
        ),
      metadata:
        this.cloneRecord(
          input.metadata ?? {},
        ),
      startedAt: now,
      updatedAt: now,
      deadlineAt:
        timeoutMs === null
          ? null
          : new Date(
              now.getTime() +
              timeoutMs,
            ),
      completedAt,
      cancelledAt: null,
    };

    this.records.set(
      workerName,
      this.cloneRecordSnapshot(
        record,
      ),
    );

    this.totalDrainRequests += 1;

    this.appendEvent(
      record,
      forced
        ? 'drain.forced'
        : state === 'drained'
          ? 'drain.completed'
          : 'drain.started',
      now,
      {
        initialActiveJobs:
          activeJobs,
        affinityBindingsRemoved,
      },
    );

    return this.cloneRecordSnapshot(
      record,
    );
  }

  updateProgress(
    input:
      UpdateWorkerDrainProgressInput,
  ): WorkerDrainingRecord {
    const workerName =
      this.requireText(
        input.workerName,
        'workerName',
      );

    const current =
      this.requireRecord(
        workerName,
      );

    if (
      current.state !==
      'draining'
    ) {
      throw new Error(
        `Worker ${workerName} is not actively draining.`,
      );
    }

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    const activeJobs =
      this.normalizeCount(
        input.activeJobs,
        'activeJobs',
      );

    const completedJobs =
      input.completedJobs === undefined
        ? current.completedJobs
        : this.normalizeCount(
            input.completedJobs,
            'completedJobs',
          );

    const failedJobs =
      input.failedJobs === undefined
        ? current.failedJobs
        : this.normalizeCount(
            input.failedJobs,
            'failedJobs',
          );

    let state:
      WorkerDrainingState =
        'draining';

    let completedAt:
      Date | null = null;

    if (
      current.deadlineAt &&
      now.getTime() >=
        current.deadlineAt.getTime() &&
      activeJobs > 0
    ) {
      state = 'timed_out';
      completedAt = now;
      this.timedOutDrains += 1;
    } else if (activeJobs === 0) {
      state = 'drained';
      completedAt = now;
      this.completedDrains += 1;
    }

    const updated:
      WorkerDrainingRecord = {
      ...current,
      state,
      activeJobs,
      completedJobs,
      failedJobs,
      updatedAt: now,
      completedAt,
    };

    this.records.set(
      workerName,
      this.cloneRecordSnapshot(
        updated,
      ),
    );

    this.appendEvent(
      updated,
      state === 'drained'
        ? 'drain.completed'
        : state === 'timed_out'
          ? 'drain.timed_out'
          : 'drain.progressed',
      now,
      {
        completedJobs,
        failedJobs,
      },
    );

    return this.cloneRecordSnapshot(
      updated,
    );
  }

  cancel(
    workerName: string,
    now =
      new Date(),
  ): WorkerDrainingRecord {
    const normalizedWorkerName =
      this.requireText(
        workerName,
        'workerName',
      );

    const current =
      this.requireRecord(
        normalizedWorkerName,
      );

    if (
      current.state !==
      'draining'
    ) {
      throw new Error(
        `Worker ${normalizedWorkerName} is not actively draining.`,
      );
    }

    const cancelledAt =
      new Date(now);

    const updated:
      WorkerDrainingRecord = {
      ...current,
      state: 'cancelled',
      updatedAt:
        cancelledAt,
      cancelledAt,
    };

    this.records.set(
      normalizedWorkerName,
      this.cloneRecordSnapshot(
        updated,
      ),
    );

    this.cancelledDrains += 1;

    this.appendEvent(
      updated,
      'drain.cancelled',
      cancelledAt,
      {},
    );

    return this.cloneRecordSnapshot(
      updated,
    );
  }

  force(
    workerName: string,
    now =
      new Date(),
  ): WorkerDrainingRecord {
    const normalizedWorkerName =
      this.requireText(
        workerName,
        'workerName',
      );

    const current =
      this.requireRecord(
        normalizedWorkerName,
      );

    if (
      current.state !==
      'draining'
    ) {
      throw new Error(
        `Worker ${normalizedWorkerName} is not actively draining.`,
      );
    }

    const completedAt =
      new Date(now);

    const updated:
      WorkerDrainingRecord = {
      ...current,
      state: 'forced',
      activeJobs: 0,
      updatedAt:
        completedAt,
      completedAt,
    };

    this.records.set(
      normalizedWorkerName,
      this.cloneRecordSnapshot(
        updated,
      ),
    );

    this.forcedDrains += 1;

    this.appendEvent(
      updated,
      'drain.forced',
      completedAt,
      {},
    );

    return this.cloneRecordSnapshot(
      updated,
    );
  }

  evaluateTimeouts(
    now =
      new Date(),
  ): readonly WorkerDrainingRecord[] {
    const currentTime =
      new Date(now);

    const timedOut:
      WorkerDrainingRecord[] = [];

    for (
      const record
      of this.records.values()
    ) {
      if (
        record.state !==
          'draining' ||
        !record.deadlineAt ||
        currentTime.getTime() <
          record.deadlineAt.getTime()
      ) {
        continue;
      }

      timedOut.push(
        this.updateProgress({
          workerName:
            record.workerName,
          activeJobs:
            record.activeJobs,
          completedJobs:
            record.completedJobs,
          failedJobs:
            record.failedJobs,
          now:
            currentTime,
        }),
      );
    }

    return timedOut.map(
      (record) =>
        this.cloneRecordSnapshot(
          record,
        ),
    );
  }

  isDraining(
    workerName: string,
  ): boolean {
    const normalizedWorkerName =
      this.requireText(
        workerName,
        'workerName',
      );

    return (
      this.records.get(
        normalizedWorkerName,
      )?.state === 'draining'
    );
  }

  canAcceptNewJobs(
    workerName: string,
  ): boolean {
    return !this.isDraining(
      workerName,
    );
  }

  get(
    workerName: string,
  ): WorkerDrainingRecord | null {
    const normalizedWorkerName =
      this.requireText(
        workerName,
        'workerName',
      );

    const record =
      this.records.get(
        normalizedWorkerName,
      );

    return record
      ? this.cloneRecordSnapshot(
          record,
        )
      : null;
  }

  list():
    readonly WorkerDrainingRecord[] {
    return [
      ...this.records.values(),
    ]
      .sort(
        (left, right) =>
          left.workerName.localeCompare(
            right.workerName,
          ),
      )
      .map(
        (record) =>
          this.cloneRecordSnapshot(
            record,
          ),
      );
  }

  listActive():
    readonly WorkerDrainingRecord[] {
    return this.list().filter(
      (record) =>
        record.state ===
        'draining',
    );
  }

  listEvents(
    workerName?: string,
  ): readonly WorkerDrainingEvent[] {
    const normalizedWorkerName =
      workerName === undefined
        ? null
        : this.requireText(
            workerName,
            'workerName',
          );

    return this.events
      .filter(
        (event) =>
          normalizedWorkerName ===
            null ||
          event.workerName ===
            normalizedWorkerName,
      )
      .map(
        (event) =>
          this.cloneEvent(
            event,
          ),
      );
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): WorkerDrainingMetrics {
    const records =
      [...this.records.values()];

    const activeRecords =
      records.filter(
        (record) =>
          record.state ===
          'draining',
      );

    return {
      totalDrainRequests:
        this.totalDrainRequests,
      activeDrains:
        activeRecords.length,
      completedDrains:
        this.completedDrains,
      cancelledDrains:
        this.cancelledDrains,
      forcedDrains:
        this.forcedDrains,
      timedOutDrains:
        this.timedOutDrains,
      activeJobsRemaining:
        activeRecords.reduce(
          (
            total,
            record,
          ) =>
            total +
            record.activeJobs,
          0,
        ),
      affinityBindingsRemoved:
        records.reduce(
          (
            total,
            record,
          ) =>
            total +
            record
              .affinityBindingsRemoved,
          0,
        ),
      collectedAt:
        new Date(
          collectedAt,
        ),
    };
  }

  clear(): void {
    this.records.clear();
    this.events.splice(
      0,
      this.events.length,
    );

    this.nextEventId = 1;
    this.totalDrainRequests = 0;
    this.completedDrains = 0;
    this.cancelledDrains = 0;
    this.forcedDrains = 0;
    this.timedOutDrains = 0;
  }

  private requireRecord(
    workerName: string,
  ): WorkerDrainingRecord {
    const record =
      this.records.get(
        workerName,
      );

    if (!record) {
      throw new Error(
        `Worker ${workerName} does not have a draining record.`,
      );
    }

    return this.cloneRecordSnapshot(
      record,
    );
  }

  private appendEvent(
    record:
      WorkerDrainingRecord,
    type:
      WorkerDrainingEventType,
    occurredAt: Date,
    metadata:
      Readonly<Record<string, unknown>>,
  ): void {
    this.events.push({
      id:
        this.nextEventId,
      workerName:
        record.workerName,
      type,
      state:
        record.state,
      activeJobs:
        record.activeJobs,
      occurredAt:
        new Date(
          occurredAt,
        ),
      metadata:
        this.cloneRecord(
          metadata,
        ),
    });

    this.nextEventId += 1;
  }

  private normalizeCount(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      throw new Error(
        `${fieldName} must be a non-negative integer.`,
      );
    }

    return value;
  }

  private normalizeTimeout(
    value: number,
  ): number {
    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      throw new Error(
        'timeoutMs must be a positive integer.',
      );
    }

    return value;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private normalizeOptionalText(
    value:
      string | undefined,
  ): string | null {
    if (value === undefined) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized ||
      null;
  }

  private cloneRecordSnapshot(
    record:
      WorkerDrainingRecord,
  ): WorkerDrainingRecord {
    return {
      ...record,
      metadata:
        this.cloneRecord(
          record.metadata,
        ),
      startedAt:
        new Date(
          record.startedAt,
        ),
      updatedAt:
        new Date(
          record.updatedAt,
        ),
      deadlineAt:
        record.deadlineAt
          ? new Date(
              record.deadlineAt,
            )
          : null,
      completedAt:
        record.completedAt
          ? new Date(
              record.completedAt,
            )
          : null,
      cancelledAt:
        record.cancelledAt
          ? new Date(
              record.cancelledAt,
            )
          : null,
    };
  }

  private cloneEvent(
    event:
      WorkerDrainingEvent,
  ): WorkerDrainingEvent {
    return {
      ...event,
      occurredAt:
        new Date(
          event.occurredAt,
        ),
      metadata:
        this.cloneRecord(
          event.metadata,
        ),
    };
  }

  private cloneRecord(
    record:
      Readonly<Record<string, unknown>>,
  ): Readonly<Record<string, unknown>> {
    return {
      ...record,
    };
  }
}