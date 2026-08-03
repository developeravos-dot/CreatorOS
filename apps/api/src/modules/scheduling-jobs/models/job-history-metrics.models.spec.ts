import {
  JobHistoryModel,
  JobMetricsModel,
  appendJobExecutionHistory,
  appendJobHistoryEvent,
  appendJobRetryHistory,
  appendJobStateTransition,
  calculateJobMetrics,
  createEmptyJobHistory,
  type Job,
  type JobExecution,
  type JobHistory,
  type JobMetrics,
  type JobQueue,
  type JobSchedule,
} from './job.models';

describe(
  'job history and metrics models',
  () => {
    const now =
      '2026-08-04T10:00:00.000Z';

    it(
      'creates an empty job history',
      () => {
        const history =
          createEmptyJobHistory(
            ' job-one ',
            now,
          );

        expect(
          history.jobId,
        ).toBe('job-one');

        expect(history.events)
          .toEqual([]);

        expect(
          history.createdAt,
        ).toBe(now);
      },
    );

    it(
      'appends history records immutably',
      () => {
        let history:
          JobHistory =
            createEmptyJobHistory(
              'job-one',
              now,
            );

        history =
          appendJobHistoryEvent(
            history,
            {
              id:
                'event-one',
              jobId:
                'job-one',
              type:
                'created',
              occurredAt:
                now,
              state:
                'draft',
              correlation: {
                correlationId:
                  'correlation-one',
              },
              metadata: {
                source:
                  'test',
              },
            },
          );

        history =
          appendJobStateTransition(
            history,
            {
              from:
                'draft',
              to:
                'queued',
              transitionedAt:
                '2026-08-04T10:01:00.000Z',
            },
          );

        history =
          appendJobExecutionHistory(
            history,
            {
              executionId:
                'execution-one',
              attemptNumber: 1,
              state:
                'completed',
              outcome:
                'success',
              startedAt:
                now,
              finishedAt:
                '2026-08-04T10:02:00.000Z',
              durationMs:
                120_000,
            },
            '2026-08-04T10:02:00.000Z',
          );

        history =
          appendJobRetryHistory(
            history,
            {
              executionId:
                'execution-one',
              previousAttemptNumber: 1,
              nextAttemptNumber: 2,
              scheduledAt:
                '2026-08-04T10:03:00.000Z',
              retryAt:
                '2026-08-04T10:03:02.000Z',
              delayMs: 2_000,
              reason:
                'Temporary failure.',
              failure: {
                kind:
                  'infrastructure',
                message:
                  'Temporary failure.',
                retryable: true,
                occurredAt:
                  '2026-08-04T10:03:00.000Z',
              },
            },
          );

        expect(history.events)
          .toHaveLength(1);

        expect(
          history.stateTransitions,
        ).toHaveLength(1);

        expect(history.executions)
          .toHaveLength(1);

        expect(history.retries)
          .toHaveLength(1);
      },
    );

    it(
      'creates independent history snapshots',
      () => {
        const source =
          appendJobHistoryEvent(
            createEmptyJobHistory(
              'job-one',
              now,
            ),
            {
              id: 'event-one',
              jobId: 'job-one',
              type: 'created',
              occurredAt: now,
              correlation: {},
              metadata: {
                safe: true,
              },
            },
          );

        const result =
          new JobHistoryModel(
            source,
          ).toContract();

        expect(result).toEqual(
          source,
        );

        expect(result).not.toBe(
          source,
        );

        expect(result.events)
          .not.toBe(
            source.events,
          );

        expect(
          result.events[0]
            ?.metadata,
        ).not.toBe(
          source.events[0]
            ?.metadata,
        );
      },
    );

    it(
      'calculates aggregate job metrics',
      () => {
        const jobs:
          Job[] = [
            {
              id: 'job-one',
              name: 'Job one',
              type:
                'one_time',
              state:
                'completed',
              priority:
                'high',
              queueName:
                'default',
              payload: {
                data: {},
                contentType:
                  'application/json',
              },
              configuration: {
                timeout: {
                  terminateOnTimeout:
                    true,
                },
                concurrency: {
                  singleton:
                    false,
                  replaceExisting:
                    false,
                },
                retention: {
                  removeOnComplete:
                    false,
                  removeOnFailure:
                    false,
                },
                maximumAttempts: 3,
                enabled: true,
              },
              correlation: {},
              ownership: {},
              dependencies: [],
              executionCount: 1,
              progress: {
                percentage: 100,
                updatedAt: now,
              },
              tags: {
                tags: [],
                labels: {},
              },
              createdAt: now,
              updatedAt: now,
            },
            {
              id: 'job-two',
              name: 'Job two',
              type:
                'cron',
              state:
                'running',
              priority:
                'critical',
              queueName:
                'scheduled',
              payload: {
                data: {},
                contentType:
                  'application/json',
              },
              configuration: {
                timeout: {
                  terminateOnTimeout:
                    true,
                },
                concurrency: {
                  singleton:
                    true,
                  replaceExisting:
                    false,
                },
                retention: {
                  removeOnComplete:
                    false,
                  removeOnFailure:
                    false,
                },
                maximumAttempts: 3,
                enabled: true,
              },
              correlation: {},
              ownership: {},
              dependencies: [],
              executionCount: 2,
              progress: {
                percentage: 50,
                updatedAt: now,
              },
              tags: {
                tags: [],
                labels: {},
              },
              createdAt: now,
              updatedAt: now,
            },
          ];

        const executions:
          JobExecution[] = [
            {
              id:
                'execution-one',
              jobId:
                'job-one',
              state:
                'completed',
              outcome:
                'success',
              attemptNumber: 1,
              queueName:
                'default',
              priority:
                'high',
              payload: {
                data: {},
                contentType:
                  'application/json',
              },
              progress: {
                percentage: 100,
                updatedAt: now,
              },
              timing: {
                durationMs:
                  1_000,
              },
              correlation: {},
              history: [],
              createdAt: now,
              updatedAt: now,
            },
            {
              id:
                'execution-two',
              jobId:
                'job-two',
              state:
                'failed',
              outcome:
                'failure',
              attemptNumber: 2,
              queueName:
                'scheduled',
              priority:
                'critical',
              payload: {
                data: {},
                contentType:
                  'application/json',
              },
              progress: {
                percentage: 25,
                updatedAt: now,
              },
              timing: {
                durationMs:
                  3_000,
              },
              correlation: {},
              history: [],
              createdAt: now,
              updatedAt: now,
            },
          ];

        const schedules:
          JobSchedule[] = [
            {
              id:
                'schedule-one',
              jobId:
                'job-two',
              definition: {
                kind: 'cron',
                expression:
                  '0 * * * *',
                timezone:
                  'UTC',
              },
              enabled: true,
              runCount: 2,
              nextRunAt:
                '2026-08-04T11:00:00.000Z',
              createdAt: now,
              updatedAt: now,
            },
          ];

        const queues:
          JobQueue[] = [
            {
              name: 'default',
              configuration: {
                driver:
                  'memory',
                concurrency: 1,
                defaultPriority:
                  'normal',
                paused: false,
                removeCompletedJobs:
                  false,
                removeFailedJobs:
                  false,
              },
              metrics: {
                waiting: 0,
                delayed: 0,
                active: 1,
                completed: 1,
                failed: 1,
                paused: 0,
                total: 3,
                generatedAt: now,
              },
              createdAt: now,
              updatedAt: now,
            },
          ];

        const metrics =
          calculateJobMetrics({
            jobs,
            executions,
            schedules,
            queues,
            generatedAt: now,
          });

        expect(
          metrics.totalJobs,
        ).toBe(2);

        expect(
          metrics.state
            .states.completed,
        ).toBe(1);

        expect(
          metrics.state
            .states.running,
        ).toBe(1);

        expect(
          metrics.executions
            .totalExecutions,
        ).toBe(2);

        expect(
          metrics.executions
            .successfulExecutions,
        ).toBe(1);

        expect(
          metrics.executions
            .failedExecutions,
        ).toBe(1);

        expect(
          metrics.executions
            .retryExecutions,
        ).toBe(1);

        expect(
          metrics.executions
            .successRate,
        ).toBe(0.5);

        expect(
          metrics.executions
            .duration.averageMs,
        ).toBe(2_000);

        expect(
          metrics.schedules
            .cronSchedules,
        ).toBe(1);

        expect(
          metrics.schedules
            .nextScheduledAt,
        ).toBe(
          '2026-08-04T11:00:00.000Z',
        );
      },
    );

    it(
      'creates independent metrics snapshots',
      () => {
        const source:
          JobMetrics = {
            totalJobs: 0,
            state: {
              states: {
                draft: 0,
                scheduled: 0,
                queued: 0,
                waiting: 0,
                delayed: 0,
                running: 0,
                retry_scheduled: 0,
                paused: 0,
                completed: 0,
                failed: 0,
                cancelled: 0,
                dead_lettered: 0,
                expired: 0,
              },
              activeJobs: 0,
              terminalJobs: 0,
            },
            priority: {
              priorities: {
                lowest: 0,
                low: 0,
                normal: 0,
                high: 0,
                urgent: 0,
                critical: 0,
              },
            },
            type: {
              types: {
                one_time: 0,
                delayed: 0,
                recurring: 0,
                cron: 0,
                workflow: 0,
                capability: 0,
                content_generation: 0,
                content_publishing: 0,
                notification: 0,
                monitoring: 0,
                maintenance: 0,
                data_processing: 0,
                integration: 0,
                cleanup: 0,
                custom: 0,
              },
            },
            executions: {
              totalExecutions: 0,
              successfulExecutions: 0,
              failedExecutions: 0,
              cancelledExecutions: 0,
              timedOutExecutions: 0,
              expiredExecutions: 0,
              activeExecutions: 0,
              retryExecutions: 0,
              successRate: 0,
              failureRate: 0,
              duration: {
                totalMs: 0,
                sampleCount: 0,
              },
            },
            schedules: {
              totalSchedules: 0,
              enabledSchedules: 0,
              disabledSchedules: 0,
              recurringSchedules: 0,
              delayedSchedules: 0,
              cronSchedules: 0,
              intervalSchedules: 0,
            },
            queues: [],
            generatedAt: now,
          };

        const result =
          new JobMetricsModel(
            source,
          ).toContract();

        expect(result).toEqual(
          source,
        );

        expect(result).not.toBe(
          source,
        );

        expect(result.state)
          .not.toBe(
            source.state,
          );

        expect(
          result.executions,
        ).not.toBe(
          source.executions,
        );
      },
    );
  },
);