import type {
  QueueAffinityService,
} from './queue-affinity.service';
import {
  WorkerDrainingService,
} from './worker-draining.service';

describe(
  'WorkerDrainingService',
  () => {
    function setup(
      removedBindings = 0,
    ): {
      readonly service:
        WorkerDrainingService;
      readonly unbindWorker:
        jest.Mock;
    } {
      const unbindWorker =
        jest.fn(
          () =>
            removedBindings,
        );

      const affinity = {
        unbindWorker,
      } as unknown as
        QueueAffinityService;

      return {
        service:
          new WorkerDrainingService(
            affinity,
          ),
        unbindWorker,
      };
    }

    it(
      'starts worker draining and removes affinity bindings',
      () => {
        const {
          service,
          unbindWorker,
        } = setup(3);

        const record =
          service.start({
            workerName:
              'worker-a',
            activeJobs: 4,
            reason:
              'maintenance',
            now:
              new Date(
                '2026-08-04T10:00:00.000Z',
              ),
          });

        expect(record.state)
          .toBe('draining');

        expect(record.activeJobs)
          .toBe(4);

        expect(
          record
            .affinityBindingsRemoved,
        ).toBe(3);

        expect(unbindWorker)
          .toHaveBeenCalledWith(
            'worker-a',
          );

        expect(
          service.canAcceptNewJobs(
            'worker-a',
          ),
        ).toBe(false);
      },
    );

    it(
      'completes immediately when no jobs are active',
      () => {
        const {
          service,
        } = setup();

        const record =
          service.start({
            workerName:
              'worker-a',
            activeJobs: 0,
          });

        expect(record.state)
          .toBe('drained');

        expect(
          record.completedAt,
        ).not.toBeNull();

        expect(
          service.isDraining(
            'worker-a',
          ),
        ).toBe(false);
      },
    );

    it(
      'updates progress and completes after all jobs finish',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 3,
        });

        const progress =
          service.updateProgress({
            workerName:
              'worker-a',
            activeJobs: 1,
            completedJobs: 2,
          });

        expect(progress.state)
          .toBe('draining');

        const completed =
          service.updateProgress({
            workerName:
              'worker-a',
            activeJobs: 0,
            completedJobs: 3,
          });

        expect(completed.state)
          .toBe('drained');

        expect(
          completed.completedJobs,
        ).toBe(3);

        expect(
          service.canAcceptNewJobs(
            'worker-a',
          ),
        ).toBe(true);
      },
    );

    it(
      'forces an active drain',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 5,
        });

        const forced =
          service.force(
            'worker-a',
          );

        expect(forced.state)
          .toBe('forced');

        expect(forced.activeJobs)
          .toBe(0);
      },
    );

    it(
      'supports immediate forced draining',
      () => {
        const {
          service,
        } = setup();

        const record =
          service.start({
            workerName:
              'worker-a',
            activeJobs: 5,
            force: true,
          });

        expect(record.state)
          .toBe('forced');

        expect(record.activeJobs)
          .toBe(0);
      },
    );

    it(
      'cancels an active drain',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
        });

        const cancelled =
          service.cancel(
            'worker-a',
          );

        expect(cancelled.state)
          .toBe('cancelled');

        expect(
          cancelled.cancelledAt,
        ).not.toBeNull();
      },
    );

    it(
      'times out draining workers',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
          timeoutMs: 60_000,
          now:
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
        });

        const timedOut =
          service.evaluateTimeouts(
            new Date(
              '2026-08-04T10:01:00.000Z',
            ),
          );

        expect(timedOut)
          .toHaveLength(1);

        expect(
          timedOut[0]?.state,
        ).toBe('timed_out');
      },
    );

    it(
      'does not time out workers before the deadline',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
          timeoutMs: 60_000,
          now:
            new Date(
              '2026-08-04T10:00:00.000Z',
            ),
        });

        expect(
          service.evaluateTimeouts(
            new Date(
              '2026-08-04T10:00:59.000Z',
            ),
          ),
        ).toHaveLength(0);
      },
    );

    it(
      'prevents duplicate active drains',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
        });

        expect(() =>
          service.start({
            workerName:
              'worker-a',
            activeJobs: 1,
          }),
        ).toThrow(
          'already draining',
        );
      },
    );

    it(
      'tracks events in order',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
        });

        service.updateProgress({
          workerName:
            'worker-a',
          activeJobs: 1,
        });

        service.updateProgress({
          workerName:
            'worker-a',
          activeJobs: 0,
        });

        expect(
          service.listEvents(
            'worker-a',
          ).map(
            (event) =>
              event.type,
          ),
        ).toEqual([
          'drain.started',
          'drain.progressed',
          'drain.completed',
        ]);
      },
    );

    it(
      'returns active drains only',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
        });

        service.start({
          workerName:
            'worker-b',
          activeJobs: 0,
        });

        expect(
          service.listActive().map(
            (record) =>
              record.workerName,
          ),
        ).toEqual([
          'worker-a',
        ]);
      },
    );

    it(
      'records draining metrics',
      () => {
        const {
          service,
        } = setup(2);

        service.start({
          workerName:
            'worker-a',
          activeJobs: 2,
        });

        service.start({
          workerName:
            'worker-b',
          activeJobs: 0,
        });

        const metrics =
          service.getMetrics();

        expect(
          metrics.totalDrainRequests,
        ).toBe(2);

        expect(
          metrics.activeDrains,
        ).toBe(1);

        expect(
          metrics.completedDrains,
        ).toBe(1);

        expect(
          metrics.activeJobsRemaining,
        ).toBe(2);

        expect(
          metrics
            .affinityBindingsRemoved,
        ).toBe(4);
      },
    );

    it(
      'validates counts and timeout',
      () => {
        const {
          service,
        } = setup();

        expect(() =>
          service.start({
            workerName:
              'worker-a',
            activeJobs: -1,
          }),
        ).toThrow(
          'non-negative integer',
        );

        expect(() =>
          service.start({
            workerName:
              'worker-a',
            timeoutMs: 0,
          }),
        ).toThrow(
          'positive integer',
        );
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const {
          service,
        } = setup();

        service.start({
          workerName:
            'worker-a',
          activeJobs: 1,
          metadata: {
            source: 'test',
          },
        });

        const first =
          service.get(
            'worker-a',
          );

        const second =
          service.get(
            'worker-a',
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