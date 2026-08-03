import {
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import type {
  JobSchedulerTickContract,
  JobSchedulerTickResultContract,
} from '../contracts';
import {
  JobScheduleModel,
  cloneJobScheduleDefinition,
  isRecurringJobSchedule,
  validateJobScheduleDefinition,
  type CreateJobScheduleInput,
  type JobCronSchedule,
  type JobIntervalSchedule,
  type JobSchedule,
  type JobScheduleDefinition,
} from '../models';
import {
  JobEngineService,
} from './job-engine.service';

@Injectable()
export class JobSchedulerService {
  private readonly schedules =
    new Map<string, JobSchedule>();

  constructor(
    private readonly jobEngine:
      JobEngineService,
  ) {}

  createSchedule(
    input:
      CreateJobScheduleInput,
  ): JobSchedule {
    const id =
      input.id?.trim() ||
      randomUUID();

    if (this.schedules.has(id)) {
      throw new Error(
        `Job schedule ${id} already exists.`,
      );
    }

    const jobId =
      input.jobId.trim();

    if (!jobId) {
      throw new Error(
        'Job schedule jobId is required.',
      );
    }

    const job =
      this.jobEngine.getById(
        jobId,
      );

    if (!job) {
      throw new Error(
        `Job ${jobId} was not found.`,
      );
    }

    validateJobScheduleDefinition(
      input.definition,
    );

    const now =
      new Date().toISOString();

    const nextRunAt =
      this.calculateInitialNextRun(
        input.definition,
        now,
      );

    const schedule:
      JobSchedule = {
        id,
        jobId,
        definition:
          cloneJobScheduleDefinition(
            input.definition,
          ),
        enabled:
          input.enabled ??
          true,
        runCount: 0,
        nextRunAt,
        createdAt: now,
        updatedAt: now,
      };

    const snapshot =
      new JobScheduleModel(
        schedule,
      ).toContract();

    this.schedules.set(
      id,
      snapshot,
    );

    if (
      job.state === 'draft' &&
      schedule.enabled &&
      schedule.definition.kind !==
        'manual'
    ) {
      this.jobEngine.transition(
        jobId,
        'scheduled',
        'Job schedule created.',
      );
    }

    return this.cloneSchedule(
      snapshot,
    );
  }

  getById(
    scheduleId: string,
  ): JobSchedule | undefined {
    const schedule =
      this.schedules.get(
        scheduleId,
      );

    return schedule
      ? this.cloneSchedule(
          schedule,
        )
      : undefined;
  }

  getByJobId(
    jobId: string,
  ): readonly JobSchedule[] {
    return [
      ...this.schedules.values(),
    ]
      .filter(
        (schedule) =>
          schedule.jobId ===
          jobId,
      )
      .sort(
        (left, right) =>
          left.createdAt
            .localeCompare(
              right.createdAt,
            ),
      )
      .map(
        (schedule) =>
          this.cloneSchedule(
            schedule,
          ),
      );
  }

  list():
    readonly JobSchedule[] {
    return [
      ...this.schedules.values(),
    ]
      .sort(
        (left, right) =>
          left.createdAt
            .localeCompare(
              right.createdAt,
            ),
      )
      .map(
        (schedule) =>
          this.cloneSchedule(
            schedule,
          ),
      );
  }

  updateSchedule(
    scheduleId: string,
    input: {
      definition?:
        JobScheduleDefinition;
      enabled?: boolean;
    },
  ): JobSchedule {
    const existing =
      this.requireSchedule(
        scheduleId,
      );

    const definition =
      input.definition
        ? cloneJobScheduleDefinition(
            input.definition,
          )
        : existing.definition;

    validateJobScheduleDefinition(
      definition,
    );

    const now =
      new Date().toISOString();

    const updated:
      JobSchedule = {
        ...existing,
        definition,
        enabled:
          input.enabled ??
          existing.enabled,
        nextRunAt:
          input.definition
            ? this.calculateInitialNextRun(
                definition,
                now,
              )
            : existing.nextRunAt,
        updatedAt: now,
      };

    return this.saveSchedule(
      updated,
    );
  }

  enableSchedule(
    scheduleId: string,
  ): JobSchedule {
    const schedule =
      this.requireSchedule(
        scheduleId,
      );

    if (schedule.enabled) {
      return schedule;
    }

    const now =
      new Date().toISOString();

    return this.saveSchedule({
      ...schedule,
      enabled: true,
      nextRunAt:
        schedule.nextRunAt ??
        this.calculateInitialNextRun(
          schedule.definition,
          now,
        ),
      updatedAt: now,
    });
  }

  disableSchedule(
    scheduleId: string,
  ): JobSchedule {
    const schedule =
      this.requireSchedule(
        scheduleId,
      );

    if (!schedule.enabled) {
      return schedule;
    }

    return this.saveSchedule({
      ...schedule,
      enabled: false,
      updatedAt:
        new Date().toISOString(),
    });
  }

  deleteSchedule(
    scheduleId: string,
  ): boolean {
    this.requireSchedule(
      scheduleId,
    );

    return this.schedules.delete(
      scheduleId,
    );
  }

  triggerNow(
    scheduleId: string,
  ) {
    const schedule =
      this.requireSchedule(
        scheduleId,
      );

    const job =
      this.jobEngine.getById(
        schedule.jobId,
      );

    if (!job) {
      throw new Error(
        `Job ${schedule.jobId} was not found.`,
      );
    }

    if (
      job.state === 'completed' ||
      job.state === 'cancelled' ||
      job.state === 'dead_lettered' ||
      job.state === 'expired'
    ) {
      throw new Error(
        `Job ${job.id} cannot be triggered from terminal state ${job.state}.`,
      );
    }

    return this.jobEngine.enqueue(
      schedule.jobId,
      {
        delayMs: 0,
      },
    );
  }

  getDueSchedules(
    now:
      string = new Date()
        .toISOString(),
    queueNames?:
      readonly string[],
  ): readonly JobSchedule[] {
    const timestamp =
      this.requireValidDate(
        now,
        'now',
      );

    const queueSet =
      new Set(
        (queueNames ?? [])
          .map(
            (queueName) =>
              queueName.trim(),
          )
          .filter(Boolean),
      );

    return this.list()
      .filter(
        (schedule) => {
          if (!schedule.enabled) {
            return false;
          }

          if (
            !schedule.nextRunAt
          ) {
            return false;
          }

          const nextRunTimestamp =
            new Date(
              schedule.nextRunAt,
            ).getTime();

          if (
            !Number.isFinite(
              nextRunTimestamp,
            ) ||
            nextRunTimestamp >
              timestamp
          ) {
            return false;
          }

          if (
            queueSet.size > 0
          ) {
            const job =
              this.jobEngine.getById(
                schedule.jobId,
              );

            if (
              !job ||
              !queueSet.has(
                job.queueName,
              )
            ) {
              return false;
            }
          }

          return !this.hasReachedMaximumRuns(
            schedule,
          );
        },
      );
  }

  tick(
    input:
      JobSchedulerTickContract = {},
  ): JobSchedulerTickResultContract {
    const now =
      input.now ??
      new Date().toISOString();

    this.requireValidDate(
      now,
      'now',
    );

    const dueSchedules =
      this.getDueSchedules(
        now,
        input.queueNames,
      );

    const maximumJobs =
      typeof input.maximumJobs ===
        'number' &&
      Number.isFinite(
        input.maximumJobs,
      )
        ? Math.max(
            1,
            Math.floor(
              input.maximumJobs,
            ),
          )
        : dueSchedules.length;

    const selectedSchedules =
      dueSchedules.slice(
        0,
        maximumJobs,
      );

    const jobIds:
      string[] = [];

    const failures:
      {
        scheduleId: string;
        jobId: string;
        message: string;
      }[] = [];

    let enqueuedJobs = 0;
    let skippedSchedules = 0;

    for (
      const schedule
      of selectedSchedules
    ) {
      try {
        const job =
          this.jobEngine.getById(
            schedule.jobId,
          );

        if (!job) {
          throw new Error(
            `Job ${schedule.jobId} was not found.`,
          );
        }

        if (
          job.state === 'running'
        ) {
          skippedSchedules += 1;

          this.advanceSchedule(
            schedule,
            now,
            false,
          );

          continue;
        }

        const delayMs =
          schedule.definition.kind ===
            'delayed'
            ? Math.max(
                0,
                new Date(
                  schedule.definition
                    .runAt,
                ).getTime() -
                new Date(now)
                  .getTime(),
              )
            : 0;

        this.jobEngine.enqueue(
          schedule.jobId,
          {
            delayMs,
          },
        );

        enqueuedJobs += 1;

        jobIds.push(
          schedule.jobId,
        );

        this.advanceSchedule(
          schedule,
          now,
          true,
        );
      } catch (error) {
        failures.push({
          scheduleId:
            schedule.id,
          jobId:
            schedule.jobId,
          message:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }
    }

    return {
      evaluatedSchedules:
        this.schedules.size,
      dueSchedules:
        dueSchedules.length,
      enqueuedJobs,
      skippedSchedules:
        skippedSchedules +
        Math.max(
          0,
          dueSchedules.length -
          selectedSchedules.length,
        ),
      failedSchedules:
        failures.length,
      jobIds,
      failures,
      processedAt: now,
    };
  }

  calculateNextRun(
    definition:
      JobScheduleDefinition,
    from:
      string = new Date()
        .toISOString(),
    runCount = 0,
  ): string | undefined {
    const fromTimestamp =
      this.requireValidDate(
        from,
        'from',
      );

    switch (definition.kind) {
      case 'immediate':
        return runCount === 0
          ? definition.enqueueAt
          : undefined;

      case 'delayed':
        return runCount === 0
          ? definition.runAt
          : undefined;

      case 'manual':
        return undefined;

      case 'interval':
        return this.calculateIntervalNextRun(
          definition,
          fromTimestamp,
          runCount,
        );

      case 'cron':
        return this.calculateCronNextRun(
          definition,
          fromTimestamp,
          runCount,
        );

      default: {
        const exhaustiveCheck:
          never =
            definition;

        throw new Error(
          `Unsupported schedule definition: ${String(exhaustiveCheck)}`,
        );
      }
    }
  }

  clear(): void {
    this.schedules.clear();
  }

  private advanceSchedule(
    schedule:
      JobSchedule,
    occurredAt: string,
    countedRun: boolean,
  ): JobSchedule {
    const nextRunCount =
      countedRun
        ? schedule.runCount + 1
        : schedule.runCount;

    const nextRunAt =
      this.calculateNextRun(
        schedule.definition,
        occurredAt,
        nextRunCount,
      );

    const enabled =
      nextRunAt !== undefined &&
      !this.hasReachedMaximumRuns({
        ...schedule,
        runCount:
          nextRunCount,
      });

    return this.saveSchedule({
      ...schedule,
      runCount:
        nextRunCount,
      lastRunAt:
        countedRun
          ? occurredAt
          : schedule.lastRunAt,
      nextRunAt,
      enabled:
        isRecurringJobSchedule(
          schedule.definition,
        )
          ? enabled
          : false,
      updatedAt:
        occurredAt,
    });
  }

  private calculateInitialNextRun(
    definition:
      JobScheduleDefinition,
    now: string,
  ): string | undefined {
    switch (definition.kind) {
      case 'manual':
        return undefined;

      case 'immediate':
        return definition.enqueueAt;

      case 'delayed':
        return definition.runAt;

      case 'interval':
        if (
          definition.runImmediately
        ) {
          return now;
        }

        return this.calculateIntervalNextRun(
          definition,
          new Date(now)
            .getTime(),
          0,
        );

      case 'cron':
        return this.calculateCronNextRun(
          definition,
          new Date(now)
            .getTime(),
          0,
        );

      default: {
        const exhaustiveCheck:
          never =
            definition;

        throw new Error(
          `Unsupported schedule definition: ${String(exhaustiveCheck)}`,
        );
      }
    }
  }

  private calculateIntervalNextRun(
    definition:
      JobIntervalSchedule,
    fromTimestamp: number,
    runCount: number,
  ): string | undefined {
    if (
      definition.maximumRuns !==
        undefined &&
      runCount >=
        definition.maximumRuns
    ) {
      return undefined;
    }

    const startTimestamp =
      this.requireValidDate(
        definition.startAt,
        'startAt',
      );

    let nextTimestamp: number;

    if (
      fromTimestamp <
      startTimestamp
    ) {
      nextTimestamp =
        startTimestamp;
    } else {
      const elapsed =
        fromTimestamp -
        startTimestamp;

      const completedIntervals =
        Math.floor(
          elapsed /
          definition.intervalMs,
        );

      nextTimestamp =
        startTimestamp +
        (
          completedIntervals + 1
        ) *
        definition.intervalMs;
    }

    if (definition.endAt) {
      const endTimestamp =
        this.requireValidDate(
          definition.endAt,
          'endAt',
        );

      if (
        nextTimestamp >
        endTimestamp
      ) {
        return undefined;
      }
    }

    return new Date(
      nextTimestamp,
    ).toISOString();
  }

  private calculateCronNextRun(
    definition:
      JobCronSchedule,
    fromTimestamp: number,
    runCount: number,
  ): string | undefined {
    if (
      definition.maximumRuns !==
        undefined &&
      runCount >=
        definition.maximumRuns
    ) {
      return undefined;
    }

    const parsed =
      this.parseCronExpression(
        definition.expression,
      );

    const startTimestamp =
      definition.startAt
        ? this.requireValidDate(
            definition.startAt,
            'startAt',
          )
        : fromTimestamp;

    const searchStart =
      Math.max(
        fromTimestamp,
        startTimestamp,
      );

    const candidate =
      new Date(searchStart);

    candidate.setUTCSeconds(
      0,
      0,
    );

    candidate.setUTCMinutes(
      candidate.getUTCMinutes() +
      1,
    );

    const maximumIterations =
      60 *
      24 *
      366 *
      2;

    for (
      let index = 0;
      index <
      maximumIterations;
      index++
    ) {
      if (
        this.cronDateMatches(
          candidate,
          parsed,
        )
      ) {
        if (definition.endAt) {
          const endTimestamp =
            this.requireValidDate(
              definition.endAt,
              'endAt',
            );

          if (
            candidate.getTime() >
            endTimestamp
          ) {
            return undefined;
          }
        }

        return candidate
          .toISOString();
      }

      candidate.setUTCMinutes(
        candidate.getUTCMinutes() +
        1,
      );
    }

    throw new Error(
      `Unable to calculate next run for cron expression ${definition.expression}.`,
    );
  }

  private parseCronExpression(
    expression: string,
  ): {
    minute:
      readonly number[] | '*';
    hour:
      readonly number[] | '*';
    dayOfMonth:
      readonly number[] | '*';
    month:
      readonly number[] | '*';
    dayOfWeek:
      readonly number[] | '*';
  } {
    const parts =
      expression
        .trim()
        .split(/\s+/);

    if (parts.length !== 5) {
      throw new Error(
        'Cron expression must contain exactly 5 fields.',
      );
    }

    return {
      minute:
        this.parseCronField(
          parts[0]!,
          0,
          59,
          'minute',
        ),
      hour:
        this.parseCronField(
          parts[1]!,
          0,
          23,
          'hour',
        ),
      dayOfMonth:
        this.parseCronField(
          parts[2]!,
          1,
          31,
          'dayOfMonth',
        ),
      month:
        this.parseCronField(
          parts[3]!,
          1,
          12,
          'month',
        ),
      dayOfWeek:
        this.parseCronField(
          parts[4]!,
          0,
          6,
          'dayOfWeek',
        ),
    };
  }

  private parseCronField(
    value: string,
    minimum: number,
    maximum: number,
    fieldName: string,
  ): readonly number[] | '*' {
    if (value === '*') {
      return '*';
    }

    const results =
      new Set<number>();

    for (
      const segment
      of value.split(',')
    ) {
      if (
        segment.startsWith(
          '*/',
        )
      ) {
        const step =
          Number(
            segment.slice(2),
          );

        if (
          !Number.isInteger(step) ||
          step <= 0
        ) {
          throw new Error(
            `Invalid cron ${fieldName} step.`,
          );
        }

        for (
          let current = minimum;
          current <= maximum;
          current += step
        ) {
          results.add(
            current,
          );
        }

        continue;
      }

      if (
        segment.includes('-')
      ) {
        const [
          startValue,
          endValue,
        ] = segment.split('-');

        const start =
          Number(startValue);

        const end =
          Number(endValue);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < minimum ||
          end > maximum ||
          start > end
        ) {
          throw new Error(
            `Invalid cron ${fieldName} range.`,
          );
        }

        for (
          let current = start;
          current <= end;
          current++
        ) {
          results.add(
            current,
          );
        }

        continue;
      }

      const numericValue =
        Number(segment);

      if (
        !Number.isInteger(
          numericValue,
        ) ||
        numericValue < minimum ||
        numericValue > maximum
      ) {
        throw new Error(
          `Invalid cron ${fieldName} value.`,
        );
      }

      results.add(
        numericValue,
      );
    }

    return [
      ...results,
    ].sort(
      (left, right) =>
        left - right,
    );
  }

  private cronDateMatches(
    date: Date,
    fields: {
      minute:
        readonly number[] | '*';
      hour:
        readonly number[] | '*';
      dayOfMonth:
        readonly number[] | '*';
      month:
        readonly number[] | '*';
      dayOfWeek:
        readonly number[] | '*';
    },
  ): boolean {
    return (
      this.cronFieldMatches(
        fields.minute,
        date.getUTCMinutes(),
      ) &&
      this.cronFieldMatches(
        fields.hour,
        date.getUTCHours(),
      ) &&
      this.cronFieldMatches(
        fields.dayOfMonth,
        date.getUTCDate(),
      ) &&
      this.cronFieldMatches(
        fields.month,
        date.getUTCMonth() + 1,
      ) &&
      this.cronFieldMatches(
        fields.dayOfWeek,
        date.getUTCDay(),
      )
    );
  }

  private cronFieldMatches(
    field:
      readonly number[] | '*',
    value: number,
  ): boolean {
    return (
      field === '*' ||
      field.includes(value)
    );
  }

  private hasReachedMaximumRuns(
    schedule:
      JobSchedule,
  ): boolean {
    if (
      schedule.definition.kind !==
        'cron' &&
      schedule.definition.kind !==
        'interval'
    ) {
      return schedule.runCount >= 1;
    }

    const maximumRuns =
      schedule.definition
        .maximumRuns;

    return (
      maximumRuns !== undefined &&
      schedule.runCount >=
        maximumRuns
    );
  }

  private requireSchedule(
    scheduleId: string,
  ): JobSchedule {
    const schedule =
      this.schedules.get(
        scheduleId,
      );

    if (!schedule) {
      throw new Error(
        `Job schedule ${scheduleId} was not found.`,
      );
    }

    return this.cloneSchedule(
      schedule,
    );
  }

  private saveSchedule(
    schedule:
      JobSchedule,
  ): JobSchedule {
    const snapshot =
      new JobScheduleModel(
        schedule,
      ).toContract();

    this.schedules.set(
      schedule.id,
      snapshot,
    );

    return this.cloneSchedule(
      snapshot,
    );
  }

  private cloneSchedule(
    schedule:
      JobSchedule,
  ): JobSchedule {
    return new JobScheduleModel(
      schedule,
    ).toContract();
  }

  private requireValidDate(
    value: string,
    fieldName: string,
  ): number {
    const timestamp =
      new Date(value).getTime();

    if (
      !Number.isFinite(
        timestamp,
      )
    ) {
      throw new Error(
        `Job scheduler ${fieldName} must be a valid date.`,
      );
    }

    return timestamp;
  }
}