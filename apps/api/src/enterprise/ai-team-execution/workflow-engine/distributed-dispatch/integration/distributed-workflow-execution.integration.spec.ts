import {
  TestingModule,
  Test,
} from '@nestjs/testing';
import {
  InMemoryQueueAdapter,
  InMemoryWorkerAdapter,
  QueueJob,
  QueueWorkerContext,
  QUEUE_PROVIDER,
  QUEUE_WORKER_PROVIDER,
} from '../../../../../modules/queue-infrastructure';
import {
  WorkflowExecutionEngineService,
} from '../../execution-engine';
import {
  WorkflowStepOrchestratorService,
} from '../../orchestrator';
import {
  DistributedWorkerCoordinatorService,
  WorkflowQueueDispatcherService,
} from '../services';
import {
  WorkflowDispatchModule,
} from '../workflow-dispatch.module';

describe('Distributed workflow execution integration', () => {
  let moduleRef: TestingModule;
  let queueProvider: InMemoryQueueAdapter;
  let workerProvider: InMemoryWorkerAdapter;

  let orchestrator:
    WorkflowStepOrchestratorService;

  let engine:
    WorkflowExecutionEngineService;

  let dispatcher:
    WorkflowQueueDispatcherService;

  let coordinator:
    DistributedWorkerCoordinatorService;

  beforeEach(async () => {
    queueProvider =
      new InMemoryQueueAdapter();

    workerProvider =
      new InMemoryWorkerAdapter();

    moduleRef = await Test
      .createTestingModule({
        imports: [
          WorkflowDispatchModule,
        ],
      })
      .overrideProvider(QUEUE_PROVIDER)
      .useValue(queueProvider)
      .overrideProvider(QUEUE_WORKER_PROVIDER)
      .useValue(workerProvider)
      .compile();

    orchestrator = moduleRef.get(
      WorkflowStepOrchestratorService,
    );

    engine = moduleRef.get(
      WorkflowExecutionEngineService,
    );

    dispatcher = moduleRef.get(
      WorkflowQueueDispatcherService,
    );

    coordinator = moduleRef.get(
      DistributedWorkerCoordinatorService,
    );

    await coordinator.registerWorkers();
  });

  afterEach(async () => {
    engine.clearHandlers();
    dispatcher.clear();

    await coordinator.onApplicationShutdown();
    await queueProvider.close();
    await workerProvider.closeWorkers();
    await moduleRef.close();
  });

  async function executeQueuedJob(
    queueName: string,
    workerName: string,
  ): Promise<unknown> {
    const jobs =
      queueProvider.listJobs(queueName);

    const job = jobs[0];

    if (!job) {
      throw new Error(
        `No queued job exists in ${queueName}.`,
      );
    }

    const context:
      QueueWorkerContext<Record<string, unknown>> = {
        jobId: job.id,
        queueName: job.queueName,
        jobName: job.name,
        payload: structuredClone(job.payload),
        attempt: job.attemptsMade + 1,
        metadata: structuredClone(job.metadata),
      };

    return workerProvider.execute(
      workerName,
      context,
    );
  }

  it('dispatches and executes an entire workflow through the distributed worker', async () => {
    orchestrator.createExecution({
      executionId:
        'distributed-workflow-execution',
      workflowId:
        'distributed-workflow',
      steps: [
        {
          id: 'research',
        },
        {
          id: 'write',
          dependsOn: ['research'],
        },
        {
          id: 'review',
          dependsOn: ['write'],
        },
      ],
    });

    engine.registerHandler(
      'research',
      async () => ({
        output: {
          researchCompleted: true,
        },
      }),
    );

    engine.registerHandler(
      'write',
      async () => ({
        output: {
          articleCreated: true,
        },
      }),
    );

    engine.registerHandler(
      'review',
      async () => ({
        output: {
          approved: true,
        },
      }),
    );

    const dispatched =
      await dispatcher.dispatchWorkflow(
        'distributed-workflow-execution',
        {
          correlationId:
            'correlation-workflow-1',
          priority: 'high',
        },
      );

    expect(dispatched.status).toBe('queued');

    const queuedJobs =
      queueProvider.listJobs(
        'workflow-execution',
      );

    expect(queuedJobs).toHaveLength(1);

    expect(queuedJobs[0]?.payload).toEqual(
      expect.objectContaining({
        dispatchId:
          dispatched.dispatchId,
        executionId:
          'distributed-workflow-execution',
        workflowId:
          'distributed-workflow',
      }),
    );

    await executeQueuedJob(
      'workflow-execution',
      'distributed-workflow-worker',
    );

    const execution =
      orchestrator.getExecution(
        'distributed-workflow-execution',
      );

    expect(execution.status).toBe(
      'completed',
    );

    expect(
      execution.steps.map(
        (step) => ({
          id: step.id,
          status: step.status,
        }),
      ),
    ).toEqual([
      {
        id: 'research',
        status: 'completed',
      },
      {
        id: 'write',
        status: 'completed',
      },
      {
        id: 'review',
        status: 'completed',
      },
    ]);

    expect(
      dispatcher.getRecord(
        dispatched.dispatchId,
      ),
    ).toEqual(
      expect.objectContaining({
        status: 'completed',
        executionId:
          'distributed-workflow-execution',
        correlationId:
          'correlation-workflow-1',
      }),
    );
  });

  it('dispatches and executes one workflow step through the distributed step worker', async () => {
    orchestrator.createExecution({
      executionId:
        'distributed-step-execution',
      workflowId:
        'distributed-step-workflow',
      maxParallelSteps: 2,
      steps: [
        {
          id: 'first-step',
        },
        {
          id: 'second-step',
        },
      ],
    });

    engine.registerHandler(
      'second-step',
      async () => ({
        output: {
          selectedStepExecuted: true,
        },
      }),
    );

    const dispatched =
      await dispatcher.dispatchStep(
        'distributed-step-execution',
        'second-step',
        {
          priority: 'critical',
        },
      );

    expect(dispatched.status).toBe('queued');

    const queuedJobs =
      queueProvider.listJobs(
        'workflow-step-execution',
      );

    expect(queuedJobs).toHaveLength(1);

    expect(queuedJobs[0]).toEqual(
      expect.objectContaining({
        priority: 'critical',
        status: 'waiting',
      }),
    );

    await executeQueuedJob(
      'workflow-step-execution',
      'distributed-step-worker',
    );

    const execution =
      orchestrator.getExecution(
        'distributed-step-execution',
      );

    expect(
      execution.steps.find(
        (step) =>
          step.id === 'second-step',
      )?.status,
    ).toBe('completed');

    expect(
      execution.steps.find(
        (step) =>
          step.id === 'first-step',
      )?.status,
    ).toBe('ready');

    expect(
      dispatcher.getRecord(
        dispatched.dispatchId,
      ).status,
    ).toBe('completed');
  });

  it('dispatches and executes a scheduled retry through the distributed retry worker', async () => {
    orchestrator.createExecution({
      executionId:
        'distributed-retry-execution',
      workflowId:
        'distributed-retry-workflow',
      steps: [
        {
          id: 'unstable-step',
          maxAttempts: 2,
          retryDelayMs: 1_000,
        },
      ],
    });

    engine.registerHandler(
      'unstable-step',
      async () => {
        throw Object.assign(
          new Error(
            'Temporary distributed failure',
          ),
          {
            retryable: true,
          },
        );
      },
    );

    const failedRun =
      await engine.runExecution(
        'distributed-retry-execution',
      );

    expect(
      failedRun.retryScheduleIds,
    ).toHaveLength(1);

    const retryScheduleId =
      failedRun.retryScheduleIds[0];

    if (!retryScheduleId) {
      throw new Error(
        'Expected a retry schedule ID.',
      );
    }

    engine.registerHandler(
      'unstable-step',
      async () => ({
        output: {
          recovered: true,
        },
      }),
    );

    const dispatched =
      await dispatcher.dispatchRetry(
        'distributed-retry-execution',
        'unstable-step',
        retryScheduleId,
        2,
        {
          priority: 'critical',
        },
      );

    expect(dispatched.status).toBe('queued');

    const queuedJobs =
      queueProvider.listJobs(
        'workflow-retry',
      );

    expect(queuedJobs).toHaveLength(1);

    expect(queuedJobs[0]?.payload).toEqual(
      expect.objectContaining({
        dispatchId:
          dispatched.dispatchId,
        executionId:
          'distributed-retry-execution',
        stepId: 'unstable-step',
        scheduleId:
          retryScheduleId,
        retryAttempt: 2,
      }),
    );

    const orchestratorClock =
      jest.spyOn(
        orchestrator as unknown as {
          now: () => Date;
        },
        'now',
      );

    orchestratorClock.mockReturnValue(
      new Date(
        '9999-12-31T23:59:59.999Z',
      ),
    );

    try {
      await executeQueuedJob(
        'workflow-retry',
        'distributed-retry-worker',
      );
    } finally {
      orchestratorClock.mockRestore();
    }
    const execution =
      orchestrator.getExecution(
        'distributed-retry-execution',
      );

    expect(
      execution.steps[0]?.status,
    ).toBe('completed');

    expect(
      execution.steps[0]?.output,
    ).toEqual({
      recovered: true,
    });

    expect(
      dispatcher.getRecord(
        dispatched.dispatchId,
      ).status,
    ).toBe('completed');
  });

  it('prevents duplicate distributed workflow jobs', async () => {
    orchestrator.createExecution({
      executionId:
        'distributed-duplicate-execution',
      workflowId:
        'distributed-duplicate-workflow',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    const first =
      await dispatcher.dispatchWorkflow(
        'distributed-duplicate-execution',
      );

    const duplicate =
      await dispatcher.dispatchWorkflow(
        'distributed-duplicate-execution',
      );

    expect(first.status).toBe('queued');
    expect(duplicate.status).toBe(
      'duplicate',
    );

    expect(duplicate.dispatchId).toBe(
      first.dispatchId,
    );

    expect(
      queueProvider.listJobs(
        'workflow-execution',
      ),
    ).toHaveLength(1);
  });

  it('reports active distributed workers, leases and heartbeats', () => {
    const metrics =
      coordinator.getRuntimeMetrics();

    expect(metrics).toEqual(
      expect.objectContaining({
        registeredWorkers: 3,
        runningWorkers: 3,
        activeLeases: 3,
        activeJobs: 0,
      }),
    );

    expect(
      workerProvider
        .listWorkers()
        .map(
          (worker) => worker.workerName,
        ),
    ).toEqual([
      'distributed-retry-worker',
      'distributed-step-worker',
      'distributed-workflow-worker',
    ]);
  });
});
