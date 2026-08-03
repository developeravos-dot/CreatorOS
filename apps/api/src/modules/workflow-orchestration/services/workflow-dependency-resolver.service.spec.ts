import {
  createDefaultWorkflowStepConfiguration,
  type WorkflowDefinition,
  type WorkflowExecution,
  type WorkflowStep,
} from '../models';
import {
  WorkflowDependencyResolverService,
} from './workflow-dependency-resolver.service';

describe(
  'WorkflowDependencyResolverService',
  () => {
    const now =
      '2026-08-07T10:00:00.000Z';

    function createStep(
      id: string,
      dependencies:
        readonly string[] = [],
    ): WorkflowStep {
      return {
        id,
        name: id,
        type:
          'task',
        input: {},
        configuration:
          createDefaultWorkflowStepConfiguration(),
        dependencies,
        tags: {
          tags: [],
          labels: {},
        },
      };
    }

    function createWorkflow():
      WorkflowDefinition {
      return {
        id:
          'workflow-one',
        name:
          'Workflow one',
        type:
          'sequential',
        state:
          'active',
        version: 1,
        entryStepId:
          'step-one',
        steps: [
          createStep(
            'step-one',
          ),
          createStep(
            'step-two',
            [
              'step-one',
            ],
          ),
          createStep(
            'step-three',
            [
              'step-two',
            ],
          ),
          createStep(
            'parallel-one',
            [
              'step-one',
            ],
          ),
        ],
        transitions: [],
        triggers: [],
        variables: [],
        ownership: {},
        tags: {
          tags: [],
          labels: {},
        },
        createdAt: now,
        updatedAt: now,
      };
    }

    function createExecution(
      stepExecutions:
        WorkflowExecution[
          'stepExecutions'
        ] = [],
    ): WorkflowExecution {
      return {
        id:
          'execution-one',
        workflowId:
          'workflow-one',
        workflowVersion: 1,
        state:
          'running',
        currentStepIds: [],
        completedStepIds: [],
        failedStepIds: [],
        skippedStepIds: [],
        stepExecutions,
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
      'marks the workflow entry step as ready',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        const result =
          service.resolve(
            createWorkflow(),
            createExecution(),
          );

        expect(
          result.readySteps.map(
            (step) =>
              step.id,
          ),
        ).toEqual([
          'step-one',
        ]);

        expect(
          result.waitingSteps.map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-two',
            'step-three',
            'parallel-one',
          ]),
        );
      },
    );

    it(
      'unlocks all dependents after dependency completion',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        const result =
          service.resolve(
            createWorkflow(),
            createExecution([
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
                output: {},
              },
            ]),
          );

        expect(
          result.readySteps.map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-two',
            'parallel-one',
          ]),
        );

        expect(
          result.completedSteps.map(
            (step) =>
              step.id,
          ),
        ).toContain(
          'step-one',
        );
      },
    );

    it(
      'blocks dependent steps after dependency failure',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        const result =
          service.resolve(
            createWorkflow(),
            createExecution([
              {
                id:
                  'step-execution-one',
                workflowExecutionId:
                  'execution-one',
                stepId:
                  'step-one',
                state:
                  'failed',
                attemptNumber: 1,
                input: {},
                output: {},
              },
            ]),
          );

        expect(
          result.failedSteps.map(
            (step) =>
              step.id,
          ),
        ).toContain(
          'step-one',
        );

        expect(
          result.blockedSteps.map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-two',
            'parallel-one',
          ]),
        );
      },
    );

    it(
      'classifies active skipped and completed steps',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        const result =
          service.resolve(
            createWorkflow(),
            createExecution([
              {
                id:
                  'execution-step-one',
                workflowExecutionId:
                  'execution-one',
                stepId:
                  'step-one',
                state:
                  'completed',
                attemptNumber: 1,
                input: {},
                output: {},
              },
              {
                id:
                  'execution-step-two',
                workflowExecutionId:
                  'execution-one',
                stepId:
                  'step-two',
                state:
                  'running',
                attemptNumber: 1,
                input: {},
                output: {},
              },
              {
                id:
                  'execution-parallel-one',
                workflowExecutionId:
                  'execution-one',
                stepId:
                  'parallel-one',
                state:
                  'skipped',
                attemptNumber: 1,
                input: {},
                output: {},
              },
            ]),
          );

        expect(
          result.completedSteps.map(
            (step) =>
              step.id,
          ),
        ).toContain(
          'step-one',
        );

        expect(
          result.activeSteps.map(
            (step) =>
              step.id,
          ),
        ).toContain(
          'step-two',
        );

        expect(
          result.skippedSteps.map(
            (step) =>
              step.id,
          ),
        ).toContain(
          'parallel-one',
        );
      },
    );

    it(
      'returns direct dependents and recursive descendants',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        expect(
          service.getDependents(
            createWorkflow(),
            'step-one',
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-two',
            'parallel-one',
          ]),
        );

        expect(
          service.getDescendants(
            createWorkflow(),
            'step-one',
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-two',
            'step-three',
            'parallel-one',
          ]),
        );
      },
    );

    it(
      'returns recursive ancestors',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        expect(
          service.getAncestors(
            createWorkflow(),
            'step-three',
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-one',
            'step-two',
          ]),
        );
      },
    );

    it(
      'returns root and leaf steps',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        expect(
          service.getRootSteps(
            createWorkflow(),
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual([
          'step-one',
        ]);

        expect(
          service.getLeafSteps(
            createWorkflow(),
          ).map(
            (step) =>
              step.id,
          ),
        ).toEqual(
          expect.arrayContaining([
            'step-three',
            'parallel-one',
          ]),
        );
      },
    );

    it(
      'uses the latest step attempt',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        const states =
          service.getLatestStepStates([
            {
              id:
                'attempt-one',
              workflowExecutionId:
                'execution-one',
              stepId:
                'step-one',
              state:
                'failed',
              attemptNumber: 1,
              input: {},
              output: {},
            },
            {
              id:
                'attempt-two',
              workflowExecutionId:
                'execution-one',
              stepId:
                'step-one',
              state:
                'completed',
              attemptNumber: 2,
              input: {},
              output: {},
            },
          ]);

        expect(
          states.get(
            'step-one',
          ),
        ).toBe(
          'completed',
        );
      },
    );

    it(
      'validates missing and self dependencies',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        const workflow =
          createWorkflow();

        const invalid:
          WorkflowDefinition = {
          ...workflow,
          steps: [
            createStep(
              'step-one',
              [
                'step-one',
                'missing',
              ],
            ),
          ],
        };

        expect(
          service.validateDependencies(
            invalid,
          ),
        ).toEqual(
          expect.arrayContaining([
            'Step step-one cannot depend on itself.',
            'Step step-one dependency missing was not found.',
          ]),
        );
      },
    );

    it(
      'rejects workflow and execution mismatch',
      () => {
        const service =
          new WorkflowDependencyResolverService();

        expect(() =>
          service.resolve(
            createWorkflow(),
            {
              ...createExecution(),
              workflowId:
                'different-workflow',
            },
          ),
        ).toThrow(
          'does not match',
        );
      },
    );
  },
);