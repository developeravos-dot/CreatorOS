import {
  WorkflowStateMachineService,
} from './workflow-state-machine.service';

describe(
  'WorkflowStateMachineService',
  () => {
    let service:
      WorkflowStateMachineService;

    beforeEach(() => {
      service =
        new WorkflowStateMachineService();
    });

    it(
      'returns workflow transitions',
      () => {
        expect(
          service.getAllowedWorkflowTransitions(
            'draft',
          ),
        ).toEqual([
          'published',
          'archived',
        ]);

        expect(
          service.getAllowedWorkflowTransitions(
            'archived',
          ),
        ).toEqual([]);
      },
    );

    it(
      'supports workflow lifecycle rules',
      () => {
        expect(
          service.canPublish(
            'draft',
          ),
        ).toBe(true);

        expect(
          service.canActivate(
            'published',
          ),
        ).toBe(true);

        expect(
          service.canPauseWorkflow(
            'active',
          ),
        ).toBe(true);

        expect(
          service.canResumeWorkflow(
            'paused',
          ),
        ).toBe(true);

        expect(
          service.canArchive(
            'active',
          ),
        ).toBe(true);
      },
    );

    it(
      'protects terminal workflow states',
      () => {
        const decision =
          service.evaluateWorkflowTransition(
            'archived',
            'active',
          );

        expect(
          decision.allowed,
        ).toBe(false);

        expect(
          decision.reason,
        ).toContain(
          'Terminal',
        );
      },
    );

    it(
      'supports execution lifecycle rules',
      () => {
        expect(
          service.canStartExecution(
            'pending',
          ),
        ).toBe(true);

        expect(
          service.canPauseExecution(
            'running',
          ),
        ).toBe(true);

        expect(
          service.canResumeExecution(
            'paused',
          ),
        ).toBe(true);

        expect(
          service.canCompleteExecution(
            'running',
          ),
        ).toBe(true);

        expect(
          service.canFailExecution(
            'waiting',
          ),
        ).toBe(true);

        expect(
          service.canCancelExecution(
            'queued',
          ),
        ).toBe(true);

        expect(
          service.canRetryExecution(
            'failed',
          ),
        ).toBe(true);
      },
    );

    it(
      'supports step lifecycle rules',
      () => {
        expect(
          service.canQueueStep(
            'ready',
          ),
        ).toBe(true);

        expect(
          service.canStartStep(
            'queued',
          ),
        ).toBe(true);

        expect(
          service.canCompleteStep(
            'running',
          ),
        ).toBe(true);

        expect(
          service.canFailStep(
            'waiting',
          ),
        ).toBe(true);

        expect(
          service.canSkipStep(
            'pending',
          ),
        ).toBe(true);

        expect(
          service.canRetryStep(
            'timed_out',
          ),
        ).toBe(true);
      },
    );

    it(
      'rejects invalid transitions',
      () => {
        expect(
          service.canTransitionWorkflow(
            'draft',
            'active',
          ),
        ).toBe(false);

        expect(
          service.canTransitionExecution(
            'completed',
            'running',
          ),
        ).toBe(false);

        expect(
          service.canTransitionStep(
            'skipped',
            'running',
          ),
        ).toBe(false);
      },
    );

    it(
      'throws for invalid transitions',
      () => {
        expect(() =>
          service.assertWorkflowTransition(
            'draft',
            'active',
          ),
        ).toThrow(
          'not allowed',
        );

        expect(() =>
          service.assertExecutionTransition(
            'queued',
            'running',
          ),
        ).not.toThrow();

        expect(() =>
          service.assertStepTransition(
            'running',
            'completed',
          ),
        ).not.toThrow();
      },
    );
  },
);