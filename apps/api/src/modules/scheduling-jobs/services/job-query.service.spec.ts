import {
  JobEngineService,
} from './job-engine.service';
import {
  JobQueryService,
} from './job-query.service';
import {
  JobQueueFactoryService,
} from './job-queue-factory.service';
import {
  JobSchedulerService,
} from './job-scheduler.service';
import {
  JobStateMachineService,
} from './job-state-machine.service';

describe(
  'JobQueryService',
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

      const queueFactory =
        new JobQueueFactoryService();

      queueFactory.create(
        'default',
      );

      queueFactory.create(
        'content',
        {
          concurrency: 2,
        },
      );

      const query =
        new JobQueryService(
          engine,
          scheduler,
          queueFactory,
        );

      return {
        engine,
        scheduler,
        queueFactory,
        query,
      };
    }

    function seed() {
      const context =
        setup();

      context.engine.create({
        id: 'job-one',
        name:
          'Generate content',
        type:
          'content_generation',
        priority: 'high',
        queueName:
          'content',
        tags: [
          'content',
          'production',
        ],
        ownership: {
          createdBy:
            'user-one',
          workspaceId:
            'workspace-one',
        },
        correlation: {
          correlationId:
            'correlation-one',
        },
      });

      context.engine.create({
        id: 'job-two',
        name:
          'System cleanup',
        type:
          'cleanup',
        priority: 'low',
        queueName:
          'default',
        tags: [
          'maintenance',
        ],
        ownership: {
          createdBy:
            'system',
          workspaceId:
            'workspace-two',
        },
      });

      context.engine.enqueue(
        'job-one',
      );

      context.scheduler
        .createSchedule({
          id:
            'schedule-two',
          jobId:
            'job-two',
          definition: {
            kind: 'cron',
            expression:
              '0 * * * *',
            timezone:
              'UTC',
          },
        });

      return context;
    }

    it(
      'performs advanced job search',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchJobs({
            search:
              'generate',
          });

        expect(result.total)
          .toBe(1);

        expect(
          result.jobs[0]?.id,
        ).toBe('job-one');
      },
    );

    it(
      'filters jobs by state priority type queue workspace and tags',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchJobs({
            states: [
              'queued',
            ],
            priorities: [
              'high',
            ],
            types: [
              'content_generation',
            ],
            queueNames: [
              'content',
            ],
            workspaceId:
              'workspace-one',
            tags: [
              'content',
              'production',
            ],
          });

        expect(result.total)
          .toBe(1);

        expect(
          result.jobs[0]?.id,
        ).toBe('job-one');
      },
    );

    it(
      'sorts jobs by priority',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchJobs({
            sortBy:
              'priority',
            sortDirection:
              'desc',
          });

        expect(
          result.jobs[0]
            ?.priority,
        ).toBe('high');
      },
    );

    it(
      'supports pagination',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchJobs({
            page: 2,
            pageSize: 1,
            sortBy: 'name',
            sortDirection:
              'asc',
          });

        expect(result.total)
          .toBe(2);

        expect(
          result.pagination
            .totalPages,
        ).toBe(2);

        expect(
          result.pagination.page,
        ).toBe(2);

        expect(result.jobs)
          .toHaveLength(1);
      },
    );

    it(
      'queries executions',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchExecutions({
            jobId: 'job-one',
            states: [
              'queued',
            ],
          });

        expect(result.total)
          .toBe(1);

        expect(
          result.executions[0]
            ?.jobId,
        ).toBe('job-one');
      },
    );

    it(
      'queries schedules',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchSchedules({
            jobId: 'job-two',
            kinds: [
              'cron',
            ],
            enabled: true,
          });

        expect(result.total)
          .toBe(1);

        expect(
          result.schedules[0]
            ?.id,
        ).toBe(
          'schedule-two',
        );
      },
    );

    it(
      'queries queues',
      () => {
        const {
          query,
        } = seed();

        const result =
          query.searchQueues({
            names: [
              'content',
            ],
            drivers: [
              'memory',
            ],
          });

        expect(result.total)
          .toBe(1);

        expect(
          result.queues[0]
            ?.name,
        ).toBe('content');
      },
    );

    it(
      'returns scheduled jobs',
      () => {
        const {
          query,
        } = seed();

        expect(
          query.findScheduledJobs()
            .map(
              (job) => job.id,
            ),
        ).toContain(
          'job-two',
        );
      },
    );

    it(
      'returns delayed retry failed and running helper queries',
      () => {
        const {
          query,
        } = seed();

        expect(
          query.findDelayedJobs(),
        ).toEqual([]);

        expect(
          query.findPendingRetries(),
        ).toEqual([]);

        expect(
          query.findFailedJobs(),
        ).toEqual([]);

        expect(
          query.findRunningJobs(),
        ).toEqual([]);
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const {
          query,
        } = seed();

        const first =
          query.searchJobs();

        const second =
          query.searchJobs();

        expect(first).not.toBe(
          second,
        );

        expect(first.jobs)
          .not.toBe(
            second.jobs,
          );

        expect(
          first.jobs[0],
        ).not.toBe(
          second.jobs[0],
        );
      },
    );
  },
);