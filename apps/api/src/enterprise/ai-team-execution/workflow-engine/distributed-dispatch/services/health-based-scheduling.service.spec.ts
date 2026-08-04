import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import type {
  LoadBalancerDecision,
  LoadBalancerService,
} from './load-balancer.service';
import type {
  WorkerDrainingService,
} from './worker-draining.service';
import {
  HealthBasedSchedulingService,
  type HealthSchedulingPolicy,
} from './health-based-scheduling.service';

describe(
  'HealthBasedSchedulingService',
  () => {
    const handler =
      jest.fn();

    const policy:
      HealthSchedulingPolicy = {
      healthyThreshold: 0.75,
      degradedThreshold: 0.4,
      maximumHeartbeatAgeMs:
        60_000,
      minimumAvailableSlots: 1,
      allowDegraded: false,
      excludeDrainingWorkers: true,
    };

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
    ): LoadBalancerDecision {
      return {
        selected:
          workerName
            ? worker(workerName)
            : null,
        selectedCandidate: null,
        strategy:
          'health_aware',
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
      selectedWorker:
        string | null,
      drainingWorkers:
        readonly string[] = [],
    ): {
      readonly service:
        HealthBasedSchedulingService;
      readonly balance:
        jest.Mock;
    } {
      const balance =
        jest.fn(
          () =>
            decision(
              selectedWorker,
            ),
        );

      const loadBalancer = {
        balance,
      } as unknown as
        LoadBalancerService;

      const draining = {
        isDraining:
          jest.fn(
            (workerName: string) =>
              drainingWorkers.includes(
                workerName,
              ),
          ),
      } as unknown as
        WorkerDrainingService;

      return {
        service:
          new HealthBasedSchedulingService(
            loadBalancer,
            draining,
          ),
        balance,
      };
    }

    it(
      'evaluates a healthy worker',
      () => {
        const {
          service,
        } = setup(null);

        const result =
          service.evaluate(
            {
              workerName:
                'worker-a',
              status:
                'healthy',
              activeJobs: 1,
              completedJobs: 20,
              failedJobs: 0,
              capabilities: [
                'concurrency:4',
              ],
              lastHeartbeatAt:
                new Date(
                  '2026-08-04T09:59:55.000Z',
                ),
            },
            policy,
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
          );

        expect(result.level)
          .toBe('healthy');

        expect(result.eligible)
          .toBe(true);

        expect(result.reasons)
          .toEqual([]);
      },
    );

    it(
      'rejects an expired heartbeat',
      () => {
        const {
          service,
        } = setup(null);

        const result =
          service.evaluate(
            {
              workerName:
                'worker-a',
              status:
                'healthy',
              activeJobs: 0,
              completedJobs: 10,
              failedJobs: 0,
              capabilities: [
                'concurrency:4',
              ],
              lastHeartbeatAt:
                new Date(
                  '2026-08-04T09:58:00.000Z',
                ),
            },
            policy,
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
          );

        expect(result.eligible)
          .toBe(false);

        expect(result.reasons)
          .toContain(
            'heartbeat_expired',
          );
      },
    );

    it(
      'rejects a draining worker',
      () => {
        const {
          service,
        } = setup(
          null,
          ['worker-a'],
        );

        const result =
          service.evaluate(
            {
              workerName:
                'worker-a',
              status:
                'healthy',
              activeJobs: 0,
              completedJobs: 10,
              failedJobs: 0,
              capabilities: [
                'concurrency:4',
              ],
              lastHeartbeatAt:
                new Date(
                  '2026-08-04T10:00:00.000Z',
                ),
            },
            policy,
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
          );

        expect(result.draining)
          .toBe(true);

        expect(result.eligible)
          .toBe(false);

        expect(result.reasons)
          .toContain(
            'worker_draining',
          );
      },
    );

    it(
      'schedules through health-aware balancing',
      () => {
        const {
          service,
          balance,
        } = setup(
          'worker-a',
        );

        const result =
          service.schedule({
            queueName:
              'workflow-step',
            now:
              new Date(
                '2026-08-04T10:00:00.000Z',
              ),
            runtimeSnapshots: [
              {
                workerName:
                  'worker-a',
                status:
                  'healthy',
                activeJobs: 0,
                completedJobs: 10,
                failedJobs: 0,
                capabilities: [
                  'concurrency:4',
                ],
                lastHeartbeatAt:
                  new Date(
                    '2026-08-04T10:00:00.000Z',
                  ),
              },
            ],
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe('worker-a');

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              queueName:
                'workflow-step',
              strategy:
                'health_aware',
              allowDegraded:
                false,
            }),
          );
      },
    );

    it(
      'excludes unhealthy workers from balancing',
      () => {
        const {
          service,
          balance,
        } = setup(null);

        service.schedule({
          queueName:
            'workflow-step',
          now:
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
          runtimeSnapshots: [
            {
              workerName:
                'worker-a',
              status:
                'unhealthy',
              activeJobs: 4,
              completedJobs: 0,
              failedJobs: 10,
              capabilities: [
                'concurrency:4',
              ],
              lastHeartbeatAt:
                new Date(
                  '2026-08-04T09:00:00.000Z',
                ),
            },
          ],
        });

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              excludedWorkerNames: [
                'worker-a',
              ],
            }),
          );
      },
    );

    it(
      'records scheduling metrics',
      () => {
        const {
          service,
        } = setup(
          'worker-a',
        );

        service.schedule({
          queueName:
            'workflow-step',
          runtimeSnapshots: [
            {
              workerName:
                'worker-a',
              status:
                'healthy',
              activeJobs: 0,
              completedJobs: 10,
              failedJobs: 0,
              capabilities: [
                'concurrency:4',
              ],
              lastHeartbeatAt:
                new Date(),
            },
          ],
        });

        const metrics =
          service.getMetrics();

        expect(
          metrics.totalSchedules,
        ).toBe(1);

        expect(
          metrics.successfulSchedules,
        ).toBe(1);

        expect(
          metrics.workerSelections[
            'worker-a'
          ] ?? 0,
        ).toBe(1);
      },
    );

    it(
      'records failed scheduling attempts',
      () => {
        const {
          service,
        } = setup(null);

        service.schedule({
          queueName:
            'workflow-step',
          runtimeSnapshots: [],
        });

        const metrics =
          service.getMetrics();

        expect(
          metrics.failedSchedules,
        ).toBe(1);
      },
    );

    it(
      'validates health policy thresholds',
      () => {
        const {
          service,
        } = setup(null);

        expect(() =>
          service.schedule({
            queueName:
              'workflow-step',
            runtimeSnapshots: [],
            policy: {
              healthyThreshold:
                1.5,
            },
          }),
        ).toThrow(
          'healthyThreshold',
        );

        expect(() =>
          service.schedule({
            queueName:
              'workflow-step',
            runtimeSnapshots: [],
            policy: {
              healthyThreshold:
                0.5,
              degradedThreshold:
                0.8,
            },
          }),
        ).toThrow(
          'cannot exceed',
        );
      },
    );

    it(
      'resets metrics',
      () => {
        const {
          service,
        } = setup(null);

        service.schedule({
          queueName:
            'workflow-step',
          runtimeSnapshots: [],
        });

        service.reset();

        expect(
          service
            .getMetrics()
            .totalSchedules,
        ).toBe(0);
      },
    );
  },
);