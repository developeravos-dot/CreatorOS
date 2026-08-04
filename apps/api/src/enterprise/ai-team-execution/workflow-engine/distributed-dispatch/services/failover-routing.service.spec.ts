import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import type {
  LoadBalancerDecision,
  LoadBalancerService,
  LoadBalancingStrategy,
} from './load-balancer.service';
import {
  FailoverRoutingService,
} from './failover-routing.service';

describe(
  'FailoverRoutingService',
  () => {
    const handler =
      jest.fn();

    function worker(
      workerName: string,
    ): QueueWorkerRegistration {
      return {
        queueName:
          'workflow-step',
        workerName,
        concurrency: 4,
        handler,
      };
    }

    function decision(
      workerName:
        string | null,
      strategy:
        LoadBalancingStrategy =
          'least_loaded',
    ): LoadBalancerDecision {
      return {
        selected:
          workerName
            ? worker(workerName)
            : null,
        selectedCandidate: null,
        strategy,
        reason:
          workerName
            ? `Selected ${workerName}.`
            : 'No worker available.',
        eligibleWorkers:
          workerName ? 1 : 0,
        evaluatedWorkers:
          workerName ? 1 : 0,
        sequence: 1,
        balancedAt:
          new Date(
            '2026-08-04T10:00:00.000Z',
          ),
      };
    }

    function setup(
      decisions:
        readonly LoadBalancerDecision[],
    ): {
      readonly service:
        FailoverRoutingService;
      readonly balance:
        jest.Mock;
    } {
      const balance =
        jest.fn();

      for (
        const item
        of decisions
      ) {
        balance.mockReturnValueOnce(
          item,
        );
      }

      const loadBalancer = {
        balance,
      } as unknown as
        LoadBalancerService;

      return {
        service:
          new FailoverRoutingService(
            loadBalancer,
          ),
        balance,
      };
    }

    it(
      'selects the primary worker',
      () => {
        const {
          service,
          balance,
        } = setup([
          decision(
            'worker-primary',
            'health_aware',
          ),
        ]);

        const result =
          service.route({
            queueName:
              'workflow-step',
            primaryWorkerName:
              'worker-primary',
            maximumAttempts: 3,
          });

        expect(
          result.selectedWorkerName,
        ).toBe(
          'worker-primary',
        );

        expect(
          result.reasonCode,
        ).toBe(
          'primary_selected',
        );

        expect(
          result.primarySelected,
        ).toBe(true);

        expect(
          result.failoverUsed,
        ).toBe(false);

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              preferredWorkerName:
                'worker-primary',
              stickyWorkerName:
                'worker-primary',
              preserveStickyWorker:
                true,
            }),
          );
      },
    );

    it(
      'selects a failover worker when primary is unavailable',
      () => {
        const {
          service,
        } = setup([
          decision(
            'worker-secondary',
            'health_aware',
          ),
        ]);

        const result =
          service.route({
            queueName:
              'workflow-step',
            primaryWorkerName:
              'worker-primary',
          });

        expect(
          result.selectedWorkerName,
        ).toBe(
          'worker-secondary',
        );

        expect(
          result.reasonCode,
        ).toBe(
          'failover_selected',
        );

        expect(
          result.primarySelected,
        ).toBe(false);

        expect(
          result.failoverUsed,
        ).toBe(true);
      },
    );

    it(
      'tries multiple strategies until a worker is selected',
      () => {
        const {
          service,
          balance,
        } = setup([
          decision(
            null,
            'health_aware',
          ),
          decision(
            'worker-secondary',
            'least_loaded',
          ),
        ]);

        const result =
          service.route({
            queueName:
              'workflow-step',
            maximumAttempts: 3,
            failoverStrategies: [
              'health_aware',
              'least_loaded',
              'round_robin',
            ],
          });

        expect(
          result.selectedWorkerName,
        ).toBe(
          'worker-secondary',
        );

        expect(
          result.attempts,
        ).toHaveLength(2);

        expect(balance)
          .toHaveBeenCalledTimes(2);

        expect(
          result.attempts.map(
            (attempt) =>
              attempt.strategy,
          ),
        ).toEqual([
          'health_aware',
          'least_loaded',
        ]);
      },
    );

    it(
      'excludes failed workers',
      () => {
        const {
          service,
          balance,
        } = setup([
          decision('worker-b'),
        ]);

        service.route({
          queueName:
            'workflow-step',
          failedWorkerNames: [
            'worker-a',
          ],
          excludedWorkerNames: [
            'worker-c',
          ],
        });

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              excludedWorkerNames:
                expect.arrayContaining([
                  'worker-a',
                  'worker-c',
                ]),
            }),
          );
      },
    );

    it(
      'routes after a worker failure',
      () => {
        const {
          service,
          balance,
        } = setup([
          decision('worker-b'),
        ]);

        const result =
          service.routeAfterFailure(
            {
              queueName:
                'workflow-step',
            },
            'worker-a',
          );

        expect(
          result.selectedWorkerName,
        ).toBe('worker-b');

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              excludedWorkerNames:
                expect.arrayContaining([
                  'worker-a',
                ]),
            }),
          );
      },
    );

    it(
      'returns attempts exhausted when no worker is selected',
      () => {
        const {
          service,
        } = setup([
          decision(null),
          decision(null),
        ]);

        const result =
          service.route({
            queueName:
              'workflow-step',
            maximumAttempts: 2,
          });

        expect(
          result.selected,
        ).toBeNull();

        expect(
          result.reasonCode,
        ).toBe(
          'attempts_exhausted',
        );

        expect(
          result.attempts,
        ).toHaveLength(2);
      },
    );

    it(
      'records routing metrics',
      () => {
        const {
          service,
        } = setup([
          decision(
            'worker-primary',
          ),
          decision(
            'worker-secondary',
          ),
          decision(null),
        ]);

        service.route({
          queueName:
            'workflow-step',
          primaryWorkerName:
            'worker-primary',
          maximumAttempts: 1,
        });

        service.route({
          queueName:
            'workflow-step',
          primaryWorkerName:
            'missing-primary',
          maximumAttempts: 1,
        });

        service.route({
          queueName:
            'workflow-step',
          maximumAttempts: 1,
        });

        const metrics =
          service.getMetrics(
            new Date(
              '2026-08-04T12:00:00.000Z',
            ),
          );

        expect(
          metrics.totalRoutes,
        ).toBe(3);

        expect(
          metrics.primarySelections,
        ).toBe(1);

        expect(
          metrics.failoverSelections,
        ).toBe(1);

        expect(
          metrics.failedRoutes,
        ).toBe(1);

        expect(
          metrics.selectionsByWorker[
            'worker-primary'
          ] ?? 0,
        ).toBe(1);

        expect(
          metrics.selectionsByWorker[
            'worker-secondary'
          ] ?? 0,
        ).toBe(1);
      },
    );

    it(
      'resets routing metrics',
      () => {
        const {
          service,
        } = setup([
          decision('worker-a'),
        ]);

        service.route({
          queueName:
            'workflow-step',
          maximumAttempts: 1,
        });

        service.reset();

        const metrics =
          service.getMetrics();

        expect(
          metrics.totalRoutes,
        ).toBe(0);

        expect(
          metrics.totalAttempts,
        ).toBe(0);

        expect(
          metrics.averageAttemptsPerRoute,
        ).toBe(0);
      },
    );

    it(
      'validates maximum attempts',
      () => {
        const {
          service,
        } = setup([]);

        expect(() =>
          service.route({
            queueName:
              'workflow-step',
            maximumAttempts: 0,
          }),
        ).toThrow(
          'between 1 and 100',
        );
      },
    );

    it(
      'validates failover strategies',
      () => {
        const {
          service,
        } = setup([]);

        expect(() =>
          service.route({
            queueName:
              'workflow-step',
            failoverStrategies: [],
          }),
        ).toThrow(
          'At least one failover strategy',
        );
      },
    );

    it(
      'returns independent attempt snapshots',
      () => {
        const {
          service,
        } = setup([
          decision('worker-a'),
        ]);

        const result =
          service.route({
            queueName:
              'workflow-step',
            maximumAttempts: 1,
          });

        expect(
          result.attempts[0],
        ).not.toBeUndefined();

        expect(
          result.attempts[0]
            ?.decision,
        ).not.toBe(
          result.attempts[0],
        );
      },
    );
  },
);