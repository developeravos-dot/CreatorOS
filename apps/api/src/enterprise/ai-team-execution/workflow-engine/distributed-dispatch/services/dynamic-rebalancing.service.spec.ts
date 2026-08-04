import {
  DynamicRebalancingService,
} from './dynamic-rebalancing.service';

describe(
  'DynamicRebalancingService',
  () => {
    let service:
      DynamicRebalancingService;

    beforeEach(() => {
      service =
        new DynamicRebalancingService();
    });

    it(
      'moves work from an overloaded worker to an underloaded worker',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 9,
                healthScore: 1,
                draining: false,
              },
              {
                workerName:
                  'worker-b',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 1,
                healthScore: 1,
                draining: false,
              },
            ],
          });

        expect(result.balanced)
          .toBe(false);

        expect(
          result.totalJobsToMove,
        ).toBe(4);

        expect(
          result.actions[0],
        ).toEqual(
          expect.objectContaining({
            type: 'move',
            sourceWorkerName:
              'worker-a',
            targetWorkerName:
              'worker-b',
            jobsToMove: 4,
          }),
        );
      },
    );

    it(
      'respects the maximum moves per cycle',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            policy: {
              maximumMovesPerCycle: 3,
            },
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 10,
                healthScore: 1,
                draining: false,
              },
              {
                workerName:
                  'worker-b',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 0,
                healthScore: 1,
                draining: false,
              },
            ],
          });

        expect(
          result.totalJobsToMove,
        ).toBe(3);
      },
    );

    it(
      'does not target unhealthy workers',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 9,
                healthScore: 1,
                draining: false,
              },
              {
                workerName:
                  'worker-b',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 0,
                healthScore: 0.2,
                draining: false,
              },
            ],
          });

        expect(result.balanced)
          .toBe(true);

        expect(
          result.totalJobsToMove,
        ).toBe(0);
      },
    );

    it(
      'does not use draining workers as sources or targets',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 9,
                healthScore: 1,
                draining: true,
              },
              {
                workerName:
                  'worker-b',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 0,
                healthScore: 1,
                draining: false,
              },
            ],
          });

        expect(result.balanced)
          .toBe(true);
      },
    );

    it(
      'preserves the configured minimum number of jobs',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            policy: {
              preserveMinimumJobs: 7,
            },
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 9,
                healthScore: 1,
                draining: false,
              },
              {
                workerName:
                  'worker-b',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 0,
                healthScore: 1,
                draining: false,
              },
            ],
          });

        expect(
          result.totalJobsToMove,
        ).toBe(2);
      },
    );

    it(
      'returns a no-op action when already balanced',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 5,
                healthScore: 1,
                draining: false,
              },
              {
                workerName:
                  'worker-b',
                queueName:
                  'workflow-step',
                concurrency: 10,
                activeJobs: 5,
                healthScore: 1,
                draining: false,
              },
            ],
          });

        expect(result.balanced)
          .toBe(true);

        expect(
          result.actions,
        ).toEqual([
          expect.objectContaining({
            type: 'none',
            jobsToMove: 0,
          }),
        ]);
      },
    );

    it(
      'filters workers by queue',
      () => {
        const result =
          service.plan({
            queueName:
              'workflow-step',
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'other-queue',
                concurrency: 10,
                activeJobs: 10,
                healthScore: 1,
                draining: false,
              },
            ],
          });

        expect(
          result.overloadedWorkers,
        ).toEqual([]);
      },
    );

    it(
      'records rebalancing metrics',
      () => {
        service.plan({
          queueName:
            'workflow-step',
          workers: [],
        });

        service.plan({
          queueName:
            'workflow-step',
          workers: [
            {
              workerName:
                'worker-a',
              queueName:
                'workflow-step',
              concurrency: 10,
              activeJobs: 9,
              healthScore: 1,
              draining: false,
            },
            {
              workerName:
                'worker-b',
              queueName:
                'workflow-step',
              concurrency: 10,
              activeJobs: 0,
              healthScore: 1,
              draining: false,
            },
          ],
        });

        const metrics =
          service.getMetrics();

        expect(
          metrics.totalPlans,
        ).toBe(2);

        expect(
          metrics.balancedPlans,
        ).toBe(1);

        expect(
          metrics.rebalancingPlans,
        ).toBe(1);

        expect(
          metrics.totalActions,
        ).toBe(1);

        expect(
          metrics.totalJobsPlannedForMovement,
        ).toBe(4);
      },
    );

    it(
      'validates policy thresholds',
      () => {
        expect(() =>
          service.plan({
            queueName:
              'workflow-step',
            workers: [],
            policy: {
              overloadThreshold: 0.5,
              underloadThreshold: 0.6,
            },
          }),
        ).toThrow(
          'underloadThreshold',
        );

        expect(() =>
          service.plan({
            queueName:
              'workflow-step',
            workers: [],
            policy: {
              maximumMovesPerCycle: 0,
            },
          }),
        ).toThrow(
          'positive integer',
        );
      },
    );

    it(
      'validates worker snapshots',
      () => {
        expect(() =>
          service.plan({
            queueName:
              'workflow-step',
            workers: [
              {
                workerName:
                  'worker-a',
                queueName:
                  'workflow-step',
                concurrency: 0,
                activeJobs: 0,
                healthScore: 1,
                draining: false,
              },
            ],
          }),
        ).toThrow(
          'concurrency',
        );
      },
    );

    it(
      'resets metrics',
      () => {
        service.plan({
          queueName:
            'workflow-step',
          workers: [],
        });

        service.reset();

        expect(
          service
            .getMetrics()
            .totalPlans,
        ).toBe(0);
      },
    );
  },
);
