import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import type {
  QueueWorkerRegistryService,
} from '../../../../../modules/queue-infrastructure';
import {
  WorkerSelectionService,
} from './worker-selection.service';

describe(
  'WorkerSelectionService',
  () => {
    const handler =
      jest.fn();

    function registration(
      workerName: string,
      queueName = 'workflow-step',
      concurrency = 4,
    ): QueueWorkerRegistration {
      return {
        workerName,
        queueName,
        concurrency,
        handler,
      };
    }

    function setup(
      registrations:
        QueueWorkerRegistration[],
    ): WorkerSelectionService {
      const registry = {
        list:
          jest.fn(
            () =>
              registrations.map(
                (item) => ({
                  ...item,
                }),
              ),
          ),
      } as unknown as
        QueueWorkerRegistryService;

      return new WorkerSelectionService(
        registry,
      );
    }

    it(
      'selects the worker with the highest available capacity',
      () => {
        const service =
          setup([
            registration(
              'worker-one',
            ),
            registration(
              'worker-two',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
            runtimeSnapshots: [
              {
                workerName:
                  'worker-one',
                status:
                  'healthy',
                activeJobs: 3,
                completedJobs: 10,
                failedJobs: 0,
              },
              {
                workerName:
                  'worker-two',
                status:
                  'healthy',
                activeJobs: 1,
                completedJobs: 10,
                failedJobs: 0,
              },
            ],
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe(
          'worker-two',
        );

        expect(
          result.reasonCode,
        ).toBe(
          'selected',
        );
      },
    );

    it(
      'filters workers by queue',
      () => {
        const service =
          setup([
            registration(
              'step-worker',
              'workflow-step',
            ),
            registration(
              'retry-worker',
              'workflow-retry',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-retry',
          });

        expect(
          result.candidates,
        ).toHaveLength(1);

        expect(
          result.selected
            ?.workerName,
        ).toBe(
          'retry-worker',
        );
      },
    );

    it(
      'rejects workers without required capabilities',
      () => {
        const service =
          setup([
            registration(
              'worker-one',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
            requiredCapabilities: [
              'gpu',
            ],
            runtimeSnapshots: [
              {
                workerName:
                  'worker-one',
                status:
                  'healthy',
                activeJobs: 0,
                completedJobs: 0,
                failedJobs: 0,
                capabilities: [
                  'cpu',
                ],
              },
            ],
          });

        expect(
          result.selected,
        ).toBeNull();

        expect(
          result.reasonCode,
        ).toBe(
          'no_eligible_workers',
        );

        expect(
          result.candidates[0]
            ?.rejectionReasons,
        ).toContain(
          'missing_capabilities:gpu',
        );
      },
    );

    it(
      'rejects full workers',
      () => {
        const service =
          setup([
            registration(
              'worker-one',
              'workflow-step',
              2,
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
            runtimeSnapshots: [
              {
                workerName:
                  'worker-one',
                status:
                  'healthy',
                activeJobs: 2,
                completedJobs: 0,
                failedJobs: 0,
              },
            ],
          });

        expect(
          result.selected,
        ).toBeNull();

        expect(
          result.candidates[0]
            ?.rejectionReasons,
        ).toContain(
          'insufficient_capacity',
        );
      },
    );

    it(
      'rejects unhealthy and disallowed degraded workers',
      () => {
        const service =
          setup([
            registration(
              'unhealthy-worker',
            ),
            registration(
              'degraded-worker',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
            allowDegraded:
              false,
            runtimeSnapshots: [
              {
                workerName:
                  'unhealthy-worker',
                status:
                  'unhealthy',
                activeJobs: 0,
                completedJobs: 0,
                failedJobs: 0,
              },
              {
                workerName:
                  'degraded-worker',
                status:
                  'degraded',
                activeJobs: 0,
                completedJobs: 0,
                failedJobs: 0,
              },
            ],
          });

        expect(
          result.selected,
        ).toBeNull();

        expect(
          result.eligibleWorkers,
        ).toBe(0);
      },
    );

    it(
      'applies affinity and preference bonuses',
      () => {
        const service =
          setup([
            registration(
              'worker-a',
            ),
            registration(
              'worker-b',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
            affinityWorkerName:
              'worker-b',
            preferredWorkerName:
              'worker-b',
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe(
          'worker-b',
        );

        expect(
          result.selectedCandidate
            ?.score.affinityScore,
        ).toBe(7);

        expect(
          result.selectedCandidate
            ?.score.preferenceScore,
        ).toBe(3);
      },
    );

    it(
      'uses worker name for deterministic tie breaking',
      () => {
        const service =
          setup([
            registration(
              'worker-z',
            ),
            registration(
              'worker-a',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
          });

        expect(
          result.selected
            ?.workerName,
        ).toBe(
          'worker-a',
        );
      },
    );

    it(
      'rejects expired heartbeats',
      () => {
        const service =
          setup([
            registration(
              'worker-one',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
            now:
              new Date(
                '2026-08-04T10:00:00.000Z',
              ),
            maximumHeartbeatAgeMs:
              60_000,
            runtimeSnapshots: [
              {
                workerName:
                  'worker-one',
                status:
                  'healthy',
                activeJobs: 0,
                completedJobs: 0,
                failedJobs: 0,
                lastHeartbeatAt:
                  new Date(
                    '2026-08-04T09:58:00.000Z',
                  ),
              },
            ],
          });

        expect(
          result.selected,
        ).toBeNull();

        expect(
          result.candidates[0]
            ?.rejectionReasons,
        ).toContain(
          'heartbeat_expired',
        );
      },
    );

    it(
      'returns no registered workers reason',
      () => {
        const service =
          setup([]);

        const result =
          service.select({
            queueName:
              'workflow-step',
          });

        expect(
          result.reasonCode,
        ).toBe(
          'no_registered_workers',
        );

        expect(
          result.selected,
        ).toBeNull();
      },
    );

    it(
      'returns queue compatibility failure',
      () => {
        const service =
          setup([
            registration(
              'worker-one',
              'another-queue',
            ),
          ]);

        const result =
          service.select({
            queueName:
              'workflow-step',
          });

        expect(
          result.reasonCode,
        ).toBe(
          'no_queue_compatible_workers',
        );
      },
    );

    it(
      'supports direct eligibility evaluation',
      () => {
        const service =
          setup([]);

        expect(
          service.isEligible(
            registration(
              'worker-one',
            ),
            {
              queueName:
                'workflow-step',
            },
            {
              workerName:
                'worker-one',
              status:
                'healthy',
              activeJobs: 0,
              completedJobs: 5,
              failedJobs: 0,
            },
          ),
        ).toBe(true);
      },
    );

    it(
      'validates selection request fields',
      () => {
        const service =
          setup([]);

        expect(() =>
          service.select({
            queueName: ' ',
          }),
        ).toThrow(
          'queueName is required',
        );

        expect(() =>
          service.select({
            queueName:
              'workflow-step',
            minimumAvailableSlots:
              -1,
          }),
        ).toThrow(
          'minimumAvailableSlots',
        );
      },
    );
  },
);