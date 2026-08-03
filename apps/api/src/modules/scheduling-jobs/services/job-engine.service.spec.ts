import {
  JobEngineService,
} from './job-engine.service';
import {
  JobStateMachineService,
} from './job-state-machine.service';

describe(
  'JobEngineService',
  () => {
    let engine:
      JobEngineService;

    beforeEach(() => {
      engine =
        new JobEngineService(
          new JobStateMachineService(),
        );
    });

    function createJob(
      id = 'job-one',
    ) {
      return engine.create({
        id,
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
        tags: [
          'Content',
          'content',
        ],
      });
    }

    it(
      'creates normalized jobs and histories',
      () => {
        const job =
          createJob();

        expect(job.id).toBe(
          'job-one',
        );

        expect(job.state).toBe(
          'draft',
        );

        expect(job.tags.tags)
          .toEqual([
            'content',
          ]);

        expect(
          engine.getHistory(
            job.id,
          )?.events,
        ).toHaveLength(1);
      },
    );

    it(
      'updates jobs',
      () => {
        createJob();

        const updated =
          engine.update(
            'job-one',
            {
              name:
                'Updated job',
              priority:
                'critical',
              enabled:
                false,
            },
          );

        expect(updated.name).toBe(
          'Updated job',
        );

        expect(
          updated.priority,
        ).toBe('critical');

        expect(
          updated.configuration
            .enabled,
        ).toBe(false);
      },
    );

    it(
      'enqueues and starts executions',
      () => {
        createJob();

        const execution =
          engine.enqueue(
            'job-one',
          );

        expect(
          execution.state,
        ).toBe('queued');

        const running =
          engine.startExecution(
            execution.id,
            'worker-one',
          );

        expect(running.state)
          .toBe('running');

        expect(
          running.lease
            ?.workerId,
        ).toBe('worker-one');

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe('running');
      },
    );

    it(
      'updates execution progress',
      () => {
        createJob();

        const execution =
          engine.enqueue(
            'job-one',
          );

        engine.startExecution(
          execution.id,
          'worker-one',
        );

        const updated =
          engine.updateProgress(
            execution.id,
            {
              percentage: 45,
              currentStep:
                'rendering',
            },
          );

        expect(
          updated.progress
            .percentage,
        ).toBe(45);

        expect(
          engine.getById(
            'job-one',
          )?.progress
            .percentage,
        ).toBe(45);
      },
    );

    it(
      'completes executions and jobs',
      () => {
        createJob();

        const execution =
          engine.enqueue(
            'job-one',
          );

        engine.startExecution(
          execution.id,
          'worker-one',
        );

        const completed =
          engine.completeExecution(
            execution.id,
            {
              result: {
                assetId:
                  'asset-one',
              },
              producedResourceIds: [
                'asset-one',
              ],
            },
          );

        expect(completed.state)
          .toBe('completed');

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe('completed');

        expect(
          engine.getHistory(
            'job-one',
          )?.executions,
        ).toHaveLength(1);
      },
    );

    it(
      'fails executions and schedules retries',
      () => {
        createJob();

        const execution =
          engine.enqueue(
            'job-one',
          );

        engine.startExecution(
          execution.id,
          'worker-one',
        );

        const result =
          engine.failExecution(
            execution.id,
            {
              kind:
                'infrastructure',
              message:
                'Temporary failure.',
              retryable: true,
              occurredAt:
                new Date()
                  .toISOString(),
            },
          );

        expect(
          result.successful,
        ).toBe(true);

        expect(result.state).toBe(
          'retry_scheduled',
        );

        expect(
          engine.getHistory(
            'job-one',
          )?.retries,
        ).toHaveLength(1);
      },
    );

    it(
      'keeps non-retryable failures failed',
      () => {
        createJob();

        const execution =
          engine.enqueue(
            'job-one',
          );

        engine.startExecution(
          execution.id,
          'worker-one',
        );

        const result =
          engine.failExecution(
            execution.id,
            {
              kind:
                'validation',
              message:
                'Invalid request.',
              retryable: false,
              occurredAt:
                new Date()
                  .toISOString(),
            },
          );

        expect(
          result.successful,
        ).toBe(false);

        expect(result.state).toBe(
          'failed',
        );
      },
    );

    it(
      'supports pause resume and cancel',
      () => {
        createJob();

        engine.enqueue(
          'job-one',
        );

        expect(
          engine.pause(
            'job-one',
          ).state,
        ).toBe('paused');

        expect(
          engine.resume(
            'job-one',
          ).state,
        ).toBe('queued');

        expect(
          engine.cancel(
            'job-one',
          ).state,
        ).toBe('cancelled');
      },
    );

    it(
      'sanitizes payload secrets',
      () => {
        const job =
          engine.create({
            id:
              'secret-job',
            name:
              'Secret job',
            payload: {
              token:
                'secret-token',
              safe:
                'visible',
            },
          });

        const serialized =
          JSON.stringify(job);

        expect(serialized).not
          .toContain(
            'secret-token',
          );

        expect(serialized)
          .toContain('visible');
      },
    );

    it(
      'returns independent snapshots',
      () => {
        createJob();

        const first =
          engine.getById(
            'job-one',
          );

        const second =
          engine.getById(
            'job-one',
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(first?.payload)
          .not.toBe(
            second?.payload,
          );
      },
    );

    it(
      'calculates job metrics',
      () => {
        createJob(
          'job-one',
        );

        createJob(
          'job-two',
        );

        engine.enqueue(
          'job-one',
        );

        const metrics =
          engine.metrics();

        expect(
          metrics.totalJobs,
        ).toBe(2);

        expect(
          metrics.state
            .states.queued,
        ).toBe(1);

        expect(
          metrics.state
            .states.draft,
        ).toBe(1);
      },
    );

    it(
      'rejects duplicate jobs',
      () => {
        createJob();

        expect(() =>
          createJob(),
        ).toThrow(
          'already exists',
        );
      },
    );
  },
);