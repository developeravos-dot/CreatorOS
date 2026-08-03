import {
  JobExecutionModel,
  JobModel,
  type Job,
  type JobExecution,
} from './job.models';

describe(
  'scheduling job models',
  () => {
    const now =
      '2026-08-04T10:00:00.000Z';

    function createJob():
      Job {
      return {
        id: 'job-one',
        name: 'Generate content',
        description:
          'Generate scheduled content.',
        type:
          'content_generation',
        state:
          'queued',
        priority:
          'high',
        queueName:
          'content',
        payload: {
          data: {
            projectId:
              'project-one',
          },
          contentType:
            'application/json',
          schemaVersion:
            '1.0.0',
        },
        configuration: {
          timeout: {
            timeoutMs:
              60_000,
            terminateOnTimeout:
              true,
          },
          concurrency: {
            concurrencyKey:
              'project-one',
            maximumConcurrentRuns:
              1,
            singleton:
              true,
            replaceExisting:
              false,
          },
          retention: {
            retainCompletedForMs:
              86_400_000,
            retainFailedForMs:
              604_800_000,
            removeOnComplete:
              false,
            removeOnFailure:
              false,
          },
          maximumAttempts: 3,
          enabled: true,
        },
        correlation: {
          correlationId:
            'correlation-one',
          traceId:
            'trace-one',
        },
        ownership: {
          createdBy:
            'user-one',
          ownerType:
            'user',
          workspaceId:
            'workspace-one',
        },
        dependencies: [
          {
            jobId:
              'dependency-one',
            requiredState:
              'completed',
            optional:
              false,
          },
        ],
        executionCount: 0,
        progress: {
          percentage: 0,
          updatedAt: now,
        },
        tags: {
          tags: [
            'content',
          ],
          labels: {
            environment:
              'test',
          },
        },
        createdAt: now,
        updatedAt: now,
      };
    }

    function createExecution():
      JobExecution {
      return {
        id:
          'execution-one',
        jobId:
          'job-one',
        state:
          'running',
        attemptNumber: 1,
        queueName:
          'content',
        priority:
          'high',
        payload: {
          data: {
            projectId:
              'project-one',
          },
          contentType:
            'application/json',
        },
        progress: {
          percentage: 25,
          currentStep:
            'planning',
          updatedAt: now,
        },
        timing: {
          queuedAt: now,
          startedAt: now,
        },
        lease: {
          workerId:
            'worker-one',
          acquiredAt: now,
          expiresAt:
            '2026-08-04T10:05:00.000Z',
        },
        correlation: {
          correlationId:
            'correlation-one',
        },
        history: [
          {
            attemptNumber: 1,
            executionId:
              'execution-one',
            state:
              'running',
            startedAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };
    }

    it(
      'creates independent job snapshots',
      () => {
        const source =
          createJob();

        const model =
          new JobModel(source);

        const snapshot =
          model.toContract();

        expect(snapshot).toEqual(
          source,
        );

        expect(snapshot).not.toBe(
          source,
        );

        expect(snapshot.payload)
          .not.toBe(
            source.payload,
          );

        expect(
          snapshot.payload.data,
        ).not.toBe(
          source.payload.data,
        );

        expect(
          snapshot.configuration,
        ).not.toBe(
          source.configuration,
        );

        expect(
          snapshot.dependencies,
        ).not.toBe(
          source.dependencies,
        );

        expect(snapshot.tags)
          .not.toBe(
            source.tags,
          );
      },
    );

    it(
      'creates independent execution snapshots',
      () => {
        const source =
          createExecution();

        const model =
          new JobExecutionModel(
            source,
          );

        const snapshot =
          model.toContract();

        expect(snapshot).toEqual(
          source,
        );

        expect(snapshot).not.toBe(
          source,
        );

        expect(snapshot.payload)
          .not.toBe(
            source.payload,
          );

        expect(snapshot.progress)
          .not.toBe(
            source.progress,
          );

        expect(snapshot.timing)
          .not.toBe(
            source.timing,
          );

        expect(snapshot.lease)
          .not.toBe(
            source.lease,
          );

        expect(snapshot.history)
          .not.toBe(
            source.history,
          );
      },
    );

    it(
      'preserves failures and results safely',
      () => {
        const execution =
          createExecution();

        const completed:
          JobExecution = {
            ...execution,
            state:
              'completed',
            outcome:
              'success',
            result: {
              data: {
                assetId:
                  'asset-one',
              },
              summary:
                'Generated.',
              producedResourceIds: [
                'asset-one',
              ],
            },
            timing: {
              ...execution.timing,
              finishedAt:
                '2026-08-04T10:01:00.000Z',
              durationMs:
                60_000,
            },
          };

        const result =
          new JobExecutionModel(
            completed,
          ).toContract();

        expect(
          result.result
            ?.producedResourceIds,
        ).toEqual([
          'asset-one',
        ]);

        expect(
          result.result
            ?.producedResourceIds,
        ).not.toBe(
          completed.result
            ?.producedResourceIds,
        );
      },
    );
  },
);