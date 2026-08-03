import {
  JobQueueModel,
  JobRetryPolicyModel,
  JobScheduleModel,
  calculateJobRetryDelay,
  createDefaultJobRetryPolicy,
  evaluateJobRetry,
  isRecurringJobSchedule,
  validateJobScheduleDefinition,
  type JobQueue,
  type JobRetryPolicy,
  type JobSchedule,
} from './job.models';

describe(
  'job schedule queue and retry models',
  () => {
    const now =
      '2026-08-04T10:00:00.000Z';

    it(
      'creates independent schedule snapshots',
      () => {
        const source:
          JobSchedule = {
            id:
              'schedule-one',
            jobId:
              'job-one',
            definition: {
              kind:
                'cron',
              expression:
                '0 * * * *',
              timezone:
                'Asia/Dubai',
              maximumRuns:
                10,
            },
            enabled: true,
            runCount: 0,
            nextRunAt:
              '2026-08-04T11:00:00.000Z',
            createdAt: now,
            updatedAt: now,
          };

        const result =
          new JobScheduleModel(
            source,
          ).toContract();

        expect(result).toEqual(
          source,
        );

        expect(result).not.toBe(
          source,
        );

        expect(
          result.definition,
        ).not.toBe(
          source.definition,
        );
      },
    );

    it(
      'identifies recurring schedules',
      () => {
        expect(
          isRecurringJobSchedule({
            kind: 'cron',
            expression:
              '0 * * * *',
            timezone:
              'UTC',
          }),
        ).toBe(true);

        expect(
          isRecurringJobSchedule({
            kind: 'interval',
            intervalMs: 60_000,
            startAt: now,
            runImmediately: false,
          }),
        ).toBe(true);

        expect(
          isRecurringJobSchedule({
            kind: 'manual',
          }),
        ).toBe(false);
      },
    );

    it(
      'validates schedule definitions',
      () => {
        expect(() =>
          validateJobScheduleDefinition({
            kind: 'delayed',
            runAt:
              '2026-08-04T11:00:00.000Z',
            delayMs: 3_600_000,
          }),
        ).not.toThrow();

        expect(() =>
          validateJobScheduleDefinition({
            kind: 'interval',
            intervalMs: 0,
            startAt: now,
            runImmediately: false,
          }),
        ).toThrow(
          'intervalMs',
        );

        expect(() =>
          validateJobScheduleDefinition({
            kind: 'cron',
            expression: ' ',
            timezone: 'UTC',
          }),
        ).toThrow(
          'Cron expression',
        );
      },
    );

    it(
      'creates independent queue snapshots',
      () => {
        const source:
          JobQueue = {
            name:
              'content',
            description:
              'Content queue.',
            configuration: {
              driver:
                'memory',
              concurrency: 4,
              defaultPriority:
                'normal',
              paused: false,
              removeCompletedJobs:
                false,
              removeFailedJobs:
                false,
            },
            metrics: {
              waiting: 1,
              delayed: 2,
              active: 3,
              completed: 4,
              failed: 5,
              paused: 0,
              total: 15,
              generatedAt: now,
            },
            createdAt: now,
            updatedAt: now,
          };

        const result =
          new JobQueueModel(
            source,
          ).toContract();

        expect(result).toEqual(
          source,
        );

        expect(result).not.toBe(
          source,
        );

        expect(
          result.configuration,
        ).not.toBe(
          source.configuration,
        );

        expect(result.metrics)
          .not.toBe(
            source.metrics,
          );
      },
    );

    it(
      'normalizes retry policies',
      () => {
        const source:
          JobRetryPolicy = {
            maximumAttempts: 5,
            strategy:
              'exponential',
            initialDelayMs:
              1_000,
            maximumDelayMs:
              30_000,
            multiplier: 2,
            retryableFailureKinds: [
              'execution',
              'execution',
              'timeout',
            ],
            retryableErrorCodes: [
              ' TEMPORARY ',
              'TEMPORARY',
            ],
            jitter: false,
          };

        const result =
          new JobRetryPolicyModel(
            source,
          ).toContract();

        expect(
          result.retryableFailureKinds,
        ).toEqual([
          'execution',
          'timeout',
        ]);

        expect(
          result.retryableErrorCodes,
        ).toEqual([
          'TEMPORARY',
        ]);
      },
    );

    it(
      'calculates fixed linear and exponential delays',
      () => {
        const base =
          createDefaultJobRetryPolicy();

        expect(
          calculateJobRetryDelay(
            {
              ...base,
              strategy:
                'fixed',
            },
            3,
          ),
        ).toBe(1_000);

        expect(
          calculateJobRetryDelay(
            {
              ...base,
              strategy:
                'linear',
            },
            3,
          ),
        ).toBe(6_000);

        expect(
          calculateJobRetryDelay(
            {
              ...base,
              strategy:
                'exponential',
            },
            3,
          ),
        ).toBe(4_000);
      },
    );

    it(
      'caps retry delay',
      () => {
        const result =
          calculateJobRetryDelay(
            {
              ...createDefaultJobRetryPolicy(),
              initialDelayMs:
                10_000,
              maximumDelayMs:
                15_000,
            },
            5,
          );

        expect(result).toBe(
          15_000,
        );
      },
    );

    it(
      'evaluates retry decisions',
      () => {
        const result =
          evaluateJobRetry({
            attemptNumber: 1,
            failure: {
              kind:
                'infrastructure',
              message:
                'Temporary failure.',
              retryable: true,
              occurredAt: now,
            },
            policy:
              createDefaultJobRetryPolicy(),
            now,
          });

        expect(
          result.shouldRetry,
        ).toBe(true);

        expect(
          result.nextAttemptNumber,
        ).toBe(2);

        expect(
          result.delayMs,
        ).toBe(2_000);

        expect(
          result.retryAt,
        ).toBe(
          '2026-08-04T10:00:02.000Z',
        );
      },
    );

    it(
      'stops retry when maximum attempts are reached',
      () => {
        const result =
          evaluateJobRetry({
            attemptNumber: 3,
            failure: {
              kind:
                'execution',
              message:
                'Failure.',
              retryable: true,
              occurredAt: now,
            },
            policy:
              createDefaultJobRetryPolicy(),
            now,
          });

        expect(
          result.shouldRetry,
        ).toBe(false);

        expect(result.reason)
          .toContain(
            'Maximum',
          );
      },
    );
  },
);