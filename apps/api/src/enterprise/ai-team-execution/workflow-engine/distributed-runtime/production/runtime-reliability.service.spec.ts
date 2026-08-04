import {
  RuntimeReliabilityService,
} from './runtime-reliability.service';

describe(
  'RuntimeReliabilityService',
  () => {
    it(
      'creates versioned checkpoints',
      () => {
        const service =
          new RuntimeReliabilityService();

        expect(
          service.checkpoint(
            'execution-one',
            { step: 1 },
          ).version,
        ).toBe(1);

        expect(
          service.checkpoint(
            'execution-one',
            { step: 2 },
          ).version,
        ).toBe(2);

        expect(
          service.latestCheckpoint(
            'execution-one',
          )?.payload,
        ).toEqual({ step: 2 });
      },
    );

    it(
      'governs retries and dead letters',
      () => {
        const service =
          new RuntimeReliabilityService();

        expect(
          service.retry({
            attempt: 2,
            maximumAttempts: 4,
            baseDelayMs: 1000,
            maximumDelayMs: 10000,
            permanentFailure: false,
          }),
        ).toEqual({
          retryable: true,
          delayMs: 2000,
          deadLetter: false,
        });

        expect(
          service.retry({
            attempt: 4,
            maximumAttempts: 4,
            baseDelayMs: 1000,
            maximumDelayMs: 10000,
            permanentFailure: false,
          }).deadLetter,
        ).toBe(true);
      },
    );

    it(
      'supports graceful shutdown and recovery planning',
      () => {
        const service =
          new RuntimeReliabilityService();

        expect(
          service.canAcceptWork(),
        ).toBe(true);

        service.beginGracefulShutdown();

        expect(
          service.canAcceptWork(),
        ).toBe(false);

        expect(
          service.recoveryPlan({
            offlineWorkers: 1,
            orphanedExecutions: 2,
            failedDependencies: 1,
          }),
        ).toEqual([
          'restart-offline-workers',
          'reassign-orphaned-executions',
          'isolate-failed-dependencies',
        ]);
      },
    );
  },
);
