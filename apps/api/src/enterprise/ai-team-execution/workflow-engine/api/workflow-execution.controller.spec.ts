import {
  BadRequestException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  WorkflowExecutionEngineService,
} from '../execution-engine';
import {
  WorkflowStepOrchestratorService,
} from '../orchestrator';
import {
  WorkflowSchedulerService,
} from '../scheduler';
import {
  WorkflowExecutionController,
} from './workflow-execution.controller';
import {
  WorkflowExecutionModule,
} from './workflow-execution.module';

describe('WorkflowExecutionController', () => {
  let moduleRef: TestingModule;
  let controller: WorkflowExecutionController;
  let orchestrator:
    WorkflowStepOrchestratorService;
  let engine: WorkflowExecutionEngineService;
  let scheduler: WorkflowSchedulerService;

  const systemTime = new Date(
    '2026-08-04T00:00:00.000Z',
  );

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(systemTime);

    moduleRef = await Test.createTestingModule({
      imports: [WorkflowExecutionModule],
    }).compile();

    controller = moduleRef.get(
      WorkflowExecutionController,
    );

    orchestrator = moduleRef.get(
      WorkflowStepOrchestratorService,
    );

    engine = moduleRef.get(
      WorkflowExecutionEngineService,
    );

    scheduler = moduleRef.get(
      WorkflowSchedulerService,
    );
  });

  afterEach(async () => {
    engine.clearHandlers();
    orchestrator.clear();
    scheduler.clear();

    await moduleRef.close();

    jest.useRealTimers();
  });

  it('compiles through WorkflowExecutionModule', () => {
    expect(controller).toBeDefined();
    expect(orchestrator).toBeDefined();
    expect(engine).toBeDefined();
    expect(scheduler).toBeDefined();
  });

  it('creates and retrieves an execution', () => {
    const created = controller.createExecution({
      executionId: 'controller-execution',
      workflowId: 'controller-workflow',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    expect(created).toEqual(
      expect.objectContaining({
        id: 'controller-execution',
        workflowId: 'controller-workflow',
        status: 'running',
      }),
    );

    expect(
      controller.getExecution(
        'controller-execution',
      ),
    ).toEqual(created);
  });

  it('lists executions by workflow id', () => {
    controller.createExecution({
      executionId: 'execution-a',
      workflowId: 'workflow-a',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    controller.createExecution({
      executionId: 'execution-b',
      workflowId: 'workflow-b',
      steps: [
        {
          id: 'step-b',
        },
      ],
    });

    expect(
      controller.listExecutions('workflow-a'),
    ).toHaveLength(1);

    expect(
      controller.listExecutions('workflow-a')[0]
        ?.id,
    ).toBe('execution-a');
  });

  it('runs a workflow through the controller', async () => {
    controller.createExecution({
      executionId: 'execution-run',
      workflowId: 'workflow-run',
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

    engine.registerHandler('step-a', async () => ({
      output: {
        first: true,
      },
    }));

    engine.registerHandler('step-b', async () => ({
      output: {
        second: true,
      },
    }));

    const result = await controller.runExecution(
      'execution-run',
      {},
    );

    expect(result.execution.status).toBe(
      'completed',
    );

    expect(result.completedStepIds).toEqual([
      'step-a',
      'step-b',
    ]);
  });

  it('runs one selected workflow step', async () => {
    controller.createExecution({
      executionId: 'execution-single',
      workflowId: 'workflow-single',
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

    engine.registerHandler('step-b', () => ({
      output: {
        selected: true,
      },
    }));

    const result = await controller.runSingleStep(
      'execution-single',
      'step-b',
    );

    expect(result.completedStepIds).toEqual([
      'step-b',
    ]);
  });

  it('pauses and resumes an execution', () => {
    controller.createExecution({
      executionId: 'execution-pause',
      workflowId: 'workflow-pause',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    expect(
      controller.pauseExecution(
        'execution-pause',
      ).status,
    ).toBe('paused');

    expect(
      controller.resumeExecution(
        'execution-pause',
      ).status,
    ).toBe('running');
  });

  it('cancels an execution', () => {
    controller.createExecution({
      executionId: 'execution-cancel',
      workflowId: 'workflow-cancel',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    const cancelled =
      controller.cancelExecution(
        'execution-cancel',
      );

    expect(cancelled.status).toBe('cancelled');

    expect(cancelled.steps[0]?.status).toBe(
      'cancelled',
    );
  });

  it('skips a workflow step with a reason', () => {
    controller.createExecution({
      executionId: 'execution-skip',
      workflowId: 'workflow-skip',
      steps: [
        {
          id: 'optional-step',
        },
      ],
    });

    const skipped = controller.skipStep(
      'execution-skip',
      'optional-step',
      {
        reason: 'Not required for this execution.',
      },
    );

    expect(skipped.status).toBe('skipped');

    expect(skipped.error?.message).toBe(
      'Not required for this execution.',
    );
  });

  it('creates all supported schedule types', () => {
    const immediate =
      controller.createImmediateSchedule({
        workflowId: 'workflow-immediate',
      });

    const delayed =
      controller.createDelayedSchedule({
        workflowId: 'workflow-delayed',
        runAt: new Date(
          systemTime.getTime() + 60_000,
        ),
      });

    const cron = controller.createCronSchedule({
      workflowId: 'workflow-cron',
      cronExpression: '0 * * * *',
    });

    const recurring =
      controller.createRecurringSchedule({
        workflowId: 'workflow-recurring',
        intervalMs: 60_000,
      });

    const retry =
      controller.createRetrySchedule({
        workflowId: 'workflow-retry',
        retryAttempt: 2,
        retryDelayMs: 30_000,
      });

    expect(immediate.kind).toBe('immediate');
    expect(delayed.kind).toBe('delayed');
    expect(cron.kind).toBe('cron');
    expect(recurring.kind).toBe('recurring');
    expect(retry.kind).toBe('retry');
  });

  it('lists and controls schedules', () => {
    const schedule =
      controller.createRecurringSchedule({
        workflowId: 'workflow-schedule-control',
        intervalMs: 60_000,
      });

    expect(
      controller.getSchedule(schedule.id).id,
    ).toBe(schedule.id);

    expect(
      controller.pauseSchedule(schedule.id).status,
    ).toBe('paused');

    expect(
      controller.resumeSchedule(schedule.id).status,
    ).toBe('scheduled');

    expect(
      controller.cancelSchedule(schedule.id)
        .status,
    ).toBe('cancelled');
  });

  it('filters schedules by workflow id', () => {
    controller.createImmediateSchedule({
      workflowId: 'workflow-a',
    });

    controller.createImmediateSchedule({
      workflowId: 'workflow-b',
    });

    expect(
      controller.listSchedules('workflow-a'),
    ).toHaveLength(1);
  });

  it('lists due schedules using an ISO timestamp', () => {
    const schedule =
      controller.createImmediateSchedule({
        workflowId: 'workflow-due',
      });

    const due = controller.listDueSchedules(
      systemTime.toISOString(),
    );

    expect(due).toEqual([
      expect.objectContaining({
        id: schedule.id,
      }),
    ]);
  });

  it('rejects invalid schedule query dates', () => {
    expect(() =>
      controller.listDueSchedules(
        'not-a-valid-date',
      ),
    ).toThrow(BadRequestException);
  });

  it('activates due retries through the API', async () => {
    controller.createExecution({
      executionId: 'execution-retry',
      workflowId: 'workflow-retry',
      steps: [
        {
          id: 'step-a',
          maxAttempts: 2,
          retryDelayMs: 10_000,
        },
      ],
    });

    engine.registerHandler('step-a', () => {
      throw Object.assign(
        new Error('Temporary failure'),
        {
          retryable: true,
        },
      );
    });

    const firstRun =
      await controller.runExecution(
        'execution-retry',
        {},
      );

    expect(
      firstRun.retryScheduleIds,
    ).toHaveLength(1);

    jest.setSystemTime(
      new Date(systemTime.getTime() + 10_000),
    );

    const activated =
      controller.activateDueRetries();

    expect(activated).toHaveLength(1);
    expect(activated[0]?.step.status).toBe(
      'ready',
    );
  });

  it('runs due ready executions', async () => {
    controller.createExecution({
      executionId: 'execution-due-run',
      workflowId: 'workflow-due-run',
      steps: [
        {
          id: 'step-a',
        },
      ],
    });

    engine.registerHandler('step-a', () => ({
      output: {
        executed: true,
      },
    }));

    const results =
      await controller.runDueExecutions(
        systemTime.toISOString(),
        {},
      );

    expect(results).toHaveLength(1);

    expect(results[0]?.execution.status).toBe(
      'completed',
    );
  });

  it('preserves secret sanitization through controller responses', async () => {
    controller.createExecution({
      executionId: 'execution-secrets',
      workflowId: 'workflow-secrets',
      steps: [
        {
          id: 'step-a',
          input: {
            credentials: {
              username: 'workflow-user',
              password: 'must-not-leak',
            },
          },
        },
      ],
    });

    engine.registerHandler('step-a', () => ({
      output: {
        accessToken: 'must-not-leak',
        publicValue: 'visible',
      },
    }));

    const result = await controller.runExecution(
      'execution-secrets',
      {},
    );

    expect(
      result.execution.steps[0]?.input,
    ).toEqual({
      credentials: {
        username: 'workflow-user',
        password: '[REDACTED]',
      },
    });

    expect(
      result.execution.steps[0]?.output,
    ).toEqual({
      accessToken: '[REDACTED]',
      publicValue: 'visible',
    });
  });
});
