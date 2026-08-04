import type {
  QueueWorkerRegistration,
  QueueWorkerRegistryService,
} from '../../../../../modules/queue-infrastructure';
import {
  LoadBalancerService,
} from './load-balancer.service';
import {
  WorkerSelectionService,
} from './worker-selection.service';

describe(
  'LoadBalancerService',
  () => {
    const handler =
      jest.fn();

    function worker(
      workerName: string,
      concurrency = 4,
    ): QueueWorkerRegistration {
      return {
        workerName,
        queueName:
          'workflow-step',
        concurrency,
        handler,
      };
    }

    function setup(
      registrations:
        QueueWorkerRegistration[],
    ): LoadBalancerService {
      const registry = {
        list:
          jest.fn(
            () =>
              registrations.map(
                (registration) => ({
                  ...registration,
                }),
              ),
          ),
      } as unknown as
        QueueWorkerRegistryService;

      return new LoadBalancerService(
        new WorkerSelectionService(
          registry,
        ),
      );
    }

    it(
      'uses least-loaded balancing by default',
      () => {
        const service =
          setup([
            worker('worker-a'),
            worker('worker-b'),
          ]);

        const result =
          service.balance({
            queueName:
              'workflow-step',
            runtimeSnapshots: [
              {
                workerName:
                  'worker-a',
                status:
                  'healthy',
                activeJobs: 3,
                completedJobs: 1,
                failedJobs: 0,
              },
              {
                workerName:
                  'worker-b',
                status:
                  'healthy',
                activeJobs: 1,
                completedJobs: 1,
                failedJobs: 0,
              },
            ],
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe('worker-b');

        expect(result.strategy)
          .toBe('least_loaded');
      },
    );

    it(
      'rotates round-robin selections deterministically',
      () => {
        const service =
          setup([
            worker('worker-c'),
            worker('worker-a'),
            worker('worker-b'),
          ]);

        const names = [
          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'round_robin',
          }).selected?.workerName,

          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'round_robin',
          }).selected?.workerName,

          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'round_robin',
          }).selected?.workerName,

          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'round_robin',
          }).selected?.workerName,
        ];

        expect(names).toEqual([
          'worker-a',
          'worker-b',
          'worker-c',
          'worker-a',
        ]);
      },
    );

    it(
      'uses weighted balancing',
      () => {
        const service =
          setup([
            worker('worker-a'),
            worker('worker-b'),
          ]);

        const first =
          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'weighted',
            weights: [
              {
                workerName:
                  'worker-a',
                weight: 1,
              },
              {
                workerName:
                  'worker-b',
                weight: 3,
              },
            ],
          });

        const second =
          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'weighted',
            weights: [
              {
                workerName:
                  'worker-a',
                weight: 1,
              },
              {
                workerName:
                  'worker-b',
                weight: 3,
              },
            ],
          });

        expect(
          first.selected
            ?.workerName,
        ).toBe('worker-b');

        expect(
          second.selected
            ?.workerName,
        ).toBe('worker-a');
      },
    );

    it(
      'selects the highest absolute capacity',
      () => {
        const service =
          setup([
            worker('small-worker', 2),
            worker('large-worker', 8),
          ]);

        const result =
          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'capacity_aware',
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe(
          'large-worker',
        );
      },
    );

    it(
      'uses health and reliability scores',
      () => {
        const service =
          setup([
            worker('healthy-worker'),
            worker('degraded-worker'),
          ]);

        const result =
          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'health_aware',
            allowDegraded: true,
            runtimeSnapshots: [
              {
                workerName:
                  'healthy-worker',
                status:
                  'healthy',
                activeJobs: 1,
                completedJobs: 10,
                failedJobs: 0,
              },
              {
                workerName:
                  'degraded-worker',
                status:
                  'degraded',
                activeJobs: 0,
                completedJobs: 1,
                failedJobs: 4,
              },
            ],
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe(
          'healthy-worker',
        );
      },
    );

    it(
      'preserves an eligible sticky worker',
      () => {
        const service =
          setup([
            worker('worker-a'),
            worker('worker-b'),
          ]);

        const result =
          service.balance({
            queueName:
              'workflow-step',
            stickyWorkerName:
              'worker-b',
            preserveStickyWorker:
              true,
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe('worker-b');
      },
    );

    it(
      'falls back when the sticky worker is unavailable',
      () => {
        const service =
          setup([
            worker('worker-a'),
          ]);

        const result =
          service.balance({
            queueName:
              'workflow-step',
            stickyWorkerName:
              'missing-worker',
            preserveStickyWorker:
              true,
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe('worker-a');
      },
    );

    it(
      'returns an empty decision when no worker is eligible',
      () => {
        const service =
          setup([]);

        const result =
          service.balance({
            queueName:
              'workflow-step',
          });

        expect(result.selected)
          .toBeNull();

        expect(result.reason)
          .toBe(
            'No eligible worker was available.',
          );
      },
    );

    it(
      'records load-balancer metrics',
      () => {
        const service =
          setup([
            worker('worker-a'),
          ]);

        service.balance({
          queueName:
            'workflow-step',
          strategy:
            'least_loaded',
        });

        service.balance({
          queueName:
            'missing-queue',
          strategy:
            'round_robin',
        });

        const metrics =
          service.getMetrics(
            new Date(
              '2026-08-04T12:00:00.000Z',
            ),
          );

        expect(
          metrics.totalSelections,
        ).toBe(2);

        expect(
          metrics.successfulSelections,
        ).toBe(1);

        expect(
          metrics.failedSelections,
        ).toBe(1);

        expect(
          metrics.selectionsByWorker['worker-a'] ?? 0,
        ).toBe(1);

        expect(
          metrics.selectionsByStrategy
            .least_loaded,
        ).toBe(1);

        expect(
          metrics.selectionsByStrategy
            .round_robin,
        ).toBe(1);
      },
    );

    it(
      'resets state and metrics',
      () => {
        const service =
          setup([
            worker('worker-a'),
          ]);

        service.balance({
          queueName:
            'workflow-step',
        });

        service.reset();

        const metrics =
          service.getMetrics();

        expect(
          metrics.totalSelections,
        ).toBe(0);

        expect(
          metrics.lastSelectedWorkerName,
        ).toBeNull();
      },
    );

    it(
      'rejects invalid worker weights',
      () => {
        const service =
          setup([
            worker('worker-a'),
          ]);

        expect(() =>
          service.balance({
            queueName:
              'workflow-step',
            strategy:
              'weighted',
            weights: [
              {
                workerName:
                  'worker-a',
                weight: 0,
              },
            ],
          }),
        ).toThrow(
          'positive number',
        );
      },
    );

    it(
      'returns independent candidate snapshots',
      () => {
        const service =
          setup([
            worker('worker-a'),
          ]);

        const first =
          service.balance({
            queueName:
              'workflow-step',
        });

        const second =
          service.balance({
            queueName:
              'workflow-step',
        });

        expect(
          first.selectedCandidate,
        ).not.toBe(
          second.selectedCandidate,
        );

        expect(
          first.selectedCandidate
            ?.score,
        ).not.toBe(
          second.selectedCandidate
            ?.score,
        );
      },
    );
  },
);