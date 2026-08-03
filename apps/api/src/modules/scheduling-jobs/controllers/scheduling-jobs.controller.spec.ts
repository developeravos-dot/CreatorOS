import {
  NotFoundException,
} from '@nestjs/common';

import {
  SchedulingJobsController,
} from './scheduling-jobs.controller';

describe(
  'SchedulingJobsController',
  () => {
    function setup() {
      const engine = {
        listExecutions:
          jest.fn(() => []),
        create:
          jest.fn(() => ({
            id: 'job-one',
          })),
        getById:
          jest.fn(
            ():
              | {
                  id: string;
                }
              | undefined => ({
              id: 'job-one',
            }),
          ),
        getExecutionById:
          jest.fn(
            ():
              | {
                  id: string;
                }
              | undefined => ({
              id:
                'execution-one',
            }),
          ),
        getHistory:
          jest.fn(
            ():
              | {
                  jobId: string;
                }
              | undefined => ({
              jobId: 'job-one',
            }),
          ),
        enqueue:
          jest.fn(() => ({
            id:
              'execution-one',
          })),
        startExecution:
          jest.fn(() => ({
            id:
              'execution-one',
          })),
        updateProgress:
          jest.fn(() => ({
            id:
              'execution-one',
          })),
        completeExecution:
          jest.fn(() => ({
            id:
              'execution-one',
          })),
        failExecution:
          jest.fn(() => ({
            successful: true,
          })),
        pause:
          jest.fn(() => ({
            id: 'job-one',
          })),
        resume:
          jest.fn(() => ({
            id: 'job-one',
          })),
        cancel:
          jest.fn(() => ({
            id: 'job-one',
          })),
        retry:
          jest.fn(() => ({
            id:
              'execution-two',
          })),
        update:
          jest.fn(() => ({
            id: 'job-one',
          })),
        delete:
          jest.fn(() => true),
      };

      const scheduler = {
        list:
          jest.fn(() => []),
        tick:
          jest.fn(() => ({
            enqueuedJobs: 0,
          })),
        getById:
          jest.fn(() => ({
            id:
              'schedule-one',
          })),
        createSchedule:
          jest.fn(() => ({
            id:
              'schedule-one',
          })),
        updateSchedule:
          jest.fn(() => ({
            id:
              'schedule-one',
          })),
        enableSchedule:
          jest.fn(() => ({
            enabled: true,
          })),
        disableSchedule:
          jest.fn(() => ({
            enabled: false,
          })),
        triggerNow:
          jest.fn(() => ({
            id:
              'execution-one',
          })),
        deleteSchedule:
          jest.fn(() => true),
      };

      const query = {
        searchJobs:
          jest.fn(() => ({
            total: 0,
            jobs: [],
          })),
        searchQueues:
          jest.fn(() => ({
            total: 0,
            queues: [],
          })),
      };

      const operations = {
        statistics:
          jest.fn(() => ({
            totalJobs: 0,
          })),
        metrics:
          jest.fn(() => ({
            totalJobs: 0,
          })),
        health:
          jest.fn(() => ({
            status: 'healthy',
          })),
        delayedJobs:
          jest.fn(() => []),
        failedJobs:
          jest.fn(() => []),
        pendingRetries:
          jest.fn(() => []),
        runningJobs:
          jest.fn(() => []),
        scheduledJobs:
          jest.fn(() => []),
        bulkPause:
          jest.fn(() => ({
            successful: 1,
          })),
        bulkResume:
          jest.fn(() => ({
            successful: 1,
          })),
        bulkCancel:
          jest.fn(() => ({
            successful: 1,
          })),
        bulkRetry:
          jest.fn(() => ({
            successful: 1,
          })),
        bulkDelete:
          jest.fn(() => ({
            successful: 1,
          })),
      };

      const adapter = {
        getConfiguration:
          jest.fn(() => ({
            driver: 'memory',
            concurrency: 1,
            defaultPriority:
              'normal',
            paused: false,
            removeCompletedJobs:
              false,
            removeFailedJobs:
              false,
          })),
        configure:
          jest.fn(),
        pause:
          jest.fn(),
        resume:
          jest.fn(),
      };

      const queues = {
        create:
          jest.fn(() => adapter),
        require:
          jest.fn(() => adapter),
        remove:
          jest.fn(() => true),
      };

      const controller =
        new SchedulingJobsController(
          engine as never,
          scheduler as never,
          query as never,
          operations as never,
          queues as never,
        );

      return {
        controller,
        engine,
        scheduler,
        query,
        operations,
        queues,
      };
    }

    it(
      'delegates list and platform summaries',
      () => {
        const {
          controller,
          query,
          operations,
        } = setup();

        controller.list({});
        controller.statistics();
        controller.metrics();
        controller.health();

        expect(
          query.searchJobs,
        ).toHaveBeenCalled();

        expect(
          operations.statistics,
        ).toHaveBeenCalled();

        expect(
          operations.metrics,
        ).toHaveBeenCalled();

        expect(
          operations.health,
        ).toHaveBeenCalled();
      },
    );

    it(
      'creates and operates jobs',
      () => {
        const {
          controller,
          engine,
        } = setup();

        controller.create({
          name: 'Job one',
        });

        controller.enqueue(
          'job-one',
          {},
        );

        controller.pause(
          'job-one',
          {},
        );

        controller.resume(
          'job-one',
          {},
        );

        controller.cancel(
          'job-one',
          {},
        );

        controller.retry(
          'job-one',
          {},
        );

        expect(
          engine.create,
        ).toHaveBeenCalled();

        expect(
          engine.enqueue,
        ).toHaveBeenCalled();

        expect(
          engine.pause,
        ).toHaveBeenCalled();

        expect(
          engine.resume,
        ).toHaveBeenCalled();

        expect(
          engine.cancel,
        ).toHaveBeenCalled();

        expect(
          engine.retry,
        ).toHaveBeenCalled();
      },
    );

    it(
      'delegates bulk operations',
      () => {
        const {
          controller,
          operations,
        } = setup();

        const input = {
          jobIds: [
            'job-one',
          ],
        };

        controller.bulkPause(
          input,
        );

        controller.bulkResume(
          input,
        );

        controller.bulkCancel(
          input,
        );

        controller.bulkRetry(
          input,
        );

        controller.bulkDelete(
          input,
        );

        expect(
          operations.bulkPause,
        ).toHaveBeenCalled();

        expect(
          operations.bulkResume,
        ).toHaveBeenCalled();

        expect(
          operations.bulkCancel,
        ).toHaveBeenCalled();

        expect(
          operations.bulkRetry,
        ).toHaveBeenCalled();

        expect(
          operations.bulkDelete,
        ).toHaveBeenCalled();
      },
    );

    it(
      'delegates scheduler operations',
      () => {
        const {
          controller,
          scheduler,
        } = setup();

        controller.schedulerTick(
          {},
        );

        controller.createSchedule({
          jobId: 'job-one',
          kind: 'manual',
        });

        controller.enableSchedule(
          'schedule-one',
        );

        controller.disableSchedule(
          'schedule-one',
        );

        controller.triggerSchedule(
          'schedule-one',
        );

        expect(
          scheduler.tick,
        ).toHaveBeenCalled();

        expect(
          scheduler.createSchedule,
        ).toHaveBeenCalled();

        expect(
          scheduler.enableSchedule,
        ).toHaveBeenCalled();

        expect(
          scheduler.disableSchedule,
        ).toHaveBeenCalled();

        expect(
          scheduler.triggerNow,
        ).toHaveBeenCalled();
      },
    );

    it(
      'delegates execution lifecycle',
      () => {
        const {
          controller,
          engine,
        } = setup();

        controller.startExecution(
          'execution-one',
          {
            workerId:
              'worker-one',
          },
        );

        controller.updateExecutionProgress(
          'execution-one',
          {
            percentage: 50,
          },
        );

        controller.completeExecution(
          'execution-one',
          {},
        );

        controller.failExecution(
          'execution-one',
          {
            kind:
              'execution',
            message:
              'Failed.',
            retryable: true,
          },
        );

        expect(
          engine.startExecution,
        ).toHaveBeenCalled();

        expect(
          engine.updateProgress,
        ).toHaveBeenCalled();

        expect(
          engine.completeExecution,
        ).toHaveBeenCalled();

        expect(
          engine.failExecution,
        ).toHaveBeenCalled();
      },
    );

    it(
      'throws when job is missing',
      () => {
        const {
          controller,
          engine,
        } = setup();

        engine.getById
          .mockReturnValueOnce(
            undefined,
          );

        expect(() =>
          controller.details(
            'missing',
          ),
        ).toThrow(
          NotFoundException,
        );
      },
    );
  },
);