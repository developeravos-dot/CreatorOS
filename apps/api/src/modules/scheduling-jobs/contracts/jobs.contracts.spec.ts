import type {
  BulkPauseJobsContract,
  CreateJobContract,
  CreateJobScheduleContract,
  JobDetailsContract,
  JobListQueryContract,
  JobListResultContract,
  JobOperationResultContract,
  JobSchedulerTickResultContract,
} from './jobs.contracts';
import type {
  Job,
  JobHistory,
  JobSchedule,
} from '../models';

describe(
  'jobs contracts',
  () => {
    const timestamp =
      '2026-08-04T10:00:00.000Z';

    const job:
      Job = {
        id: 'job-one',
        name: 'Job one',
        type: 'one_time',
        state: 'queued',
        priority: 'normal',
        queueName: 'default',
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
            singleton: false,
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
        executionCount: 0,
        progress: {
          percentage: 0,
          updatedAt:
            timestamp,
        },
        tags: {
          tags: [],
          labels: {},
        },
        createdAt:
          timestamp,
        updatedAt:
          timestamp,
      };

    it(
      'supports job creation contracts',
      () => {
        const input:
          CreateJobContract = {
            name:
              'Generate content',
            type:
              'content_generation',
            priority:
              'high',
            queueName:
              'content',
            payload: {
              projectId:
                'project-one',
            },
          };

        expect(input.name).toBe(
          'Generate content',
        );

        expect(input.type).toBe(
          'content_generation',
        );
      },
    );

    it(
      'supports schedule contracts',
      () => {
        const input:
          CreateJobScheduleContract = {
            jobId:
              'job-one',
            definition: {
              kind: 'cron',
              expression:
                '0 * * * *',
              timezone:
                'UTC',
            },
            enabled: true,
          };

        expect(
          input.definition.kind,
        ).toBe('cron');
      },
    );

    it(
      'supports query and paginated result contracts',
      () => {
        const query:
          JobListQueryContract = {
            states: [
              'queued',
              'running',
            ],
            priorities: [
              'high',
            ],
            page: 1,
            pageSize: 25,
          };

        const result:
          JobListResultContract = {
            count: 1,
            total: 1,
            pagination: {
              page: 1,
              pageSize: 25,
              totalItems: 1,
              totalPages: 1,
              hasPreviousPage:
                false,
              hasNextPage:
                false,
            },
            jobs: [
              job,
            ],
          };

        expect(query.states)
          .toContain('queued');

        expect(result.total).toBe(
          1,
        );
      },
    );

    it(
      'supports bulk operation contracts',
      () => {
        const input:
          BulkPauseJobsContract = {
            jobIds: [
              'job-one',
              'job-two',
            ],
            requestedBy:
              'user-one',
            reason:
              'Maintenance.',
            pauseRunningExecutions:
              false,
          };

        expect(input.jobIds)
          .toHaveLength(2);
      },
    );

    it(
      'supports job detail contracts',
      () => {
        const history:
          JobHistory = {
            jobId:
              'job-one',
            events: [],
            stateTransitions: [],
            executions: [],
            retries: [],
            createdAt:
              timestamp,
            updatedAt:
              timestamp,
          };

        const schedule:
          JobSchedule = {
            id:
              'schedule-one',
            jobId:
              'job-one',
            definition: {
              kind: 'manual',
            },
            enabled: true,
            runCount: 0,
            createdAt:
              timestamp,
            updatedAt:
              timestamp,
          };

        const details:
          JobDetailsContract = {
            job,
            schedule,
            history,
          };

        expect(
          details.job.id,
        ).toBe('job-one');

        expect(
          details.schedule?.id,
        ).toBe(
          'schedule-one',
        );
      },
    );

    it(
      'supports operation result contracts',
      () => {
        const result:
          JobOperationResultContract = {
            successful: true,
            jobId:
              'job-one',
            state:
              'queued',
            message:
              'Job queued.',
            job,
          };

        expect(
          result.successful,
        ).toBe(true);
      },
    );

    it(
      'supports scheduler tick result contracts',
      () => {
        const result:
          JobSchedulerTickResultContract = {
            evaluatedSchedules: 4,
            dueSchedules: 2,
            enqueuedJobs: 2,
            skippedSchedules: 2,
            failedSchedules: 0,
            jobIds: [
              'job-one',
              'job-two',
            ],
            failures: [],
            processedAt:
              timestamp,
          };

        expect(
          result.enqueuedJobs,
        ).toBe(2);
      },
    );
  },
);