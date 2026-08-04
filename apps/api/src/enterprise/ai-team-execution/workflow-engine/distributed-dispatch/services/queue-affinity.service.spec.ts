import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import type {
  LoadBalancerDecision,
  LoadBalancerService,
} from './load-balancer.service';
import {
  QueueAffinityService,
} from './queue-affinity.service';

describe(
  'QueueAffinityService',
  () => {
    const handler =
      jest.fn();

    function worker(
      workerName: string,
    ): QueueWorkerRegistration {
      return {
        workerName,
        queueName:
          'workflow-step',
        concurrency: 4,
        handler,
      };
    }

    function decision(
      workerName:
        string | null,
      now =
        new Date(
          '2026-08-04T10:00:00.000Z',
        ),
    ): LoadBalancerDecision {
      const selected =
        workerName
          ? worker(workerName)
          : null;

      return {
        selected,
        selectedCandidate: null,
        strategy:
          'least_loaded',
        reason:
          selected
            ? `Selected ${workerName}.`
            : 'No worker.',
        eligibleWorkers:
          selected ? 1 : 0,
        evaluatedWorkers:
          selected ? 1 : 0,
        sequence: 1,
        balancedAt: now,
      };
    }

    function setup(
      decisions:
        readonly LoadBalancerDecision[],
    ): {
      service:
        QueueAffinityService;
      balance:
        jest.Mock;
    } {
      const balance =
        jest.fn();

      for (
        const result
        of decisions
      ) {
        balance.mockReturnValueOnce(
          result,
        );
      }

      const loadBalancer = {
        balance,
      } as unknown as
        LoadBalancerService;

      return {
        service:
          new QueueAffinityService(
            loadBalancer,
          ),
        balance,
      };
    }

    it(
      'binds and resolves queue affinity',
      () => {
        const {
          service,
        } = setup([]);

        const created =
          service.bind({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
            workerName:
              'worker-a',
            now:
              new Date(
                '2026-08-04T10:00:00.000Z',
              ),
          });

        const resolved =
          service.resolve(
            'workflow-step',
            'project-one',
            new Date(
              '2026-08-04T10:01:00.000Z',
            ),
          );

        expect(
          created.workerName,
        ).toBe('worker-a');

        expect(
          resolved?.workerName,
        ).toBe('worker-a');
      },
    );

    it(
      'rejects conflicting affinity without overwrite',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        expect(() =>
          service.bind({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
            workerName:
              'worker-b',
          }),
        ).toThrow(
          'already bound',
        );
      },
    );

    it(
      'overwrites affinity when explicitly allowed',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        const updated =
          service.bind({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
            workerName:
              'worker-b',
            overwrite: true,
          });

        expect(
          updated.workerName,
        ).toBe('worker-b');
      },
    );

    it(
      'creates affinity after the first routing decision',
      () => {
        const {
          service,
          balance,
        } = setup([
          decision('worker-a'),
        ]);

        const result =
          service.route({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
            now:
              new Date(
                '2026-08-04T10:00:00.000Z',
              ),
          });

        expect(
          result.affinityHit,
        ).toBe(false);

        expect(
          result.affinityCreated,
        ).toBe(true);

        expect(
          result.binding
            ?.workerName,
        ).toBe('worker-a');

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              queueName:
                'workflow-step',
              preserveStickyWorker:
                false,
            }),
          );
      },
    );

    it(
      'routes through an existing affinity binding',
      () => {
        const {
          service,
          balance,
        } = setup([
          decision('worker-a'),
        ]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        const result =
          service.route({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
          });

        expect(
          result.affinityHit,
        ).toBe(true);

        expect(balance)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              stickyWorkerName:
                'worker-a',
              preserveStickyWorker:
                true,
            }),
          );
      },
    );

    it(
      'rebinds affinity after fallback when enabled',
      () => {
        const {
          service,
        } = setup([
          decision('worker-b'),
        ]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        const result =
          service.route({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
            rebindOnFallback:
              true,
          });

        expect(
          result.affinityRebound,
        ).toBe(true);

        expect(
          result.binding
            ?.workerName,
        ).toBe('worker-b');
      },
    );

    it(
      'does not rebind fallback affinity by default',
      () => {
        const {
          service,
        } = setup([
          decision('worker-b'),
        ]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        const result =
          service.route({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
          });

        expect(
          result.affinityRebound,
        ).toBe(false);

        expect(
          result.binding
            ?.workerName,
        ).toBe('worker-a');
      },
    );

    it(
      'expires bindings after their ttl',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
          ttlMs: 60_000,
          now:
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
        });

        expect(
          service.resolve(
            'workflow-step',
            'project-one',
            new Date(
              '2026-08-04T10:01:01.000Z',
            ),
          ),
        ).toBeNull();
      },
    );

    it(
      'unbinds a single affinity',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        expect(
          service.unbind(
            'workflow-step',
            'project-one',
          ),
        ).toBe(true);

        expect(
          service.resolve(
            'workflow-step',
            'project-one',
          ),
        ).toBeNull();
      },
    );

    it(
      'unbinds every affinity assigned to a worker',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
        });

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-two',
          workerName:
            'worker-a',
        });

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-three',
          workerName:
            'worker-b',
        });

        expect(
          service.unbindWorker(
            'worker-a',
          ),
        ).toBe(2);

        expect(
          service.list(),
        ).toHaveLength(1);
      },
    );

    it(
      'returns deterministic binding order',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'z-project',
          workerName:
            'worker-z',
        });

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'a-project',
          workerName:
            'worker-a',
        });

        expect(
          service.list().map(
            (binding) =>
              binding.affinityKey,
          ),
        ).toEqual([
          'a-project',
          'z-project',
        ]);
      },
    );

    it(
      'records affinity metrics',
      () => {
        const {
          service,
        } = setup([
          decision('worker-a'),
          decision('worker-a'),
        ]);

        service.route({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
        });

        service.route({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
        });

        const metrics =
          service.getMetrics();

        expect(
          metrics.affinityMisses,
        ).toBe(1);

        expect(
          metrics.affinityHits,
        ).toBe(1);

        expect(
          metrics.affinityCreates,
        ).toBe(1);

        expect(
          metrics.activeBindings,
        ).toBe(1);
      },
    );

    it(
      'validates required fields and ttl',
      () => {
        const {
          service,
        } = setup([]);

        expect(() =>
          service.bind({
            queueName: ' ',
            affinityKey:
              'project-one',
            workerName:
              'worker-a',
          }),
        ).toThrow(
          'queueName is required',
        );

        expect(() =>
          service.bind({
            queueName:
              'workflow-step',
            affinityKey:
              'project-one',
            workerName:
              'worker-a',
            ttlMs: 0,
          }),
        ).toThrow(
          'positive integer',
        );
      },
    );

    it(
      'returns independent affinity snapshots',
      () => {
        const {
          service,
        } = setup([]);

        service.bind({
          queueName:
            'workflow-step',
          affinityKey:
            'project-one',
          workerName:
            'worker-a',
          metadata: {
            source: 'test',
          },
        });

        const first =
          service.resolve(
            'workflow-step',
            'project-one',
          );

        const second =
          service.resolve(
            'workflow-step',
            'project-one',
          );

        expect(first)
          .toEqual(second);

        expect(first)
          .not.toBe(second);

        expect(first?.metadata)
          .not.toBe(
            second?.metadata,
          );
      },
    );
  },
);