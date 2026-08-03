import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export const WORKFLOW_SCHEDULE_SECRET_MASK = '[REDACTED]';

export type WorkflowScheduleKind =
  | 'immediate'
  | 'delayed'
  | 'cron'
  | 'recurring'
  | 'retry';

export type WorkflowScheduleStatus =
  | 'scheduled'
  | 'paused'
  | 'cancelled'
  | 'completed';

export interface WorkflowSchedule {
  id: string;
  workflowId: string;
  executionId?: string;
  kind: WorkflowScheduleKind;
  status: WorkflowScheduleStatus;
  nextRunAt: Date | null;
  lastRunAt: Date | null;
  runAt?: Date;
  cronExpression?: string;
  intervalMs?: number;
  retryAttempt?: number;
  retryReason?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImmediateScheduleRequest {
  workflowId: string;
  executionId?: string;
  metadata?: Record<string, unknown>;
}

export interface DelayedScheduleRequest extends ImmediateScheduleRequest {
  runAt: Date | string;
}

export interface CronScheduleRequest extends ImmediateScheduleRequest {
  cronExpression: string;
  startAt?: Date | string;
}

export interface RecurringScheduleRequest extends ImmediateScheduleRequest {
  intervalMs: number;
  startAt?: Date | string;
}

export interface RetryScheduleRequest extends ImmediateScheduleRequest {
  retryAttempt: number;
  retryDelayMs: number;
  retryReason?: string;
}

export interface ScheduleValidationResult {
  valid: boolean;
  errors: string[];
}

interface CronField {
  min: number;
  max: number;
  values: Set<number> | null;
}

const MINUTE_MS = 60_000;
const MAX_CRON_SCAN_MINUTES = 527_040;

const EXACT_SECRET_KEYS = new Set<string>([
  'secret',
  'password',
  'token',
  'authorization',
  'apikey',
  'privatekey',
  'cookie',
  'credential',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'bearertoken',
  'clientsecret',
  'clientpassword',
]);

const SECRET_CONTAINER_KEYS = new Set<string>([
  'secrets',
  'passwords',
  'tokens',
  'authorizations',
  'apikeys',
  'privatekeys',
  'cookies',
  'credentials',
]);

function normalizeSecretKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function isSecretKey(key: string): boolean {
  const normalized = normalizeSecretKey(key);

  if (SECRET_CONTAINER_KEYS.has(normalized)) {
    return false;
  }

  return (
    EXACT_SECRET_KEYS.has(normalized) ||
    normalized.endsWith('password') ||
    normalized.endsWith('secret') ||
    normalized.endsWith('token') ||
    normalized.endsWith('authorization') ||
    normalized.endsWith('apikey') ||
    normalized.endsWith('privatekey') ||
    normalized.endsWith('cookie') ||
    normalized.endsWith('credential')
  );
}

@Injectable()
export class WorkflowSchedulerService {
  private readonly schedules = new Map<string, WorkflowSchedule>();

  scheduleImmediate(request: ImmediateScheduleRequest): WorkflowSchedule {
    this.assertWorkflowId(request.workflowId);

    const now = this.now();

    return this.store({
      id: randomUUID(),
      workflowId: request.workflowId,
      executionId: request.executionId,
      kind: 'immediate',
      status: 'scheduled',
      nextRunAt: now,
      lastRunAt: null,
      metadata: this.sanitizeMetadata(request.metadata),
      createdAt: now,
      updatedAt: now,
    });
  }

  scheduleDelayed(request: DelayedScheduleRequest): WorkflowSchedule {
    this.assertWorkflowId(request.workflowId);

    const now = this.now();
    const runAt = this.toDate(request.runAt, 'runAt');

    if (runAt.getTime() <= now.getTime()) {
      throw new Error('Delayed schedule runAt must be in the future.');
    }

    return this.store({
      id: randomUUID(),
      workflowId: request.workflowId,
      executionId: request.executionId,
      kind: 'delayed',
      status: 'scheduled',
      runAt,
      nextRunAt: runAt,
      lastRunAt: null,
      metadata: this.sanitizeMetadata(request.metadata),
      createdAt: now,
      updatedAt: now,
    });
  }

  scheduleCron(request: CronScheduleRequest): WorkflowSchedule {
    this.assertWorkflowId(request.workflowId);

    const validation = this.validateCronExpression(request.cronExpression);

    if (!validation.valid) {
      throw new Error(validation.errors.join(' '));
    }

    const now = this.now();
    const base = request.startAt
      ? this.toDate(request.startAt, 'startAt')
      : now;

    const nextRunAt = this.calculateNextCronRun(
      request.cronExpression,
      base,
    );

    return this.store({
      id: randomUUID(),
      workflowId: request.workflowId,
      executionId: request.executionId,
      kind: 'cron',
      status: 'scheduled',
      cronExpression: request.cronExpression.trim(),
      nextRunAt,
      lastRunAt: null,
      metadata: this.sanitizeMetadata(request.metadata),
      createdAt: now,
      updatedAt: now,
    });
  }

  scheduleRecurring(
    request: RecurringScheduleRequest,
  ): WorkflowSchedule {
    this.assertWorkflowId(request.workflowId);

    if (
      !Number.isSafeInteger(request.intervalMs) ||
      request.intervalMs < 1_000
    ) {
      throw new Error(
        'Recurring intervalMs must be a safe integer of at least 1000 milliseconds.',
      );
    }

    const now = this.now();
    const startAt = request.startAt
      ? this.toDate(request.startAt, 'startAt')
      : new Date(now.getTime() + request.intervalMs);

    if (startAt.getTime() < now.getTime()) {
      throw new Error(
        'Recurring schedule startAt cannot be in the past.',
      );
    }

    return this.store({
      id: randomUUID(),
      workflowId: request.workflowId,
      executionId: request.executionId,
      kind: 'recurring',
      status: 'scheduled',
      intervalMs: request.intervalMs,
      nextRunAt: startAt,
      lastRunAt: null,
      metadata: this.sanitizeMetadata(request.metadata),
      createdAt: now,
      updatedAt: now,
    });
  }

  scheduleRetry(request: RetryScheduleRequest): WorkflowSchedule {
    this.assertWorkflowId(request.workflowId);

    if (
      !Number.isSafeInteger(request.retryAttempt) ||
      request.retryAttempt < 1
    ) {
      throw new Error('retryAttempt must be a positive integer.');
    }

    if (
      !Number.isSafeInteger(request.retryDelayMs) ||
      request.retryDelayMs < 0
    ) {
      throw new Error(
        'retryDelayMs must be a non-negative safe integer.',
      );
    }

    const now = this.now();
    const nextRunAt = new Date(now.getTime() + request.retryDelayMs);

    return this.store({
      id: randomUUID(),
      workflowId: request.workflowId,
      executionId: request.executionId,
      kind: 'retry',
      status: 'scheduled',
      retryAttempt: request.retryAttempt,
      retryReason: request.retryReason,
      nextRunAt,
      lastRunAt: null,
      metadata: this.sanitizeMetadata(request.metadata),
      createdAt: now,
      updatedAt: now,
    });
  }

  pauseSchedule(scheduleId: string): WorkflowSchedule {
    const schedule = this.getMutableSchedule(scheduleId);

    if (schedule.status === 'cancelled') {
      throw new Error('Cancelled schedules cannot be paused.');
    }

    if (schedule.status === 'completed') {
      throw new Error('Completed schedules cannot be paused.');
    }

    if (schedule.status === 'paused') {
      return this.cloneSchedule(schedule);
    }

    schedule.status = 'paused';
    schedule.updatedAt = this.now();

    return this.cloneSchedule(schedule);
  }

  resumeSchedule(scheduleId: string): WorkflowSchedule {
    const schedule = this.getMutableSchedule(scheduleId);

    if (schedule.status === 'cancelled') {
      throw new Error('Cancelled schedules cannot be resumed.');
    }

    if (schedule.status === 'completed') {
      throw new Error('Completed schedules cannot be resumed.');
    }

    if (schedule.status === 'scheduled') {
      return this.cloneSchedule(schedule);
    }

    const now = this.now();

    schedule.status = 'scheduled';
    schedule.nextRunAt = this.calculateNextRun(schedule, now);
    schedule.updatedAt = now;

    return this.cloneSchedule(schedule);
  }

  cancelSchedule(scheduleId: string): WorkflowSchedule {
    const schedule = this.getMutableSchedule(scheduleId);

    if (schedule.status === 'completed') {
      throw new Error('Completed schedules cannot be cancelled.');
    }

    if (schedule.status === 'cancelled') {
      return this.cloneSchedule(schedule);
    }

    schedule.status = 'cancelled';
    schedule.nextRunAt = null;
    schedule.updatedAt = this.now();

    return this.cloneSchedule(schedule);
  }

  markRunStarted(
    scheduleId: string,
    startedAt: Date = this.now(),
  ): WorkflowSchedule {
    const schedule = this.getMutableSchedule(scheduleId);

    if (schedule.status !== 'scheduled') {
      throw new Error(
        `Schedule ${scheduleId} is not available for execution.`,
      );
    }

    const normalizedStartedAt = this.toDate(startedAt, 'startedAt');

    schedule.lastRunAt = normalizedStartedAt;
    schedule.nextRunAt = this.calculateNextRun(
      schedule,
      normalizedStartedAt,
    );

    if (
      schedule.kind === 'immediate' ||
      schedule.kind === 'delayed' ||
      schedule.kind === 'retry'
    ) {
      schedule.status = 'completed';
      schedule.nextRunAt = null;
    }

    schedule.updatedAt = normalizedStartedAt;

    return this.cloneSchedule(schedule);
  }

  calculateNextRun(
    schedule: WorkflowSchedule,
    from: Date = this.now(),
  ): Date | null {
    if (
      schedule.status === 'cancelled' ||
      schedule.status === 'completed'
    ) {
      return null;
    }

    switch (schedule.kind) {
      case 'immediate':
        return from;

      case 'delayed':
        return schedule.runAt
          ? new Date(schedule.runAt)
          : schedule.nextRunAt
            ? new Date(schedule.nextRunAt)
            : null;

      case 'retry':
        return schedule.nextRunAt
          ? new Date(schedule.nextRunAt)
          : from;

      case 'recurring':
        if (!schedule.intervalMs) {
          throw new Error(
            `Recurring schedule ${schedule.id} has no intervalMs.`,
          );
        }

        return new Date(from.getTime() + schedule.intervalMs);

      case 'cron':
        if (!schedule.cronExpression) {
          throw new Error(
            `Cron schedule ${schedule.id} has no cronExpression.`,
          );
        }

        return this.calculateNextCronRun(
          schedule.cronExpression,
          from,
        );

      default:
        return this.assertNever(schedule.kind);
    }
  }

  calculateNextCronRun(
    cronExpression: string,
    from: Date = this.now(),
  ): Date {
    const validation = this.validateCronExpression(cronExpression);

    if (!validation.valid) {
      throw new Error(validation.errors.join(' '));
    }

    const fields = cronExpression.trim().split(/\s+/);

    const minute = this.parseCronField(fields[0]!, 0, 59);
    const hour = this.parseCronField(fields[1]!, 0, 23);
    const dayOfMonth = this.parseCronField(fields[2]!, 1, 31);
    const month = this.parseCronField(fields[3]!, 1, 12);
    const dayOfWeek = this.parseCronField(fields[4]!, 0, 7, true);

    const candidate = new Date(from);
    candidate.setUTCSeconds(0, 0);
    candidate.setUTCMinutes(candidate.getUTCMinutes() + 1);

    for (
      let checked = 0;
      checked < MAX_CRON_SCAN_MINUTES;
      checked += 1
    ) {
      const cronDayOfWeek =
        candidate.getUTCDay() === 0 ? 0 : candidate.getUTCDay();

      const matches =
        this.matchesCronField(minute, candidate.getUTCMinutes()) &&
        this.matchesCronField(hour, candidate.getUTCHours()) &&
        this.matchesCronField(
          dayOfMonth,
          candidate.getUTCDate(),
        ) &&
        this.matchesCronField(
          month,
          candidate.getUTCMonth() + 1,
        ) &&
        (
          this.matchesCronField(dayOfWeek, cronDayOfWeek) ||
          (
            cronDayOfWeek === 0 &&
            this.matchesCronField(dayOfWeek, 7)
          )
        );

      if (matches) {
        return candidate;
      }

      candidate.setUTCMinutes(candidate.getUTCMinutes() + 1);
    }

    throw new Error(
      'Unable to calculate the next cron run within one year.',
    );
  }

  validateSchedule(
    request:
      | ImmediateScheduleRequest
      | DelayedScheduleRequest
      | CronScheduleRequest
      | RecurringScheduleRequest
      | RetryScheduleRequest,
    kind: WorkflowScheduleKind,
  ): ScheduleValidationResult {
    const errors: string[] = [];

    if (
      typeof request.workflowId !== 'string' ||
      request.workflowId.trim().length === 0
    ) {
      errors.push('workflowId is required.');
    }

    switch (kind) {
      case 'immediate':
        break;

      case 'delayed': {
        const delayed = request as DelayedScheduleRequest;

        try {
          const runAt = this.toDate(delayed.runAt, 'runAt');

          if (runAt.getTime() <= this.now().getTime()) {
            errors.push('runAt must be in the future.');
          }
        } catch (error) {
          errors.push(this.errorMessage(error));
        }

        break;
      }

      case 'cron': {
        const cron = request as CronScheduleRequest;
        errors.push(
          ...this.validateCronExpression(
            cron.cronExpression,
          ).errors,
        );
        break;
      }

      case 'recurring': {
        const recurring = request as RecurringScheduleRequest;

        if (
          !Number.isSafeInteger(recurring.intervalMs) ||
          recurring.intervalMs < 1_000
        ) {
          errors.push(
            'intervalMs must be a safe integer of at least 1000 milliseconds.',
          );
        }

        break;
      }

      case 'retry': {
        const retry = request as RetryScheduleRequest;

        if (
          !Number.isSafeInteger(retry.retryAttempt) ||
          retry.retryAttempt < 1
        ) {
          errors.push('retryAttempt must be a positive integer.');
        }

        if (
          !Number.isSafeInteger(retry.retryDelayMs) ||
          retry.retryDelayMs < 0
        ) {
          errors.push(
            'retryDelayMs must be a non-negative safe integer.',
          );
        }

        break;
      }

      default:
        this.assertNever(kind);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateCronExpression(
    cronExpression: string,
  ): ScheduleValidationResult {
    const errors: string[] = [];

    if (
      typeof cronExpression !== 'string' ||
      cronExpression.trim().length === 0
    ) {
      return {
        valid: false,
        errors: ['cronExpression is required.'],
      };
    }

    const fields = cronExpression.trim().split(/\s+/);

    if (fields.length !== 5) {
      return {
        valid: false,
        errors: [
          'Cron expression must contain exactly five fields.',
        ],
      };
    }

    const definitions: Array<{
      token: string;
      name: string;
      min: number;
      max: number;
      normalizeSunday?: boolean;
    }> = [
      {
        token: fields[0]!,
        name: 'minute',
        min: 0,
        max: 59,
      },
      {
        token: fields[1]!,
        name: 'hour',
        min: 0,
        max: 23,
      },
      {
        token: fields[2]!,
        name: 'day of month',
        min: 1,
        max: 31,
      },
      {
        token: fields[3]!,
        name: 'month',
        min: 1,
        max: 12,
      },
      {
        token: fields[4]!,
        name: 'day of week',
        min: 0,
        max: 7,
        normalizeSunday: true,
      },
    ];

    for (const definition of definitions) {
      try {
        this.parseCronField(
          definition.token,
          definition.min,
          definition.max,
          definition.normalizeSunday,
        );
      } catch (error) {
        errors.push(
          `Invalid cron ${definition.name}: ${this.errorMessage(error)}`,
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getSchedule(scheduleId: string): WorkflowSchedule {
    return this.cloneSchedule(
      this.getMutableSchedule(scheduleId),
    );
  }

  listSchedules(workflowId?: string): WorkflowSchedule[] {
    return [...this.schedules.values()]
      .filter(
        (schedule) =>
          !workflowId || schedule.workflowId === workflowId,
      )
      .sort(
        (left, right) =>
          left.createdAt.getTime() - right.createdAt.getTime(),
      )
      .map((schedule) => this.cloneSchedule(schedule));
  }

  listDueSchedules(at: Date = this.now()): WorkflowSchedule[] {
    const timestamp = this.toDate(at, 'at').getTime();

    return [...this.schedules.values()]
      .filter(
        (schedule) =>
          schedule.status === 'scheduled' &&
          schedule.nextRunAt !== null &&
          schedule.nextRunAt.getTime() <= timestamp,
      )
      .sort(
        (left, right) =>
          left.nextRunAt!.getTime() -
          right.nextRunAt!.getTime(),
      )
      .map((schedule) => this.cloneSchedule(schedule));
  }

  removeSchedule(scheduleId: string): boolean {
    return this.schedules.delete(scheduleId);
  }

  clear(): void {
    this.schedules.clear();
  }

  private store(schedule: WorkflowSchedule): WorkflowSchedule {
    const stored = this.cloneSchedule(schedule);
    this.schedules.set(stored.id, stored);

    return this.cloneSchedule(stored);
  }

  private getMutableSchedule(
    scheduleId: string,
  ): WorkflowSchedule {
    const schedule = this.schedules.get(scheduleId);

    if (!schedule) {
      throw new NotFoundException(
        `Workflow schedule ${scheduleId} was not found.`,
      );
    }

    return schedule;
  }

  private assertWorkflowId(workflowId: string): void {
    if (
      typeof workflowId !== 'string' ||
      workflowId.trim().length === 0
    ) {
      throw new Error('workflowId is required.');
    }
  }

  private toDate(
    value: Date | string,
    fieldName: string,
  ): Date {
    const date =
      value instanceof Date
        ? new Date(value)
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new Error(`${fieldName} must be a valid date.`);
    }

    return date;
  }

  private parseCronField(
    token: string,
    min: number,
    max: number,
    normalizeSunday = false,
  ): CronField {
    if (!token) {
      throw new Error('field is empty.');
    }

    if (token === '*') {
      return {
        min,
        max,
        values: null,
      };
    }

    const values = new Set<number>();

    for (const segment of token.split(',')) {
      if (!segment) {
        throw new Error('empty list segment.');
      }

      const [base, stepToken, ...extra] = segment.split('/');

      if (extra.length > 0) {
        throw new Error(`invalid step expression "${segment}".`);
      }

      const step =
        stepToken === undefined
          ? 1
          : this.parseCronNumber(stepToken, 1, max - min + 1);

      if (!base) {
        throw new Error(`invalid segment "${segment}".`);
      }

      if (base === '*') {
        this.addRange(values, min, max, step);
        continue;
      }

      if (base.includes('-')) {
        const rangeParts = base.split('-');

        if (rangeParts.length !== 2) {
          throw new Error(`invalid range "${base}".`);
        }

        const rangeStart = this.parseCronNumber(
          rangeParts[0]!,
          min,
          max,
        );
        const rangeEnd = this.parseCronNumber(
          rangeParts[1]!,
          min,
          max,
        );

        if (rangeStart > rangeEnd) {
          throw new Error(
            `range start ${rangeStart} exceeds range end ${rangeEnd}.`,
          );
        }

        this.addRange(values, rangeStart, rangeEnd, step);
        continue;
      }

      const singleValue = this.parseCronNumber(base, min, max);

      if (stepToken === undefined) {
        values.add(
          normalizeSunday && singleValue === 7
            ? 7
            : singleValue,
        );
        continue;
      }

      this.addRange(values, singleValue, max, step);
    }

    if (values.size === 0) {
      throw new Error('field resolves to no values.');
    }

    return {
      min,
      max,
      values,
    };
  }

  private parseCronNumber(
    value: string,
    min: number,
    max: number,
  ): number {
    if (!/^\d+$/.test(value)) {
      throw new Error(`"${value}" is not an integer.`);
    }

    const parsed = Number(value);

    if (
      !Number.isSafeInteger(parsed) ||
      parsed < min ||
      parsed > max
    ) {
      throw new Error(
        `${parsed} must be between ${min} and ${max}.`,
      );
    }

    return parsed;
  }

  private addRange(
    values: Set<number>,
    start: number,
    end: number,
    step: number,
  ): void {
    for (let value = start; value <= end; value += step) {
      values.add(value);
    }
  }

  private matchesCronField(
    field: CronField,
    value: number,
  ): boolean {
    return field.values === null || field.values.has(value);
  }

  private sanitizeMetadata(
    metadata?: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!metadata) {
      return {};
    }

    return this.sanitizeValue(
      metadata,
      new WeakSet<object>(),
    ) as Record<string, unknown>;
  }

  private sanitizeValue(
    value: unknown,
    visited: WeakSet<object>,
  ): unknown {
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'object'
    ) {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value);
    }

    if (visited.has(value)) {
      return '[Circular]';
    }

    visited.add(value);

    if (Array.isArray(value)) {
      return value.map((entry) =>
        this.sanitizeValue(entry, visited),
      );
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      sanitized[key] = isSecretKey(key)
        ? WORKFLOW_SCHEDULE_SECRET_MASK
        : this.sanitizeValue(entry, visited);
    }

    return sanitized;
  }

  private cloneSchedule(
    schedule: WorkflowSchedule,
  ): WorkflowSchedule {
    return {
      ...schedule,
      nextRunAt: schedule.nextRunAt
        ? new Date(schedule.nextRunAt)
        : null,
      lastRunAt: schedule.lastRunAt
        ? new Date(schedule.lastRunAt)
        : null,
      runAt: schedule.runAt
        ? new Date(schedule.runAt)
        : undefined,
      metadata: this.sanitizeMetadata(schedule.metadata),
      createdAt: new Date(schedule.createdAt),
      updatedAt: new Date(schedule.updatedAt),
    };
  }

  private now(): Date {
    return new Date();
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error
      ? error.message
      : String(error);
  }

  private assertNever(value: never): never {
    throw new Error(`Unsupported schedule kind: ${String(value)}`);
  }
}

