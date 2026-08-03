import { Test, TestingModule } from '@nestjs/testing';
import {
  WorkflowExecutionEngineService,
} from '../execution-engine';
import {
  WorkflowStepOrchestratorService,
} from '../orchestrator';
import {
  WorkflowSchedulerService,
} from '../scheduler';

describe('Workflow execution end-to-end integration', () => {
  let moduleRef: TestingModule;
  let scheduler: WorkflowSchedulerService;
  let orchestrator: WorkflowStepOrchestratorService;
  let engine: WorkflowExecutionEngineService;

  const initialTime = new Date(
    '2026-08-04T00:00:00.000Z',
  );

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(initialTime);

    moduleRef = await Test.createTestingModule({
      providers: [
        WorkflowSchedulerService,
        WorkflowStepOrchestratorService,
        WorkflowExecutionEngineService,
      ],
    }).compile();

    scheduler = moduleRef.get(
      WorkflowSchedulerService,
    );

    orchestrator = moduleRef.get(
      WorkflowStepOrchestratorService,
    );

    engine = moduleRef.get(
      WorkflowExecutionEngineService,
    );
  });

  afterEach(async () => {
    engine.clearHandlers();
    orchestrator.clear();
    scheduler.clear();

    await moduleRef.close();

    jest.useRealTimers();
  });

  it('executes a complete dependent workflow end to end', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-chain',
      workflowId: 'workflow-e2e-chain',
      maxParallelSteps: 1,
      steps: [
        {
          id: 'collect-data',
          input: {
            source: 'workflow-source',
          },
        },
        {
          id: 'transform-data',
          dependsOn: ['collect-data'],
        },
        {
          id: 'publish-result',
          dependsOn: ['transform-data'],
        },
      ],
    });

    const executionOrder: string[] = [];

    engine.registerHandler(
      'collect-data',
      async (context) => {
        executionOrder.push(context.stepId);

        expect(context.input).toEqual({
          source: 'workflow-source',
        });

        return {
          output: {
            records: 10,
          },
        };
      },
    );

    engine.registerHandler(
      'transform-data',
      async (context) => {
        executionOrder.push(context.stepId);

        expect(context.attempt).toBe(1);

        return {
          output: {
            transformedRecords: 10,
          },
        };
      },
    );

    engine.registerHandler(
      'publish-result',
      async (context) => {
        executionOrder.push(context.stepId);

        return {
          output: {
            publicationId: 'publication-1',
            accessToken: 'must-not-leak',
          },
        };
      },
    );

    const result = await engine.runExecution(
      'execution-e2e-chain',
    );

    expect(result.execution.status).toBe('completed');

    expect(result.dispatchedStepIds).toEqual([
      'collect-data',
      'transform-data',
      'publish-result',
    ]);

    expect(result.completedStepIds).toEqual([
      'collect-data',
      'transform-data',
      'publish-result',
    ]);

    expect(result.failedStepIds).toEqual([]);
    expect(result.retryScheduleIds).toEqual([]);

    expect(executionOrder).toEqual([
      'collect-data',
      'transform-data',
      'publish-result',
    ]);

    const finalExecution = orchestrator.getExecution(
      'execution-e2e-chain',
    );

    expect(
      finalExecution.steps.find(
        (step) => step.id === 'publish-result',
      )?.output,
    ).toEqual({
      publicationId: 'publication-1',
      accessToken: '[REDACTED]',
    });
  });

  it('executes parallel branches before their shared dependent step', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-parallel',
      workflowId: 'workflow-e2e-parallel',
      maxParallelSteps: 2,
      steps: [
        {
          id: 'prepare-a',
        },
        {
          id: 'prepare-b',
        },
        {
          id: 'combine',
          dependsOn: ['prepare-a', 'prepare-b'],
        },
      ],
    });

    const invokedSteps: string[] = [];

    engine.registerHandler('prepare-a', async () => {
      invokedSteps.push('prepare-a');

      return {
        output: {
          branch: 'a',
        },
      };
    });

    engine.registerHandler('prepare-b', async () => {
      invokedSteps.push('prepare-b');

      return {
        output: {
          branch: 'b',
        },
      };
    });

    engine.registerHandler('combine', async () => {
      invokedSteps.push('combine');

      const execution = orchestrator.getExecution(
        'execution-e2e-parallel',
      );

      expect(
        execution.steps.find(
          (step) => step.id === 'prepare-a',
        )?.status,
      ).toBe('completed');

      expect(
        execution.steps.find(
          (step) => step.id === 'prepare-b',
        )?.status,
      ).toBe('completed');

      return {
        output: {
          combined: true,
        },
      };
    });

    const result = await engine.runExecution(
      'execution-e2e-parallel',
    );

    expect(result.execution.status).toBe('completed');

    expect(
      invokedSteps.slice(0, 2).sort(),
    ).toEqual(['prepare-a', 'prepare-b']);

    expect(invokedSteps[2]).toBe('combine');
  });

  it('schedules a retry and resumes execution after the delay', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-retry',
      workflowId: 'workflow-e2e-retry',
      maxParallelSteps: 1,
      steps: [
        {
          id: 'unstable-provider',
          maxAttempts: 3,
          retryDelayMs: 30_000,
        },
        {
          id: 'finalize',
          dependsOn: ['unstable-provider'],
        },
      ],
    });

    let providerAttempts = 0;

    engine.registerHandler(
      'unstable-provider',
      async (context) => {
        providerAttempts += 1;

        if (context.attempt === 1) {
          throw Object.assign(
            new Error('Temporary provider outage'),
            {
              retryable: true,
              code: 'TEMPORARY_PROVIDER_OUTAGE',
              details: {
                apiKey: 'must-not-leak',
                provider: 'integration-provider',
              },
            },
          );
        }

        return {
          output: {
            recovered: true,
          },
        };
      },
    );

    engine.registerHandler('finalize', async () => ({
      output: {
        finalized: true,
      },
    }));

    const firstRun = await engine.runExecution(
      'execution-e2e-retry',
    );

    expect(firstRun.execution.status).toBe('running');
    expect(firstRun.completedStepIds).toEqual([]);
    expect(firstRun.failedStepIds).toEqual([
      'unstable-provider',
    ]);
    expect(firstRun.retryScheduleIds).toHaveLength(1);

    const retryScheduleId =
      firstRun.retryScheduleIds[0]!;

    const retrySchedule =
      scheduler.getSchedule(retryScheduleId);

    expect(retrySchedule.kind).toBe('retry');
    expect(retrySchedule.status).toBe('scheduled');
    expect(retrySchedule.retryAttempt).toBe(2);

    expect(retrySchedule.nextRunAt).toEqual(
      new Date(initialTime.getTime() + 30_000),
    );

    const waitingExecution = orchestrator.getExecution(
      'execution-e2e-retry',
    );

    const waitingStep = waitingExecution.steps.find(
      (step) => step.id === 'unstable-provider',
    );

    expect(waitingStep?.status).toBe('waiting');

    expect(
      waitingStep?.error?.details?.apiKey,
    ).toBe('[REDACTED]');

    expect(
      waitingExecution.steps.find(
        (step) => step.id === 'finalize',
      )?.status,
    ).toBe('waiting');

    jest.setSystemTime(
      new Date(initialTime.getTime() + 29_999),
    );

    expect(
      engine.activateDueRetrySchedules(),
    ).toEqual([]);

    jest.setSystemTime(
      new Date(initialTime.getTime() + 30_000),
    );

    const activations =
      engine.activateDueRetrySchedules();

    expect(activations).toHaveLength(1);

    expect(activations[0]).toEqual(
      expect.objectContaining({
        schedule: expect.objectContaining({
          id: retryScheduleId,
          status: 'completed',
        }),
        step: expect.objectContaining({
          id: 'unstable-provider',
          status: 'ready',
        }),
      }),
    );

    const secondRun = await engine.runExecution(
      'execution-e2e-retry',
    );

    expect(secondRun.execution.status).toBe('completed');

    expect(secondRun.completedStepIds).toEqual([
      'unstable-provider',
      'finalize',
    ]);

    expect(providerAttempts).toBe(2);

    expect(
      secondRun.execution.steps.find(
        (step) => step.id === 'unstable-provider',
      )?.attempt,
    ).toBe(2);
  });

  it('fails permanently and skips the dependent branch', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-failure',
      workflowId: 'workflow-e2e-failure',
      steps: [
        {
          id: 'critical-step',
          maxAttempts: 1,
        },
        {
          id: 'dependent-step',
          dependsOn: ['critical-step'],
        },
        {
          id: 'nested-dependent-step',
          dependsOn: ['dependent-step'],
        },
      ],
    });

    engine.registerHandler('critical-step', async () => {
      throw new Error('Permanent critical failure');
    });

    engine.registerHandler(
      'dependent-step',
      async () => ({
        output: {
          shouldNotRun: true,
        },
      }),
    );

    engine.registerHandler(
      'nested-dependent-step',
      async () => ({
        output: {
          shouldNotRun: true,
        },
      }),
    );

    const result = await engine.runExecution(
      'execution-e2e-failure',
    );

    expect(result.execution.status).toBe('failed');

    expect(result.failedStepIds).toEqual([
      'critical-step',
    ]);

    expect(
      result.execution.steps.find(
        (step) => step.id === 'critical-step',
      )?.status,
    ).toBe('failed');

    expect(
      result.execution.steps.find(
        (step) => step.id === 'dependent-step',
      )?.status,
    ).toBe('skipped');

    expect(
      result.execution.steps.find(
        (step) =>
          step.id === 'nested-dependent-step',
      )?.status,
    ).toBe('skipped');
  });

  it('continues after a non-blocking failure', async () => {
    orchestrator.createExecution({
      executionId:
        'execution-e2e-continue-on-failure',
      workflowId:
        'workflow-e2e-continue-on-failure',
      steps: [
        {
          id: 'optional-step',
          continueOnFailure: true,
        },
        {
          id: 'required-after-optional',
          dependsOn: ['optional-step'],
        },
      ],
    });

    engine.registerHandler(
      'optional-step',
      async () => {
        throw new Error('Optional step failure');
      },
    );

    engine.registerHandler(
      'required-after-optional',
      async () => ({
        output: {
          completedAfterFailure: true,
        },
      }),
    );

    const result = await engine.runExecution(
      'execution-e2e-continue-on-failure',
    );

    expect(result.execution.status).toBe('completed');

    expect(
      result.execution.steps.find(
        (step) => step.id === 'optional-step',
      )?.status,
    ).toBe('failed');

    expect(
      result.execution.steps.find(
        (step) =>
          step.id === 'required-after-optional',
      )?.status,
    ).toBe('completed');
  });

  it('pauses execution before dispatch and resumes safely', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-pause',
      workflowId: 'workflow-e2e-pause',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    const handler = jest.fn(async () => ({
      output: {
        completed: true,
      },
    }));

    engine.registerHandler('step-a', handler);

    orchestrator.pauseExecution(
      'execution-e2e-pause',
    );

    const pausedRun = await engine.runExecution(
      'execution-e2e-pause',
    );

    expect(pausedRun.execution.status).toBe('paused');
    expect(pausedRun.dispatchedStepIds).toEqual([]);
    expect(handler).not.toHaveBeenCalled();

    orchestrator.resumeExecution(
      'execution-e2e-pause',
    );

    const resumedRun = await engine.runExecution(
      'execution-e2e-pause',
    );

    expect(resumedRun.execution.status).toBe(
      'completed',
    );

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('cancels a workflow with a pending retry', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-cancel',
      workflowId: 'workflow-e2e-cancel',
      steps: [
        {
          id: 'retrying-step',
          maxAttempts: 2,
          retryDelayMs: 60_000,
        },
        {
          id: 'dependent-step',
          dependsOn: ['retrying-step'],
        },
      ],
    });

    engine.registerHandler(
      'retrying-step',
      async () => {
        throw Object.assign(
          new Error('Retry pending'),
          {
            retryable: true,
          },
        );
      },
    );

    const firstRun = await engine.runExecution(
      'execution-e2e-cancel',
    );

    const retryScheduleId =
      firstRun.retryScheduleIds[0]!;

    expect(
      scheduler.getSchedule(retryScheduleId).status,
    ).toBe('scheduled');

    const cancelled =
      orchestrator.cancelExecution(
        'execution-e2e-cancel',
      );

    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.activeStepIds).toEqual([]);

    expect(
      scheduler.getSchedule(retryScheduleId).status,
    ).toBe('cancelled');

    expect(
      cancelled.steps.every(
        (step) =>
          step.status === 'cancelled' ||
          step.status === 'completed' ||
          step.status === 'failed' ||
          step.status === 'skipped',
      ),
    ).toBe(true);
  });

  it('keeps workflow state isolated between executions', async () => {
    orchestrator.createExecution({
      executionId: 'execution-isolation-a',
      workflowId: 'workflow-shared',
      steps: [
        {
          id: 'shared-step',
          input: {
            execution: 'a',
          },
        },
      ],
    });

    orchestrator.createExecution({
      executionId: 'execution-isolation-b',
      workflowId: 'workflow-shared',
      steps: [
        {
          id: 'shared-step',
          input: {
            execution: 'b',
          },
        },
      ],
    });

    const receivedInputs: string[] = [];

    engine.registerHandler(
      'shared-step',
      async (context) => {
        receivedInputs.push(
          String(context.input.execution),
        );

        return {
          output: {
            execution: context.input.execution,
          },
        };
      },
    );

    const resultA = await engine.runExecution(
      'execution-isolation-a',
    );

    const resultB = await engine.runExecution(
      'execution-isolation-b',
    );

    expect(resultA.execution.status).toBe(
      'completed',
    );

    expect(resultB.execution.status).toBe(
      'completed',
    );

    expect(receivedInputs).toEqual(['a', 'b']);

    expect(
      resultA.execution.steps[0]?.output,
    ).toEqual({
      execution: 'a',
    });

    expect(
      resultB.execution.steps[0]?.output,
    ).toEqual({
      execution: 'b',
    });
  });

  it('supports stopping and continuing through maxSteps boundaries', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-bounded',
      workflowId: 'workflow-e2e-bounded',
      steps: [
        {
          id: 'step-1',
        },
        {
          id: 'step-2',
          dependsOn: ['step-1'],
        },
        {
          id: 'step-3',
          dependsOn: ['step-2'],
        },
      ],
    });

    for (const stepId of [
      'step-1',
      'step-2',
      'step-3',
    ]) {
      engine.registerHandler(stepId, async () => ({
        output: {
          stepId,
        },
      }));
    }

    const firstRun = await engine.runExecution(
      'execution-e2e-bounded',
      {
        maxSteps: 1,
      },
    );

    expect(firstRun.execution.status).toBe('running');
    expect(firstRun.completedStepIds).toEqual([
      'step-1',
    ]);

    const secondRun = await engine.runExecution(
      'execution-e2e-bounded',
      {
        maxSteps: 1,
      },
    );

    expect(secondRun.execution.status).toBe('running');
    expect(secondRun.completedStepIds).toEqual([
      'step-2',
    ]);

    const thirdRun = await engine.runExecution(
      'execution-e2e-bounded',
      {
        maxSteps: 1,
      },
    );

    expect(thirdRun.execution.status).toBe(
      'completed',
    );

    expect(thirdRun.completedStepIds).toEqual([
      'step-3',
    ]);
  });

  it('sanitizes secrets throughout input, metadata, errors and output', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-secrets',
      workflowId: 'workflow-e2e-secrets',
      steps: [
        {
          id: 'secret-step',
          maxAttempts: 2,
          retryDelayMs: 1_000,
          input: {
            apiKey: 'input-secret',
            tokens: [
              {
                accessToken: 'nested-input-secret',
                label: 'primary',
              },
            ],
          },
          metadata: {
            credentials: {
              username: 'workflow-user',
              password: 'metadata-secret',
            },
          },
        },
      ],
    });

    let attempts = 0;

    engine.registerHandler(
      'secret-step',
      async (context) => {
        attempts += 1;

        expect(context.input).toEqual({
          apiKey: '[REDACTED]',
          tokens: [
            {
              accessToken: '[REDACTED]',
              label: 'primary',
            },
          ],
        });

        expect(context.metadata).toEqual({
          credentials: {
            username: 'workflow-user',
            password: '[REDACTED]',
          },
        });

        if (attempts === 1) {
          throw Object.assign(
            new Error('Sanitized retry'),
            {
              retryable: true,
              details: {
                privateKey: 'error-secret',
                safeValue: 'visible',
              },
            },
          );
        }

        return {
          output: {
            authorization: 'output-secret',
            publicValue: 'visible',
          },
        };
      },
    );

    const firstRun = await engine.runExecution(
      'execution-e2e-secrets',
    );

    const failedStep =
      firstRun.execution.steps[0];

    expect(
      failedStep?.error?.details,
    ).toEqual({
      privateKey: '[REDACTED]',
      safeValue: 'visible',
    });

    jest.setSystemTime(
      new Date(initialTime.getTime() + 1_000),
    );

    engine.activateDueRetrySchedules();

    const secondRun = await engine.runExecution(
      'execution-e2e-secrets',
    );

    expect(secondRun.execution.status).toBe(
      'completed',
    );

    expect(
      secondRun.execution.steps[0]?.output,
    ).toEqual({
      authorization: '[REDACTED]',
      publicValue: 'visible',
    });
  });

  it('returns defensive copies from the integrated workflow services', async () => {
    orchestrator.createExecution({
      executionId: 'execution-e2e-copy',
      workflowId: 'workflow-e2e-copy',
      steps: [
        {
          id: 'copy-step',
          input: {
            nested: {
              value: 'original',
            },
          },
        },
      ],
    });

    const retrieved = orchestrator.getExecution(
      'execution-e2e-copy',
    );

    (
      retrieved.steps[0]?.input.nested as
        | Record<string, unknown>
        | undefined
    )!.value = 'mutated';

    const secondRead = orchestrator.getExecution(
      'execution-e2e-copy',
    );

    expect(
      (
        secondRead.steps[0]?.input.nested as
          | Record<string, unknown>
          | undefined
      )?.value,
    ).toBe('original');

    engine.registerHandler('copy-step', async () => ({
      output: {
        completed: true,
      },
    }));

    const result = await engine.runExecution(
      'execution-e2e-copy',
    );

    result.execution.steps[0]!.output!.completed =
      false;

    expect(
      orchestrator.getExecution(
        'execution-e2e-copy',
      ).steps[0]?.output,
    ).toEqual({
      completed: true,
    });
  });
});
