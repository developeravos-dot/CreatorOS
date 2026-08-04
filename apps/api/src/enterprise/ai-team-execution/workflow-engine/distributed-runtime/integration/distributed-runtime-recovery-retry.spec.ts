import {
  DistributedRetryEngineService,
  ExecutionRuntimeCoordinatorService,
  LostWorkerRecoveryService,
  WorkerFailureDetectorService,
} from '../services';

describe(
  'Distributed runtime recovery and retry',
  () => {
    it(
      'detects workers with expired heartbeats',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        const workers =
          coordinator.getWorkerRuntime();

        workers.register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: ['workflow.execute'],
          maximumConcurrency: 1,
          registeredAt: new Date(
            '2026-08-04T10:00:00.000Z',
          ),
        });

        const detector =
          new WorkerFailureDetectorService(
            workers,
          );

        const result = detector.detect(
          30_000,
          new Date(
            '2026-08-04T10:00:30.000Z',
          ),
        );

        expect(
          result.offlineWorkers,
        ).toHaveLength(1);

        expect(
          workers.get('worker-a')?.state,
        ).toBe('offline');
      },
    );

    it(
      'recovers leased executions from a lost worker',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        coordinator.getWorkerRuntime().register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: ['workflow.execute'],
          maximumConcurrency: 1,
        });

        coordinator.submit({
          executionId: 'execution-one',
          workflowId: 'workflow-one',
          stepId: 'step-one',
          requiredCapabilities: [
            'workflow.execute',
          ],
          trace: {
            correlationId: 'correlation-one',
            traceId: 'trace-one',
            parentTraceId: null,
          },
          payload: {},
        });

        coordinator.assignNext(
          'execution-one',
          60_000,
        );

        const recovery =
          new LostWorkerRecoveryService(
            coordinator,
          );

        const result = recovery.recover(
          'worker-a',
        );

        expect(
          result.recoveredExecutions,
        ).toHaveLength(1);

        expect(
          result.recoveredExecutions[0]?.state,
        ).toBe('reassigned');

        expect(
          result.recoveredExecutions[0]
            ?.assignedWorkerId,
        ).toBeNull();
      },
    );

    it(
      'calculates bounded exponential retry delays',
      () => {
        const retry =
          new DistributedRetryEngineService();

        const decision = retry.decide({
          attempt: 3,
          failureClass: 'transient',
          policy: {
            maximumAttempts: 5,
            baseDelayMs: 1_000,
            maximumDelayMs: 10_000,
            jitterRatio: 0.25,
          },
          random: 0.5,
        });

        expect(decision.retryable).toBe(true);
        expect(decision.delayMs).toBe(4_000);
        expect(decision.deadLetter).toBe(false);
      },
    );

    it(
      'dead-letters exhausted and permanent failures',
      () => {
        const retry =
          new DistributedRetryEngineService();

        expect(
          retry.decide({
            attempt: 5,
            failureClass: 'transient',
            policy: {
              maximumAttempts: 5,
              baseDelayMs: 1_000,
              maximumDelayMs: 10_000,
              jitterRatio: 0,
            },
          }).deadLetter,
        ).toBe(true);

        expect(
          retry.decide({
            attempt: 1,
            failureClass: 'permanent',
            policy: {
              maximumAttempts: 5,
              baseDelayMs: 1_000,
              maximumDelayMs: 10_000,
              jitterRatio: 0,
            },
          }).retryable,
        ).toBe(false);
      },
    );
  },
);
