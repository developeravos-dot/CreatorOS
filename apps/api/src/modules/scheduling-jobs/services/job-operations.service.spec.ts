import {
  JobEngineService,
} from './job-engine.service';
import {
  JobOperationsService,
} from './job-operations.service';
import {
  JobQueryService,
} from './job-query.service';
import {
  JobQueueFactoryService,
} from './job-queue-factory.service';
import {
  JobRetryPolicyService,
} from './job-retry-policy.service';
import {
  JobSchedulerService,
} from './job-scheduler.service';
import {
  JobStateMachineService,
} from './job-state-machine.service';

describe(
  'JobOperationsService',
  () => {
    function setup() {
      const engine =
        new JobEngineService(
          new JobStateMachineService(),
        );

      const scheduler =
        new JobSchedulerService(
          engine,
        );

      const queues =
        new JobQueueFactoryService();

      queues.create(
        'default',
      );

      const retry =
        new JobRetryPolicyService();

      const query =
        new JobQueryService(
          engine,
          scheduler,
          queues,
        );

      const service =
        new JobOperationsService(
          engine,
          scheduler,
          query,
          queues,
          retry,
        );

      return {
        engine,
        scheduler,
        queues,
        retry,
        query,
        service,
      };
    }

    it(
      'aggregates job statistics',
      () => {
        const {
          engine,
          scheduler,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
          type:
            'content_generation',
          priority:
            'high',
        });

        engine.create({
          id:
            'job-two',
          name:
            'Job two',
          type:
            'cleanup',
          priority:
            'low',
        });

        engine.enqueue(
          'job-one',
        );

        scheduler.createSchedule({
          id:
            'schedule-two',
          jobId:
            'job-two',
          definition: {
            kind:
              'cron',
            expression:
              '0 * * * *',
            timezone:
              'UTC',
          },
        });

        const statistics =
          service.statistics();

        expect(
          statistics.totalJobs,
        ).toBe(2);

        expect(
          statistics.states
            .queued,
        ).toBe(1);

        expect(
          statistics.states
            .scheduled,
        ).toBe(1);

        expect(
          statistics.priorities
            .high,
        ).toBe(1);

        expect(
          statistics.types
            .cleanup,
        ).toBe(1);

        expect(
          statistics.schedules
            .cron,
        ).toBe(1);
      },
    );

    it(
      'returns healthy status without failures',
      () => {
        const {
          engine,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
        });

        const health =
          service.health();

        expect(
          health.status,
        ).toBe('healthy');

        expect(
          health.totalJobs,
        ).toBe(1);
      },
    );

    it(
      'bulk pauses jobs with failure isolation',
      () => {
        const {
          engine,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
        });

        engine.create({
          id:
            'job-two',
          name:
            'Job two',
        });

        engine.enqueue(
          'job-one',
        );

        const result =
          service.bulkPause({
            jobIds: [
              'job-one',
              'job-two',
              'missing',
            ],
            pauseRunningExecutions:
              false,
          });

        expect(
          result.requested,
        ).toBe(3);

        expect(
          result.successful,
        ).toBe(1);

        expect(
          result.failed,
        ).toBe(2);

        expect(
          result.jobIds,
        ).toEqual([
          'job-one',
        ]);
      },
    );

    it(
      'bulk resumes paused jobs',
      () => {
        const {
          engine,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
        });

        engine.enqueue(
          'job-one',
        );

        engine.pause(
          'job-one',
        );

        const result =
          service.bulkResume({
            jobIds: [
              'job-one',
            ],
            enqueueImmediately:
              false,
          });

        expect(
          result.successful,
        ).toBe(1);

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe('queued');
      },
    );

    it(
      'bulk cancels jobs',
      () => {
        const {
          engine,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
        });

        engine.enqueue(
          'job-one',
        );

        const result =
          service.bulkCancel({
            jobIds: [
              'job-one',
            ],
            force: false,
          });

        expect(
          result.successful,
        ).toBe(1);

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe(
          'cancelled',
        );
      },
    );

    it(
      'bulk retries failed jobs',
      () => {
        const {
          engine,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
        });

        const execution =
          engine.enqueue(
            'job-one',
          );

        engine.startExecution(
          execution.id,
          'worker-one',
        );

        engine.failExecution(
          execution.id,
          {
            kind:
              'validation',
            message:
              'Invalid.',
            retryable:
              false,
            occurredAt:
              new Date()
                .toISOString(),
          },
        );

        const result =
          service.bulkRetry({
            jobIds: [
              'job-one',
            ],
            resetAttemptCount:
              false,
            delayMs: 0,
          });

        expect(
          result.successful,
        ).toBe(1);

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe('queued');
      },
    );

    it(
      'bulk deletes terminal jobs',
      () => {
        const {
          engine,
          service,
        } = setup();

        engine.create({
          id:
            'job-one',
          name:
            'Job one',
        });

        engine.cancel(
          'job-one',
        );

        const result =
          service.bulkDelete({
            jobIds: [
              'job-one',
            ],
            force: false,
            deleteHistory:
              true,
            deleteExecutions:
              true,
            deleteSchedule:
              true,
          });

        expect(
          result.successful,
        ).toBe(1);

        expect(
          engine.getById(
            'job-one',
          ),
        ).toBeUndefined();
      },
    );

    it(
      'exposes helper query groups',
      () => {
        const {
          engine,
          scheduler,
          service,
        } = setup();

        engine.create({
          id:
            'delayed-job',
          name:
            'Delayed job',
        });

        engine.enqueue(
          'delayed-job',
          {
            delayMs:
              60_000,
          },
        );

        engine.create({
          id:
            'scheduled-job',
          name:
            'Scheduled job',
        });

        scheduler.createSchedule({
          jobId:
            'scheduled-job',
          definition: {
            kind:
              'manual',
          },
        });

        expect(
          service.delayedJobs()
            .map(
              (job) =>
                job.id,
            ),
        ).toContain(
          'delayed-job',
        );

        expect(
          service.executions(),
        ).toHaveLength(1);
      },
    );

    it(
      'returns aggregate queue metrics',
      () => {
        const {
          queues,
          service,
        } = setup();

        queues.require(
          'default',
        ).enqueue({
          id:
            'queue-item',
          jobId:
            'job-one',
          executionId:
            'execution-one',
          queueName:
            'default',
          priority:
            'normal',
          payload: {},
        });

        const statistics =
          service.statistics();

        expect(
          statistics.queues
            .totalQueues,
        ).toBe(1);

        expect(
          statistics.queues
            .waiting,
        ).toBe(1);

        expect(
          statistics.queues
            .totalItems,
        ).toBe(1);
      },
    );
  },
);