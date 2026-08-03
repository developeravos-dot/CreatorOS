import { Test } from '@nestjs/testing';
import { WorkflowSchedulerService } from '../scheduler';
import { WorkflowStepOrchestratorService } from './workflow-step-orchestrator.service';

describe('WorkflowStepOrchestratorService', () => {
  let service: WorkflowStepOrchestratorService;
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
      ],
    }).compile();

    service = moduleRef.get(
      WorkflowStepOrchestratorService,
    );

    scheduler = moduleRef.get(
      WorkflowSchedulerService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates an execution and marks root steps ready', () => {
    const execution = service.createExecution({
      executionId: 'execution-1',
      workflowId: 'workflow-1',
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

    expect(execution.status).toBe('running');

    expect(execution.steps).toEqual([
      expect.objectContaining({
        id: 'step-a',
        status: 'ready',
      }),
      expect.objectContaining({
        id: 'step-b',
        status: 'waiting',
      }),
    ]);
  });

  it('rejects duplicate step identifiers', () => {
    expect(() =>
      service.createExecution({
        workflowId: 'workflow-duplicate',
        steps: [
          {
            id: 'same-step',
          },
          {
            id: 'same-step',
          },
        ],
      }),
    ).toThrow('Duplicate workflow step id');
  });

  it('rejects missing dependencies', () => {
    expect(() =>
      service.createExecution({
        workflowId: 'workflow-missing-dependency',
        steps: [
          {
            id: 'step-a',
            dependsOn: ['missing-step'],
          },
        ],
      }),
    ).toThrow('depends on missing step');
  });

  it('rejects dependency cycles', () => {
    expect(() =>
      service.createExecution({
        workflowId: 'workflow-cycle',
        steps: [
          {
            id: 'step-a',
            dependsOn: ['step-b'],
          },
          {
            id: 'step-b',
            dependsOn: ['step-a'],
          },
        ],
      }),
    ).toThrow('dependency cycle');
  });

  it('claims ready steps up to the parallel limit', () => {
    service.createExecution({
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
        {
          id: 'step-c',
        },
      ],
    });

    const dispatches = service.claimReadySteps(
      'execution-parallel',
    );

    expect(dispatches).toHaveLength(2);

    const execution = service.getExecution(
      'execution-parallel',
    );

    expect(execution.activeStepIds).toEqual([
      'step-a',
      'step-b',
    ]);

    expect(
      execution.steps.find(
        (step) => step.id === 'step-c',
      )?.status,
    ).toBe('ready');
  });

  it('completes a step and releases its dependent step', () => {
    service.createExecution({
      executionId: 'execution-chain',
      workflowId: 'workflow-chain',
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

    service.startStep('execution-chain', 'step-a');

    const result = service.completeStep(
      'execution-chain',
      'step-a',
      {
        result: 'completed',
        accessToken: 'must-not-leak',
      },
    );

    expect(result.step.status).toBe('completed');

    expect(result.step.output).toEqual({
      result: 'completed',
      accessToken: '[REDACTED]',
    });

    expect(
      result.execution.steps.find(
        (step) => step.id === 'step-b',
      )?.status,
    ).toBe('ready');
  });

  it('marks execution completed after all steps complete', () => {
    service.createExecution({
      executionId: 'execution-complete',
      workflowId: 'workflow-complete',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    service.startStep(
      'execution-complete',
      'step-a',
    );

    const result = service.completeStep(
      'execution-complete',
      'step-a',
    );

    expect(result.execution.status).toBe('completed');
    expect(result.execution.completedAt).toEqual(
      systemTime,
    );
  });

  it('schedules retry for retryable failure', () => {
    service.createExecution({
      executionId: 'execution-retry',
      workflowId: 'workflow-retry',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 3,
          retryDelayMs: 60_000,
        },
      ],
    });

    service.startStep('execution-retry', 'step-a');

    const result = service.failStep(
      'execution-retry',
      'step-a',
      {
        error: new Error('Temporary provider failure'),
        retryable: true,
        details: {
          apiKey: 'must-not-leak',
        },
      },
    );

    expect(result.step.status).toBe('waiting');
    expect(result.step.attempt).toBe(1);
    expect(result.retrySchedule).not.toBeNull();

    expect(result.retrySchedule).toEqual(
      expect.objectContaining({
        kind: 'retry',
        retryAttempt: 2,
        nextRunAt: new Date(
          systemTime.getTime() + 60_000,
        ),
      }),
    );

    expect(
      result.step.error?.details?.apiKey,
    ).toBe('[REDACTED]');
  });

  it('activates a scheduled retry when it becomes due', () => {
    service.createExecution({
      executionId: 'execution-due-retry',
      workflowId: 'workflow-due-retry',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 2,
          retryDelayMs: 30_000,
        },
      ],
    });

    service.startStep(
      'execution-due-retry',
      'step-a',
    );

    const failure = service.failStep(
      'execution-due-retry',
      'step-a',
      {
        error: 'Retry this step',
        retryable: true,
      },
    );

    const retrySchedule = failure.retrySchedule;

    expect(retrySchedule).not.toBeNull();

    jest.setSystemTime(
      new Date(systemTime.getTime() + 30_000),
    );

    const step = service.activateScheduledRetry(
      'execution-due-retry',
      'step-a',
      retrySchedule!.id,
    );

    expect(step.status).toBe('ready');
    expect(step.scheduledRetryId).toBeNull();

    expect(
      scheduler.getSchedule(retrySchedule!.id).status,
    ).toBe('completed');
  });

  it('does not activate retry before its due time', () => {
    service.createExecution({
      executionId: 'execution-early-retry',
      workflowId: 'workflow-early-retry',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 2,
          retryDelayMs: 30_000,
        },
      ],
    });

    service.startStep(
      'execution-early-retry',
      'step-a',
    );

    const result = service.failStep(
      'execution-early-retry',
      'step-a',
      {
        error: 'Retry later',
        retryable: true,
      },
    );

    expect(() =>
      service.activateScheduledRetry(
        'execution-early-retry',
        'step-a',
        result.retrySchedule!.id,
      ),
    ).toThrow('is not due yet');
  });

  it('fails permanently after maximum attempts', () => {
    service.createExecution({
      executionId: 'execution-max-attempts',
      workflowId: 'workflow-max-attempts',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 1,
          retryDelayMs: 1_000,
        },
      ],
    });

    service.startStep(
      'execution-max-attempts',
      'step-a',
    );

    const result = service.failStep(
      'execution-max-attempts',
      'step-a',
      {
        error: 'Permanent failure',
        retryable: true,
      },
    );

    expect(result.retrySchedule).toBeNull();
    expect(result.step.status).toBe('failed');
    expect(result.execution.status).toBe('failed');
  });

  it('skips dependent steps after blocking failure', () => {
    service.createExecution({
      executionId: 'execution-blocked',
      workflowId: 'workflow-blocked',
      steps: [
        {
          id: 'step-a',
        },
        {
          id: 'step-b',
          dependsOn: ['step-a'],
        },
        {
          id: 'step-c',
          dependsOn: ['step-b'],
        },
      ],
    });

    service.startStep(
      'execution-blocked',
      'step-a',
    );

    const result = service.failStep(
      'execution-blocked',
      'step-a',
      {
        error: 'Blocking failure',
      },
    );

    expect(result.execution.status).toBe('failed');

    expect(
      result.execution.steps.find(
        (step) => step.id === 'step-b',
      )?.status,
    ).toBe('skipped');

    expect(
      result.execution.steps.find(
        (step) => step.id === 'step-c',
      )?.status,
    ).toBe('skipped');
  });

  it('allows dependencies to continue after tolerated failure', () => {
    service.createExecution({
      executionId: 'execution-tolerated',
      workflowId: 'workflow-tolerated',
      steps: [
        {
          id: 'step-a',
          continueOnFailure: true,
        },
        {
          id: 'step-b',
          dependsOn: ['step-a'],
        },
      ],
    });

    service.startStep(
      'execution-tolerated',
      'step-a',
    );

    const result = service.failStep(
      'execution-tolerated',
      'step-a',
      {
        error: 'Non-blocking failure',
      },
    );

    expect(
      result.execution.steps.find(
        (step) => step.id === 'step-b',
      )?.status,
    ).toBe('ready');

    expect(result.execution.status).toBe('running');
  });

  it('pauses and resumes execution', () => {
    service.createExecution({
      executionId: 'execution-pause',
      workflowId: 'workflow-pause',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    const paused = service.pauseExecution(
      'execution-pause',
    );

    expect(paused.status).toBe('paused');

    expect(() =>
      service.claimReadySteps('execution-pause'),
    ).toThrow('is paused');

    const resumed = service.resumeExecution(
      'execution-pause',
    );

    expect(resumed.status).toBe('running');
  });

  it('cancels execution and pending retry schedules', () => {
    service.createExecution({
      executionId: 'execution-cancel',
      workflowId: 'workflow-cancel',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 2,
          retryDelayMs: 60_000,
        },
      ],
    });

    service.startStep(
      'execution-cancel',
      'step-a',
    );

    const failed = service.failStep(
      'execution-cancel',
      'step-a',
      {
        error: 'Retry pending',
        retryable: true,
      },
    );

    const retryScheduleId =
      failed.retrySchedule!.id;

    const cancelled = service.cancelExecution(
      'execution-cancel',
    );

    expect(cancelled.status).toBe('cancelled');

    expect(
      scheduler.getSchedule(retryScheduleId).status,
    ).toBe('cancelled');
  });

  it('sanitizes plural secret containers recursively', () => {
    const execution = service.createExecution({
      executionId: 'execution-secrets',
      workflowId: 'workflow-secrets',
      steps: [
        {
          id: 'step-a',
          input: {
            tokens: [
              {
                accessToken: 'secret-token',
                label: 'primary',
              },
            ],
            credentials: {
              username: 'workflow-user',
              password: 'workflow-password',
            },
          },
        },
      ],
    });

    expect(execution.steps[0]?.input).toEqual({
      tokens: [
        {
          accessToken: '[REDACTED]',
          label: 'primary',
        },
      ],
      credentials: {
        username: 'workflow-user',
        password: '[REDACTED]',
      },
    });
  });

  it('returns defensive execution copies', () => {
    const execution = service.createExecution({
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

    execution.steps[0]!.input.value = 'changed';

    expect(
      service.getExecution('execution-copy')
        .steps[0]?.input.value,
    ).toBe('original');
  });
});
