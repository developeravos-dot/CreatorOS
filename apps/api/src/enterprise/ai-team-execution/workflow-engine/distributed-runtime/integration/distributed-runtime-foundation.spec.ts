import {
  DistributedWorkerRuntimeService,
  ExecutionLeaseManagerService,
  ExecutionRuntimeCoordinatorService,
} from '../services';

describe(
  'Distributed execution runtime foundation',
  () => {
    it(
      'registers workers and selects the least loaded eligible worker',
      () => {
        const runtime =
          new DistributedWorkerRuntimeService();

        runtime.register({
          workerId: 'worker-b',
          nodeId: 'node-b',
          capabilities: ['video', 'audio'],
          maximumConcurrency: 2,
        });

        runtime.register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: ['video'],
          maximumConcurrency: 2,
        });

        runtime.assign(
          'worker-a',
          'existing-execution',
        );

        expect(
          runtime.findEligible(['video'])[0]?.workerId,
        ).toBe('worker-b');
      },
    );

    it(
      'protects execution leases with fencing tokens',
      () => {
        const leases =
          new ExecutionLeaseManagerService();

        const first = leases.acquire({
          executionId: 'execution-one',
          workerId: 'worker-a',
          leaseDurationMs: 1_000,
          now: new Date(
            '2026-08-04T10:00:00.000Z',
          ),
        });

        expect(first).not.toBeNull();

        expect(
          leases.acquire({
            executionId: 'execution-one',
            workerId: 'worker-b',
            leaseDurationMs: 1_000,
            now: new Date(
              '2026-08-04T10:00:00.500Z',
            ),
          }),
        ).toBeNull();

        const second = leases.acquire({
          executionId: 'execution-one',
          workerId: 'worker-b',
          leaseDurationMs: 1_000,
          now: new Date(
            '2026-08-04T10:00:01.000Z',
          ),
        });

        expect(
          second?.fencingToken,
        ).toBeGreaterThan(
          first?.fencingToken ?? 0,
        );
      },
    );

    it(
      'coordinates a distributed execution lifecycle',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        coordinator.getWorkerRuntime().register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: ['workflow.execute'],
          maximumConcurrency: 2,
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
          payload: {
            value: 1,
          },
        });

        const leased = coordinator.assignNext(
          'execution-one',
          60_000,
        );

        const running = coordinator.start(
          leased.executionId,
          leased.assignedWorkerId ?? '',
          leased.fencingToken ?? 0,
        );

        const completed = coordinator.complete(
          running.executionId,
          running.assignedWorkerId ?? '',
          running.fencingToken ?? 0,
        );

        expect(completed.state).toBe('succeeded');
        expect(completed.attempt).toBe(1);
      },
    );

    it(
      'returns retryable failures to the runtime queue',
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
          executionId: 'execution-retry',
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

        const leased = coordinator.assignNext(
          'execution-retry',
          60_000,
        );

        const failed = coordinator.fail(
          leased.executionId,
          leased.assignedWorkerId ?? '',
          leased.fencingToken ?? 0,
          'temporary failure',
          true,
        );

        expect(failed.state).toBe('retrying');
        expect(failed.assignedWorkerId).toBeNull();
      },
    );
  },
);
