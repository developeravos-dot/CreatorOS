import {
  JobStateMachineService,
} from './job-state-machine.service';

describe(
  'JobStateMachineService',
  () => {
    let service:
      JobStateMachineService;

    beforeEach(() => {
      service =
        new JobStateMachineService();
    });

    it(
      'returns allowed transitions',
      () => {
        expect(
          service.getAllowedTransitions(
            'draft',
          ),
        ).toEqual([
          'scheduled',
          'queued',
          'delayed',
          'cancelled',
        ]);

        expect(
          service.getAllowedTransitions(
            'completed',
          ),
        ).toEqual([]);
      },
    );

    it(
      'allows valid transitions',
      () => {
        expect(
          service.canTransition(
            'draft',
            'queued',
          ),
        ).toBe(true);

        expect(
          service.canTransition(
            'queued',
            'running',
          ),
        ).toBe(true);

        expect(
          service.canTransition(
            'running',
            'completed',
          ),
        ).toBe(true);

        expect(
          service.canTransition(
            'draft',
            'delayed',
          ),
        ).toBe(true);

        expect(
          service.canTransition(
            'scheduled',
            'delayed',
          ),
        ).toBe(true);

        expect(
          service.canTransition(
            'waiting',
            'delayed',
          ),
        ).toBe(true);

        expect(
          service.canTransition(
            'failed',
            'retry_scheduled',
          ),
        ).toBe(true);
      },
    );

    it(
      'rejects invalid transitions',
      () => {
        expect(
          service.canTransition(
            'draft',
            'completed',
          ),
        ).toBe(false);

        expect(
          service.canTransition(
            'completed',
            'queued',
          ),
        ).toBe(false);

        expect(
          service.canTransition(
            'running',
            'running',
          ),
        ).toBe(false);
      },
    );

    it(
      'protects terminal states',
      () => {
        const decision =
          service.evaluateTransition(
            'completed',
            'queued',
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
      'throws for invalid transitions',
      () => {
        expect(() =>
          service.assertTransition(
            'draft',
            'completed',
          ),
        ).toThrow(
          'not allowed',
        );

        expect(() =>
          service.assertTransition(
            'queued',
            'running',
          ),
        ).not.toThrow();
      },
    );

    it(
      'evaluates pause resume cancel and retry operations',
      () => {
        expect(
          service.canPause(
            'running',
          ),
        ).toBe(true);

        expect(
          service.canResume(
            'paused',
          ),
        ).toBe(true);

        expect(
          service.canCancel(
            'queued',
          ),
        ).toBe(true);

        expect(
          service.canRetry(
            'failed',
          ),
        ).toBe(true);

        expect(
          service.canRetry(
            'completed',
          ),
        ).toBe(false);
      },
    );

    it(
      'evaluates start complete and failure rules',
      () => {
        expect(
          service.canStart(
            'queued',
          ),
        ).toBe(true);

        expect(
          service.canStart(
            'draft',
          ),
        ).toBe(false);

        expect(
          service.canComplete(
            'running',
          ),
        ).toBe(true);

        expect(
          service.canFail(
            'running',
          ),
        ).toBe(true);

        expect(
          service.canComplete(
            'queued',
          ),
        ).toBe(false);
      },
    );

    it(
      'resolves resume target state',
      () => {
        expect(
          service.resolveResumeTarget(
            'scheduled',
          ),
        ).toBe('scheduled');

        expect(
          service.resolveResumeTarget(
            'delayed',
          ),
        ).toBe('delayed');

        expect(
          service.resolveResumeTarget(),
        ).toBe('queued');
      },
    );
  },
);