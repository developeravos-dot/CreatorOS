import {
  DistributedRuntimeModule,
} from '../distributed-runtime.module';
import {
  ExecutionLeaseManagerService,
  ExecutionRuntimeCoordinatorService,
} from '../services';
import {
  WorkflowDispatchModule,
} from '../../distributed-dispatch';

describe(
  'Distributed runtime concurrency and production wiring',
  () => {
    it(
      'allows exactly one concurrent lease owner',
      () => {
        const leases =
          new ExecutionLeaseManagerService();

        const results = Array.from(
          {
            length: 100,
          },
          (_, index) =>
            leases.acquire({
              executionId:
                'execution-concurrent',
              workerId:
                `worker-${index}`,
              leaseDurationMs:
                60_000,
              now: new Date(
                '2026-08-04T10:00:00.000Z',
              ),
            }),
        );

        expect(
          results.filter(
            (lease) => lease !== null,
          ),
        ).toHaveLength(1);

        expect(
          results.filter(
            (lease) => lease === null,
          ),
        ).toHaveLength(99);
      },
    );

    it(
      'prevents duplicate distributed execution submission',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        const request = {
          executionId:
            'execution-duplicate',
          workflowId:
            'workflow-one',
          stepId:
            'step-one',
          requiredCapabilities: [
            'workflow.execute',
          ],
          trace: {
            correlationId:
              'correlation-one',
            traceId:
              'trace-one',
            parentTraceId:
              null,
          },
          payload: {},
        } as const;

        coordinator.submit(request);

        expect(
          () =>
            coordinator.submit(request),
        ).toThrow(
          'Distributed execution execution-duplicate already exists.',
        );
      },
    );

    it(
      'recovers a lost worker and reassigns its execution',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        const workers =
          coordinator.getWorkerRuntime();

        workers.register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: [
            'workflow.execute',
          ],
          maximumConcurrency: 1,
        });

        workers.register({
          workerId: 'worker-b',
          nodeId: 'node-b',
          capabilities: [
            'workflow.execute',
          ],
          maximumConcurrency: 1,
        });

        coordinator.submit({
          executionId:
            'execution-recovery',
          workflowId:
            'workflow-one',
          stepId:
            'step-one',
          requiredCapabilities: [
            'workflow.execute',
          ],
          trace: {
            correlationId:
              'correlation-one',
            traceId:
              'trace-one',
            parentTraceId:
              null,
          },
          payload: {},
        });

        const first =
          coordinator.assignNext(
            'execution-recovery',
            60_000,
          );

        expect(
          first.assignedWorkerId,
        ).toBe('worker-a');

        const recovered =
          coordinator.recoverLostWorker(
            'worker-a',
          );

        expect(recovered)
          .toHaveLength(1);

        expect(
          recovered[0]?.state,
        ).toBe('reassigned');

        const reassigned =
          coordinator.assignNext(
            'execution-recovery',
            60_000,
          );

        expect(
          reassigned.assignedWorkerId,
        ).toBe('worker-b');

        expect(
          reassigned.fencingToken,
        ).toBeGreaterThan(
          first.fencingToken ?? 0,
        );
      },
    );

    it(
      'rejects stale ownership after reassignment',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        const workers =
          coordinator.getWorkerRuntime();

        workers.register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: [
            'workflow.execute',
          ],
          maximumConcurrency: 1,
        });

        workers.register({
          workerId: 'worker-b',
          nodeId: 'node-b',
          capabilities: [
            'workflow.execute',
          ],
          maximumConcurrency: 1,
        });

        coordinator.submit({
          executionId:
            'execution-fencing',
          workflowId:
            'workflow-one',
          stepId:
            'step-one',
          requiredCapabilities: [
            'workflow.execute',
          ],
          trace: {
            correlationId:
              'correlation-one',
            traceId:
              'trace-one',
            parentTraceId:
              null,
          },
          payload: {},
        });

        const original =
          coordinator.assignNext(
            'execution-fencing',
            60_000,
          );

        coordinator.recoverLostWorker(
          'worker-a',
        );

        coordinator.assignNext(
          'execution-fencing',
          60_000,
        );

        expect(
          () =>
            coordinator.start(
              'execution-fencing',
              'worker-a',
              original.fencingToken ?? 0,
            ),
        ).toThrow(
          'Distributed execution ownership mismatch.',
        );
      },
    );

    it(
      'wires the runtime module into workflow dispatch',
      () => {
        const imports =
          Reflect.getMetadata(
            'imports',
            WorkflowDispatchModule,
          ) as readonly unknown[];

        expect(imports)
          .toContain(
            DistributedRuntimeModule,
          );
      },
    );
  },
);