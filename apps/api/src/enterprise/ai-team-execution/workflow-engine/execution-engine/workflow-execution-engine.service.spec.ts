import { Test } from '@nestjs/testing';
import {
  WorkflowStepOrchestratorService,
} from '../orchestrator';
import {
  WorkflowSchedulerService,
} from '../scheduler';
import {
  WorkflowExecutionEngineService,
} from './workflow-execution-engine.service';

describe('WorkflowExecutionEngineService', () => {
  let engine: WorkflowExecutionEngineService;
  let orchestrator:
    WorkflowStepOrchestratorService;
  let scheduler: WorkflowSchedulerService;

  const systemTime = new Date(
    '2026-08-04T00:00:00.000Z',
  );

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(systemTime);

    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkflowSchedulerService,
        WorkflowStepOrchestratorService,
        WorkflowExecutionEngineService,
      ],
    }).compile();

    engine = moduleRef.get(
      WorkflowExecutionEngineService,
    );

    orchestrator = moduleRef.get(
      WorkflowStepOrchestratorService,
    );

    scheduler = moduleRef.get(
      WorkflowSchedulerService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('registers and unregisters handlers', () => {
    const handler = jest.fn();

    engine.registerHandler('step-a', handler);

    expect(engine.hasHandler('step-a')).toBe(true);
    expect(engine.unregisterHandler('step-a')).toBe(
      true,
    );
    expect(engine.hasHandler('step-a')).toBe(false);
  });

  it('executes a sequential workflow to completion', async () => {
    orchestrator.createExecution({
      executionId: 'execution-sequential',
      workflowId: 'workflow-sequential',
      steps: [
        {
          id: 'step-a',
          input: {
            value: 10,
          },
        },
        {
          id: 'step-b',
          dependsOn: ['step-a'],
        },
      ],
    });

    engine.registerHandler('step-a', async (context) => ({
      output: {
        result: Number(context.input.value) * 2,
      },
    }));

    engine.registerHandler('step-b', async () => ({
      output: {
        completed: true,
      },
    }));

    const result = await engine.runExecution(
      'execution-sequential',
    );

    expect(result.execution.status).toBe('completed');
    expect(result.dispatchedStepIds).toEqual([
      'step-a',
      'step-b',
    ]);
    expect(result.completedStepIds).toEqual([
      'step-a',
      'step-b',
    ]);
    expect(result.failedStepIds).toEqual([]);
  });

  it('executes parallel ready steps', async () => {
    orchestrator.createExecution({
      executionId: 'execution-parallel',
      workflowId: 'workflow-parallel',
      maxParallelSteps: 2,
      steps: [
        {
          id: 'step-a',
        },
        {
          id: 'step-b',
        },
      ],
    });

    const handlerA = jest.fn(async () => ({
      output: {
        source: 'a',
      },
    }));

    const handlerB = jest.fn(async () => ({
      output: {
        source: 'b',
      },
    }));

    engine.registerHandler('step-a', handlerA);
    engine.registerHandler('step-b', handlerB);

    const result = await engine.runExecution(
      'execution-parallel',
    );

    expect(result.execution.status).toBe('completed');
    expect(handlerA).toHaveBeenCalledTimes(1);
    expect(handlerB).toHaveBeenCalledTimes(1);
  });

  it('fails a step when no handler is registered', async () => {
    orchestrator.createExecution({
      executionId: 'execution-no-handler',
      workflowId: 'workflow-no-handler',
      steps: [
        {
          id: 'missing-handler-step',
        },
      ],
    });

    const result = await engine.runExecution(
      'execution-no-handler',
    );

    expect(result.execution.status).toBe('failed');
    expect(result.failedStepIds).toEqual([
      'missing-handler-step',
    ]);

    expect(
      result.execution.steps[0]?.error?.code,
    ).toBe('WORKFLOW_STEP_HANDLER_NOT_FOUND');
  });

  it('passes defensive input copies to handlers', async () => {
    orchestrator.createExecution({
      executionId: 'execution-copy',
      workflowId: 'workflow-copy',
      steps: [
        {
          id: 'step-a',
          input: {
            value: 'original',
          },
        },
      ],
    });

    engine.registerHandler('step-a', (context) => {
      context.input.value = 'mutated';

      return {
        output: {
          done: true,
        },
      };
    });

    await engine.runExecution('execution-copy');

    expect(
      orchestrator.getExecution('execution-copy')
        .steps[0]?.input.value,
    ).toBe('original');
  });

  it('sanitizes handler output through orchestrator', async () => {
    orchestrator.createExecution({
      executionId: 'execution-output-secret',
      workflowId: 'workflow-output-secret',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    engine.registerHandler('step-a', () => ({
      output: {
        accessToken: 'must-not-leak',
        publicValue: 'visible',
      },
    }));

    const result = await engine.runExecution(
      'execution-output-secret',
    );

    expect(result.execution.steps[0]?.output).toEqual({
      accessToken: '[REDACTED]',
      publicValue: 'visible',
    });
  });

  it('creates retry schedules for retryable handler errors', async () => {
    orchestrator.createExecution({
      executionId: 'execution-retry',
      workflowId: 'workflow-retry',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 2,
          retryDelayMs: 30_000,
        },
      ],
    });

    const error = Object.assign(
      new Error('Temporary provider failure'),
      {
        retryable: true,
        code: 'PROVIDER_TEMPORARY_FAILURE',
        details: {
          apiKey: 'must-not-leak',
        },
      },
    );

    engine.registerHandler('step-a', () => {
      throw error;
    });

    const result = await engine.runExecution(
      'execution-retry',
    );

    expect(result.execution.status).toBe('running');
    expect(result.failedStepIds).toEqual(['step-a']);
    expect(result.retryScheduleIds).toHaveLength(1);

    const schedule = scheduler.getSchedule(
      result.retryScheduleIds[0]!,
    );

    expect(schedule.kind).toBe('retry');
    expect(schedule.retryAttempt).toBe(2);
    expect(schedule.metadata).toEqual(
      expect.objectContaining({
        stepId: 'step-a',
      }),
    );

    expect(
      result.execution.steps[0]?.error?.details
        ?.apiKey,
    ).toBe('[REDACTED]');
  });

  it('activates due retries and completes the next attempt', async () => {
    orchestrator.createExecution({
      executionId: 'execution-retry-success',
      workflowId: 'workflow-retry-success',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 2,
          retryDelayMs: 10_000,
        },
      ],
    });

    let callCount = 0;

    engine.registerHandler('step-a', () => {
      callCount += 1;

      if (callCount === 1) {
        throw Object.assign(
          new Error('Retry once'),
          {
            retryable: true,
          },
        );
      }

      return {
        output: {
          success: true,
        },
      };
    });

    const firstRun = await engine.runExecution(
      'execution-retry-success',
    );

    expect(firstRun.retryScheduleIds).toHaveLength(1);

    jest.setSystemTime(
      new Date(systemTime.getTime() + 10_000),
    );

    const activations =
      engine.activateDueRetrySchedules();

    expect(activations).toHaveLength(1);
    expect(activations[0]?.step.status).toBe('ready');

    const secondRun = await engine.runExecution(
      'execution-retry-success',
    );

    expect(secondRun.execution.status).toBe(
      'completed',
    );

    expect(
      secondRun.execution.steps[0]?.attempt,
    ).toBe(2);
  });

  it('stops after the configured maximum steps', async () => {
    orchestrator.createExecution({
      executionId: 'execution-max-steps',
      workflowId: 'workflow-max-steps',
      steps: [
        {
          id: 'step-a',
        },
        {
          id: 'step-b',
          dependsOn: ['step-a'],
        },
      ],
    });

    engine.registerHandler('step-a', () => ({
      output: {
        done: true,
      },
    }));

    engine.registerHandler('step-b', () => ({
      output: {
        done: true,
      },
    }));

    const firstRun = await engine.runExecution(
      'execution-max-steps',
      {
        maxSteps: 1,
      },
    );

    expect(firstRun.completedStepIds).toEqual([
      'step-a',
    ]);

    expect(firstRun.execution.status).toBe('running');

    const secondRun = await engine.runExecution(
      'execution-max-steps',
    );

    expect(secondRun.execution.status).toBe(
      'completed',
    );
  });

  it('runs one explicitly selected ready step', async () => {
    orchestrator.createExecution({
      executionId: 'execution-single',
      workflowId: 'workflow-single',
      steps: [
        {
          id: 'step-a',
        },
        {
          id: 'step-b',
        },
      ],
      maxParallelSteps: 2,
    });

    engine.registerHandler('step-b', () => ({
      output: {
        selected: true,
      },
    }));

    const result = await engine.runSingleStep(
      'execution-single',
      'step-b',
    );

    expect(result.completedStepIds).toEqual([
      'step-b',
    ]);

    expect(
      result.execution.steps.find(
        (step) => step.id === 'step-a',
      )?.status,
    ).toBe('ready');
  });

  it('prevents concurrent engine runs for one execution', async () => {
    orchestrator.createExecution({
      executionId: 'execution-lock',
      workflowId: 'workflow-lock',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    let releaseHandler:
      | (() => void)
      | undefined;

    const blocker = new Promise<void>((resolve) => {
      releaseHandler = resolve;
    });

    engine.registerHandler('step-a', async () => {
      await blocker;

      return {
        output: {
          completed: true,
        },
      };
    });

    const running = engine.runExecution(
      'execution-lock',
    );

    await Promise.resolve();

    expect(
      engine.isExecutionRunning('execution-lock'),
    ).toBe(true);

    await expect(
      engine.runExecution('execution-lock'),
    ).rejects.toThrow('already running');

    releaseHandler?.();

    await running;

    expect(
      engine.isExecutionRunning('execution-lock'),
    ).toBe(false);
  });

  it('releases the execution lock after handler failure', async () => {
    orchestrator.createExecution({
      executionId: 'execution-lock-failure',
      workflowId: 'workflow-lock-failure',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    engine.registerHandler('step-a', () => {
      throw new Error('Permanent failure');
    });

    await engine.runExecution(
      'execution-lock-failure',
    );

    expect(
      engine.isExecutionRunning(
        'execution-lock-failure',
      ),
    ).toBe(false);
  });

  it('does not run paused executions', async () => {
    orchestrator.createExecution({
      executionId: 'execution-paused',
      workflowId: 'workflow-paused',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    orchestrator.pauseExecution(
      'execution-paused',
    );

    engine.registerHandler('step-a', jest.fn());

    const result = await engine.runExecution(
      'execution-paused',
    );

    expect(result.dispatchedStepIds).toEqual([]);
    expect(result.execution.status).toBe('paused');
  });

  it('validates maxSteps', async () => {
    orchestrator.createExecution({
      executionId: 'execution-invalid-limit',
      workflowId: 'workflow-invalid-limit',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    await expect(
      engine.runExecution(
        'execution-invalid-limit',
        {
          maxSteps: 0,
        },
      ),
    ).rejects.toThrow('positive integer');
  });
});
