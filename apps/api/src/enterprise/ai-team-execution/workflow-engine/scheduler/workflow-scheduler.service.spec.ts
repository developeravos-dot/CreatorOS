import { NotFoundException } from '@nestjs/common';
import {
  WORKFLOW_SCHEDULE_SECRET_MASK,
  WorkflowSchedulerService,
} from './workflow-scheduler.service';

describe('WorkflowSchedulerService', () => {
  let service: WorkflowSchedulerService;

  const systemTime = new Date('2026-08-04T00:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemTime);

    service = new WorkflowSchedulerService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('immediate execution', () => {
    it('creates an immediately due schedule', () => {
      const schedule = service.scheduleImmediate({
        workflowId: 'workflow-1',
        executionId: 'execution-1',
      });

      expect(schedule.kind).toBe('immediate');
      expect(schedule.status).toBe('scheduled');
      expect(schedule.nextRunAt).toEqual(systemTime);
      expect(schedule.workflowId).toBe('workflow-1');
      expect(schedule.executionId).toBe('execution-1');
    });

    it('returns immediate schedules as due', () => {
      const schedule = service.scheduleImmediate({
        workflowId: 'workflow-due',
      });

      expect(service.listDueSchedules()).toEqual([
        expect.objectContaining({
          id: schedule.id,
        }),
      ]);
    });
  });

  describe('delayed execution', () => {
    it('creates a future delayed schedule', () => {
      const runAt = new Date(
        systemTime.getTime() + 10 * 60_000,
      );

      const schedule = service.scheduleDelayed({
        workflowId: 'workflow-delayed',
        runAt,
      });

      expect(schedule.kind).toBe('delayed');
      expect(schedule.runAt).toEqual(runAt);
      expect(schedule.nextRunAt).toEqual(runAt);
    });

    it('rejects a delayed schedule in the past', () => {
      expect(() =>
        service.scheduleDelayed({
          workflowId: 'workflow-delayed',
          runAt: new Date(systemTime.getTime() - 1),
        }),
      ).toThrow('must be in the future');
    });
  });

  describe('cron scheduling', () => {
    it('calculates the next hourly run', () => {
      const nextRun = service.calculateNextCronRun(
        '0 * * * *',
        new Date('2026-08-04T00:12:30.000Z'),
      );

      expect(nextRun).toEqual(
        new Date('2026-08-04T01:00:00.000Z'),
      );
    });

    it('supports lists, ranges and steps', () => {
      const nextRun = service.calculateNextCronRun(
        '*/15 9-10 * * 1,2,3,4,5',
        new Date('2026-08-04T08:59:00.000Z'),
      );

      expect(nextRun).toEqual(
        new Date('2026-08-04T09:00:00.000Z'),
      );
    });

    it('creates a cron schedule with its next run', () => {
      const schedule = service.scheduleCron({
        workflowId: 'workflow-cron',
        cronExpression: '30 2 * * *',
      });

      expect(schedule.kind).toBe('cron');
      expect(schedule.nextRunAt).toEqual(
        new Date('2026-08-04T02:30:00.000Z'),
      );
    });

    it('rejects invalid cron expressions', () => {
      expect(
        service.validateCronExpression('* * *'),
      ).toEqual(
        expect.objectContaining({
          valid: false,
        }),
      );

      expect(() =>
        service.scheduleCron({
          workflowId: 'workflow-cron',
          cronExpression: '70 * * * *',
        }),
      ).toThrow('Invalid cron minute');
    });
  });

  describe('recurring scheduling', () => {
    it('schedules the first run after the interval', () => {
      const schedule = service.scheduleRecurring({
        workflowId: 'workflow-recurring',
        intervalMs: 30_000,
      });

      expect(schedule.kind).toBe('recurring');
      expect(schedule.intervalMs).toBe(30_000);
      expect(schedule.nextRunAt).toEqual(
        new Date(systemTime.getTime() + 30_000),
      );
    });

    it('calculates the following recurring run', () => {
      const schedule = service.scheduleRecurring({
        workflowId: 'workflow-recurring',
        intervalMs: 60_000,
      });

      const nextRun = service.calculateNextRun(
        schedule,
        new Date('2026-08-04T01:00:00.000Z'),
      );

      expect(nextRun).toEqual(
        new Date('2026-08-04T01:01:00.000Z'),
      );
    });

    it('rejects intervals below one second', () => {
      expect(() =>
        service.scheduleRecurring({
          workflowId: 'workflow-recurring',
          intervalMs: 999,
        }),
      ).toThrow('at least 1000 milliseconds');
    });
  });

  describe('pause, resume and cancel', () => {
    it('pauses and resumes a recurring schedule', () => {
      const schedule = service.scheduleRecurring({
        workflowId: 'workflow-pause',
        intervalMs: 60_000,
      });

      const paused = service.pauseSchedule(schedule.id);

      expect(paused.status).toBe('paused');

      jest.setSystemTime(
        new Date('2026-08-04T02:00:00.000Z'),
      );

      const resumed = service.resumeSchedule(schedule.id);

      expect(resumed.status).toBe('scheduled');
      expect(resumed.nextRunAt).toEqual(
        new Date('2026-08-04T02:01:00.000Z'),
      );
    });

    it('cancels a schedule and removes its next run', () => {
      const schedule = service.scheduleRecurring({
        workflowId: 'workflow-cancel',
        intervalMs: 60_000,
      });

      const cancelled = service.cancelSchedule(schedule.id);

      expect(cancelled.status).toBe('cancelled');
      expect(cancelled.nextRunAt).toBeNull();
      expect(service.listDueSchedules()).toEqual([]);
    });

    it('does not resume a cancelled schedule', () => {
      const schedule = service.scheduleImmediate({
        workflowId: 'workflow-cancelled',
      });

      service.cancelSchedule(schedule.id);

      expect(() =>
        service.resumeSchedule(schedule.id),
      ).toThrow('cannot be resumed');
    });
  });

  describe('execution lifecycle', () => {
    it('completes one-time schedules when execution starts', () => {
      const schedule = service.scheduleImmediate({
        workflowId: 'workflow-complete',
      });

      const started = service.markRunStarted(schedule.id);

      expect(started.status).toBe('completed');
      expect(started.lastRunAt).toEqual(systemTime);
      expect(started.nextRunAt).toBeNull();
    });

    it('advances recurring schedules after execution', () => {
      const schedule = service.scheduleRecurring({
        workflowId: 'workflow-repeat',
        intervalMs: 120_000,
      });

      const startedAt = new Date(
        '2026-08-04T03:00:00.000Z',
      );

      const updated = service.markRunStarted(
        schedule.id,
        startedAt,
      );

      expect(updated.status).toBe('scheduled');
      expect(updated.lastRunAt).toEqual(startedAt);
      expect(updated.nextRunAt).toEqual(
        new Date('2026-08-04T03:02:00.000Z'),
      );
    });
  });

  describe('retry scheduling integration', () => {
    it('creates a retry schedule using the requested delay', () => {
      const schedule = service.scheduleRetry({
        workflowId: 'workflow-retry',
        executionId: 'execution-retry',
        retryAttempt: 3,
        retryDelayMs: 45_000,
        retryReason: 'temporary-provider-failure',
      });

      expect(schedule.kind).toBe('retry');
      expect(schedule.retryAttempt).toBe(3);
      expect(schedule.retryReason).toBe(
        'temporary-provider-failure',
      );
      expect(schedule.nextRunAt).toEqual(
        new Date(systemTime.getTime() + 45_000),
      );
    });

    it('rejects invalid retry attempts', () => {
      expect(() =>
        service.scheduleRetry({
          workflowId: 'workflow-retry',
          retryAttempt: 0,
          retryDelayMs: 1_000,
        }),
      ).toThrow('positive integer');
    });
  });

  describe('secret sanitization', () => {
    it('sanitizes nested secret values without mutating input', () => {
      const metadata = {
        publicValue: 'visible',
        apiKey: 'api-key-value',
        nested: {
          password: 'password-value',
          safe: 'safe-value',
          tokens: [
            {
              accessToken: 'token-value',
            },
          ],
        },
      };

      const schedule = service.scheduleImmediate({
        workflowId: 'workflow-secrets',
        metadata,
      });

      expect(schedule.metadata).toEqual({
        publicValue: 'visible',
        apiKey: WORKFLOW_SCHEDULE_SECRET_MASK,
        nested: {
          password: WORKFLOW_SCHEDULE_SECRET_MASK,
          safe: 'safe-value',
          tokens: [
            {
              accessToken: WORKFLOW_SCHEDULE_SECRET_MASK,
            },
          ],
        },
      });

      expect(metadata.apiKey).toBe('api-key-value');
      expect(metadata.nested.password).toBe(
        'password-value',
      );
    });

    it('recursively sanitizes plural secret containers', () => {
      const schedule = service.scheduleImmediate({
        workflowId: 'workflow-secret-containers',
        metadata: {
          tokens: [
            {
              accessToken: 'access-token-value',
              refreshToken: 'refresh-token-value',
              label: 'primary-token',
            },
          ],
          credentials: {
            username: 'workflow-user',
            password: 'workflow-password',
          },
          secrets: {
            clientSecret: 'client-secret-value',
            description: 'provider-secrets',
          },
        },
      });

      expect(schedule.metadata).toEqual({
        tokens: [
          {
            accessToken: WORKFLOW_SCHEDULE_SECRET_MASK,
            refreshToken: WORKFLOW_SCHEDULE_SECRET_MASK,
            label: 'primary-token',
          },
        ],
        credentials: {
          username: 'workflow-user',
          password: WORKFLOW_SCHEDULE_SECRET_MASK,
        },
        secrets: {
          clientSecret: WORKFLOW_SCHEDULE_SECRET_MASK,
          description: 'provider-secrets',
        },
      });
    });
    it('returns defensive copies of schedules', () => {
      const created = service.scheduleImmediate({
        workflowId: 'workflow-copy',
        metadata: {
          safe: 'original',
        },
      });

      created.metadata.safe = 'mutated';

      expect(
        service.getSchedule(created.id).metadata.safe,
      ).toBe('original');
    });
  });

  describe('schedule validation and lookup', () => {
    it('validates schedule requests without storing them', () => {
      const result = service.validateSchedule(
        {
          workflowId: '',
          intervalMs: 500,
        },
        'recurring',
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          'workflowId is required.',
          expect.stringContaining('intervalMs'),
        ]),
      );
    });

    it('filters schedules by workflow', () => {
      service.scheduleImmediate({
        workflowId: 'workflow-a',
      });

      service.scheduleImmediate({
        workflowId: 'workflow-b',
      });

      expect(service.listSchedules('workflow-a')).toHaveLength(
        1,
      );
    });

    it('throws when a schedule does not exist', () => {
      expect(() =>
        service.getSchedule('missing-schedule'),
      ).toThrow(NotFoundException);
    });
  });
});

