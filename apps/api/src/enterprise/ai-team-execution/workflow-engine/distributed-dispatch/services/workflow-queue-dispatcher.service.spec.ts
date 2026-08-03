import {
  Test,
} from '@nestjs/testing';
import {
  InMemoryQueueAdapter,
  QUEUE_PROVIDER,
} from '../../../../../modules/queue-infrastructure';
import {
  WorkflowSchedulerService,
} from '../../scheduler';
import {
  WorkflowStepOrchestratorService,
} from '../../orchestrator';
import {
  WorkflowDispatchIdempotencyService,
} from './workflow-dispatch-idempotency.service';
import {
  WorkflowQueueDispatcherService,
} from './workflow-queue-dispatcher.service';

describe('WorkflowQueueDispatcherService', () => {
  let queue: InMemoryQueueAdapter;
  let orchestrator:
    WorkflowStepOrchestratorService;
  let dispatcher:
    WorkflowQueueDispatcherService;

  beforeEach(async () => {
    queue = new InMemoryQueueAdapter();

    const moduleRef =
      await Test.createTestingModule({
        providers: [
          WorkflowSchedulerService,
          WorkflowStepOrchestratorService,
          WorkflowDispatchIdempotencyService,
          WorkflowQueueDispatcherService,
          {
            provide: QUEUE_PROVIDER,
            useValue: queue,
          },
        ],
      }).compile();

    orchestrator = moduleRef.get(
      WorkflowStepOrchestratorService,
    );

    dispatcher = moduleRef.get(
      WorkflowQueueDispatcherService,
    );

    orchestrator.createExecution({
      executionId: 'execution-1',
      workflowId: 'workflow-1',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 3,
        },
      ],
    });
  });

  afterEach(async () => {
    dispatcher.clear();
    await queue.close();
  });

  it('dispatches workflows', async () => {
    const result =
      await dispatcher.dispatchWorkflow(
        'execution-1',
        {
          priority: 'high',
          correlationId:
            'correlation-1',
        },
      );

    expect(result).toEqual(
      expect.objectContaining({
        queueName:
          'workflow-execution',
        kind: 'workflow',
        status: 'queued',
      }),
    );

    const job = await queue.getJob(
      'workflow-execution',
      result.jobId,
    );

    expect(job).toEqual(
      expect.objectContaining({
        name: 'execute-workflow',
        priority: 'high',
      }),
    );
  });

  it('dispatches workflow steps', async () => {
    const result =
      await dispatcher.dispatchStep(
        'execution-1',
        'step-a',
      );

    expect(result.queueName).toBe(
      'workflow-step-execution',
    );

    expect(result.kind).toBe('step');

    const record = dispatcher.getRecord(
      result.dispatchId,
    );

    expect(record.stepId).toBe('step-a');
  });

  it('dispatches retries with critical priority', async () => {
    const result =
      await dispatcher.dispatchRetry(
        'execution-1',
        'step-a',
        'schedule-1',
        2,
      );

    const job = await queue.getJob(
      'workflow-retry',
      result.jobId,
    );

    expect(job?.priority).toBe('critical');
    expect(result.kind).toBe('retry');
  });

  it('prevents duplicate workflow dispatch', async () => {
    const first =
      await dispatcher.dispatchWorkflow(
        'execution-1',
      );

    const second =
      await dispatcher.dispatchWorkflow(
        'execution-1',
      );

    expect(first.status).toBe('queued');
    expect(second.status).toBe('duplicate');

    expect(second.dispatchId).toBe(
      first.dispatchId,
    );
  });

  it('supports delayed dispatch', async () => {
    const result =
      await dispatcher.dispatchWorkflow(
        'execution-1',
        {
          delayMs: 30_000,
        },
      );

    const job = await queue.getJob(
      'workflow-execution',
      result.jobId,
    );

    expect(job?.status).toBe('delayed');
  });

  it('tracks dispatch lifecycle', async () => {
    const dispatched =
      await dispatcher.dispatchWorkflow(
        'execution-1',
      );

    expect(
      dispatcher.markProcessing(
        dispatched.dispatchId,
      ).status,
    ).toBe('processing');

    expect(
      dispatcher.markCompleted(
        dispatched.dispatchId,
      ).status,
    ).toBe('completed');

    expect(
      dispatcher.getMetrics(),
    ).toEqual(
      expect.objectContaining({
        completed: 1,
        total: 1,
      }),
    );
  });

  it('tracks dispatch failures', async () => {
    const dispatched =
      await dispatcher.dispatchWorkflow(
        'execution-1',
      );

    const failed = dispatcher.markFailed(
      dispatched.dispatchId,
      new Error('Worker failed'),
    );

    expect(failed.status).toBe('failed');
    expect(failed.error).toBe(
      'Worker failed',
    );
  });

  it('returns defensive dispatch records', async () => {
    const dispatched =
      await dispatcher.dispatchWorkflow(
        'execution-1',
        {
          metadata: {
            nested: {
              value: 'original',
            },
          },
        },
      );

    const record = dispatcher.getRecord(
      dispatched.dispatchId,
    );

    (
      record.metadata.nested as
        | Record<string, unknown>
        | undefined
    )!.value = 'changed';

    expect(
      (
        dispatcher.getRecord(
          dispatched.dispatchId,
        ).metadata.nested as
          | Record<string, unknown>
          | undefined
      )?.value,
    ).toBe('original');
  });
});
