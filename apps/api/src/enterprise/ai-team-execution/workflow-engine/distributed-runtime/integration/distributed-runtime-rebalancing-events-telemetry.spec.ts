import {
  ExecutionEventBusService,
  RuntimeRebalancingService,
  RuntimeTelemetryService,
} from '../services';
import {
  ExecutionRuntimeCoordinatorService,
} from '../services/execution-runtime-coordinator.service';

describe(
  'Distributed runtime rebalancing events telemetry',
  () => {
    it(
      'builds safe rebalancing plans',
      () => {
        const coordinator =
          new ExecutionRuntimeCoordinatorService();

        const workers =
          coordinator.getWorkerRuntime();

        workers.register({
          workerId: 'worker-a',
          nodeId: 'node-a',
          capabilities: ['workflow.execute'],
          maximumConcurrency: 2,
        });

        workers.register({
          workerId: 'worker-b',
          nodeId: 'node-b',
          capabilities: ['workflow.execute'],
          maximumConcurrency: 2,
        });

        workers.assign(
          'worker-a',
          'execution-one',
        );

        workers.assign(
          'worker-a',
          'execution-two',
        );

        const rebalancing =
          new RuntimeRebalancingService(
            workers,
          );

        const plan = rebalancing.plan({
          maximumMoves: 1,
          overloadRatio: 1,
          underloadRatio: 0.25,
        });

        expect(plan.moves).toEqual([
          {
            executionId: 'execution-one',
            sourceWorkerId: 'worker-a',
            targetWorkerId: 'worker-b',
          },
        ]);
      },
    );

    it(
      'deduplicates events and preserves ordering',
      () => {
        const events =
          new ExecutionEventBusService();

        events.publish({
          eventId: 'event-one',
          executionId: 'execution-one',
          type: 'execution.started',
        });

        events.publish({
          eventId: 'event-two',
          executionId: 'execution-one',
          type: 'execution.completed',
        });

        events.publish({
          eventId: 'event-one',
          executionId: 'execution-one',
          type: 'execution.failed',
        });

        const stored =
          events.list('execution-one');

        expect(stored).toHaveLength(2);
        expect(stored[0]?.sequence).toBe(1);
        expect(stored[1]?.sequence).toBe(2);
        expect(stored[0]?.type)
          .toBe('execution.started');
      },
    );

    it(
      'aggregates runtime health and metrics',
      () => {
        const telemetry =
          new RuntimeTelemetryService();

        const snapshot =
          telemetry.snapshot({
            executions: [
              {
                executionId: 'execution-one',
                workflowId: 'workflow-one',
                stepId: 'step-one',
                state: 'succeeded',
                assignedWorkerId: 'worker-a',
                fencingToken: 1,
                attempt: 1,
                trace: {
                  correlationId: 'correlation-one',
                  traceId: 'trace-one',
                  parentTraceId: null,
                },
                payload: {},
                requiredCapabilities: [
                  'workflow.execute',
                ],
                createdAt: new Date(
                  '2026-08-04T10:00:00.000Z',
                ),
                updatedAt: new Date(
                  '2026-08-04T10:00:03.000Z',
                ),
                startedAt: new Date(
                  '2026-08-04T10:00:01.000Z',
                ),
                completedAt: new Date(
                  '2026-08-04T10:00:03.000Z',
                ),
                lastError: null,
              },
            ],
            workers: [
              {
                workerId: 'worker-a',
                nodeId: 'node-a',
                capabilities: [
                  'workflow.execute',
                ],
                maximumConcurrency: 1,
                activeExecutionIds: [],
                state: 'active',
                registeredAt: new Date(
                  '2026-08-04T10:00:00.000Z',
                ),
                lastHeartbeatAt: new Date(
                  '2026-08-04T10:00:03.000Z',
                ),
              },
            ],
            events: [],
            activeLeases: 0,
          });

        expect(
          snapshot.succeededExecutions,
        ).toBe(1);

        expect(
          snapshot.averageExecutionLatencyMs,
        ).toBe(2_000);

        expect(snapshot.warnings)
          .toHaveLength(0);
      },
    );
  },
);
