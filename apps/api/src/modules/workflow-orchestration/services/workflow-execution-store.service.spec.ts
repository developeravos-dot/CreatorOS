import type {
  WorkflowExecution,
} from '../models';
import {
  WorkflowExecutionStoreService,
} from './workflow-execution-store.service';

describe(
  'WorkflowExecutionStoreService',
  () => {
    const now =
      '2026-08-07T10:00:00.000Z';

    function createExecution(
      id =
        'execution-one',
      workflowId =
        'workflow-one',
    ): WorkflowExecution {
      return {
        id,
        workflowId,
        workflowVersion: 1,
        state:
          'running',
        currentStepIds: [
          'step-one',
        ],
        completedStepIds: [],
        failedStepIds: [],
        skippedStepIds: [],
        stepExecutions: [],
        context: {
          variables: {},
          input: {},
          output: {},
          metadata: {},
          correlation: {},
        },
        trigger: {
          id:
            'trigger-one',
          type:
            'manual',
          enabled: true,
          configuration: {},
        },
        correlation: {},
        createdAt: now,
        updatedAt: now,
      };
    }

    it(
      'creates and retrieves executions',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        const created =
          service.create(
            createExecution(),
          );

        expect(created.id)
          .toBe(
            'execution-one',
          );

        expect(
          service.getById(
            'execution-one',
          )?.workflowId,
        ).toBe(
          'workflow-one',
        );

        expect(service.count())
          .toBe(1);
      },
    );

    it(
      'rejects duplicate execution identifiers',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(),
        );

        expect(() =>
          service.create(
            createExecution(),
          ),
        ).toThrow(
          'already exists',
        );
      },
    );

    it(
      'throws when requiring a missing execution',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        expect(() =>
          service.require(
            'missing',
          ),
        ).toThrow(
          'was not found',
        );
      },
    );

    it(
      'lists executions by workflow and state',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(
            'execution-one',
            'workflow-one',
          ),
        );

        service.create({
          ...createExecution(
            'execution-two',
            'workflow-two',
          ),
          state: 'paused',
        });

        expect(
          service.listByWorkflow(
            'workflow-one',
          ),
        ).toHaveLength(1);

        expect(
          service.listByState([
            'paused',
          ]),
        ).toHaveLength(1);

        expect(
          service.listActive(),
        ).toHaveLength(2);
      },
    );

    it(
      'adds and replaces step executions',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(),
        );

        service.replaceStepExecution(
          'execution-one',
          {
            id:
              'step-execution-one',
            workflowExecutionId:
              'execution-one',
            stepId:
              'step-one',
            state:
              'running',
            attemptNumber: 1,
            input: {},
            output: {},
          },
        );

        expect(
          service.getStepExecutions(
            'execution-one',
          ),
        ).toHaveLength(1);

        service.replaceStepExecution(
          'execution-one',
          {
            id:
              'step-execution-one',
            workflowExecutionId:
              'execution-one',
            stepId:
              'step-one',
            state:
              'completed',
            attemptNumber: 1,
            input: {},
            output: {
              successful: true,
            },
          },
        );

        const latest =
          service
            .getLatestStepExecution(
              'execution-one',
              'step-one',
            );

        expect(latest?.state)
          .toBe('completed');

        expect(
          latest?.output
            .successful,
        ).toBe(true);

        expect(
          service.getStepExecutions(
            'execution-one',
          ),
        ).toHaveLength(1);
      },
    );

    it(
      'returns the latest attempt state for every step',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(),
        );

        service.replaceStepExecution(
          'execution-one',
          {
            id: 'attempt-one',
            workflowExecutionId:
              'execution-one',
            stepId:
              'step-one',
            state: 'failed',
            attemptNumber: 1,
            input: {},
            output: {},
          },
        );

        service.replaceStepExecution(
          'execution-one',
          {
            id: 'attempt-two',
            workflowExecutionId:
              'execution-one',
            stepId:
              'step-one',
            state: 'running',
            attemptNumber: 2,
            input: {},
            output: {},
          },
        );

        expect(
          service.getStepStates(
            'execution-one',
          ),
        ).toEqual({
          'step-one':
            'running',
        });
      },
    );

    it(
      'rejects a step execution belonging to another workflow execution',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(),
        );

        expect(() =>
          service.replaceStepExecution(
            'execution-one',
            {
              id:
                'step-execution-one',
              workflowExecutionId:
                'another-execution',
              stepId:
                'step-one',
              state:
                'running',
              attemptNumber: 1,
              input: {},
              output: {},
            },
          ),
        ).toThrow(
          'does not belong',
        );
      },
    );

    it(
      'returns immutable snapshots',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(),
        );

        const first =
          service.getById(
            'execution-one',
          );

        const second =
          service.getById(
            'execution-one',
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(first?.context)
          .not.toBe(
            second?.context,
          );

        expect(
          first?.currentStepIds,
        ).not.toBe(
          second?.currentStepIds,
        );
      },
    );

    it(
      'deletes individual and workflow execution groups',
      () => {
        const service =
          new WorkflowExecutionStoreService();

        service.create(
          createExecution(
            'execution-one',
          ),
        );

        service.create(
          createExecution(
            'execution-two',
          ),
        );

        expect(
          service.delete(
            'execution-one',
          ),
        ).toBe(true);

        expect(service.count())
          .toBe(1);

        expect(
          service.deleteByWorkflow(
            'workflow-one',
          ),
        ).toBe(1);

        expect(service.count())
          .toBe(0);
      },
    );
  },
);