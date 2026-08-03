import {
  WorkflowDefinitionModel,
  WorkflowExecutionModel,
  createDefaultWorkflowRetryPolicy,
  createDefaultWorkflowStepConfiguration,
  isWorkflowExecutionState,
  isWorkflowState,
  isWorkflowStepState,
  isWorkflowStepType,
  isWorkflowType,
  type WorkflowDefinition,
  type WorkflowExecution,
} from './workflow.models';

describe(
  'workflow models',
  () => {
    const now =
      '2026-08-06T10:00:00.000Z';

    function createDefinition():
      WorkflowDefinition {
      return {
        id:
          'workflow-one',
        name:
          'Content publishing workflow',
        description:
          'Generates and publishes content.',
        type:
          'sequential',
        state:
          'draft',
        version: 1,
        entryStepId:
          'step-one',
        steps: [
          {
            id:
              'step-one',
            name:
              'Generate content',
            type:
              'task',
            handler:
              'content.generate',
            input: {
              projectId:
                'project-one',
            },
            configuration:
              createDefaultWorkflowStepConfiguration(),
            dependencies: [],
            tags: {
              tags: [
                'content',
              ],
              labels: {
                stage:
                  'generation',
              },
            },
            position: {
              x: 100,
              y: 200,
            },
          },
          {
            id:
              'step-two',
            name:
              'Publish content',
            type:
              'task',
            handler:
              'content.publish',
            input: {},
            configuration:
              createDefaultWorkflowStepConfiguration(),
            dependencies: [
              'step-one',
            ],
            tags: {
              tags: [
                'publishing',
              ],
              labels: {},
            },
          },
        ],
        transitions: [
          {
            id:
              'transition-one',
            fromStepId:
              'step-one',
            toStepId:
              'step-two',
            priority: 1,
            conditions: [
              {
                left:
                  'step.step-one.state',
                operator:
                  'equals',
                right:
                  'completed',
              },
            ],
            default: false,
          },
        ],
        triggers: [
          {
            id:
              'trigger-one',
            type:
              'manual',
            enabled: true,
            configuration: {},
          },
        ],
        variables: [
          {
            name:
              'projectId',
            type:
              'string',
            value:
              'project-one',
            mutable: false,
            secret: false,
          },
        ],
        ownership: {
          createdBy:
            'user-one',
          ownerType:
            'user',
          workspaceId:
            'workspace-one',
        },
        tags: {
          tags: [
            'content',
          ],
          labels: {
            environment:
              'test',
          },
        },
        createdAt: now,
        updatedAt: now,
      };
    }

    function createExecution():
      WorkflowExecution {
      return {
        id:
          'execution-one',
        workflowId:
          'workflow-one',
        workflowVersion: 1,
        state:
          'running',
        currentStepIds: [
          'step-one',
        ],
        completedStepIds: [],
        failedStepIds: [],
        skippedStepIds: [],
        stepExecutions: [
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
            input: {
              projectId:
                'project-one',
            },
            output: {},
            startedAt: now,
            workerId:
              'worker-one',
          },
        ],
        context: {
          variables: {
            projectId: {
              name:
                'projectId',
              type:
                'string',
              value:
                'project-one',
              mutable: false,
              secret: false,
            },
          },
          input: {
            projectId:
              'project-one',
          },
          output: {},
          metadata: {
            source:
              'test',
          },
          correlation: {
            correlationId:
              'correlation-one',
          },
        },
        trigger: {
          id:
            'trigger-one',
          type:
            'manual',
          enabled: true,
          configuration: {},
        },
        correlation: {
          correlationId:
            'correlation-one',
        },
        startedAt: now,
        createdAt: now,
        updatedAt: now,
      };
    }

    it(
      'recognizes canonical workflow types and states',
      () => {
        expect(
          isWorkflowState(
            'active',
          ),
        ).toBe(true);

        expect(
          isWorkflowExecutionState(
            'running',
          ),
        ).toBe(true);

        expect(
          isWorkflowStepState(
            'completed',
          ),
        ).toBe(true);

        expect(
          isWorkflowType(
            'parallel',
          ),
        ).toBe(true);

        expect(
          isWorkflowStepType(
            'human_approval',
          ),
        ).toBe(true);

        expect(
          isWorkflowState(
            'invalid',
          ),
        ).toBe(false);
      },
    );

    it(
      'creates default retry and step policies',
      () => {
        expect(
          createDefaultWorkflowRetryPolicy(),
        ).toEqual({
          maximumAttempts: 3,
          initialDelayMs:
            1_000,
          maximumDelayMs:
            60_000,
          multiplier: 2,
          jitter: false,
        });

        expect(
          createDefaultWorkflowStepConfiguration()
            .failureStrategy,
        ).toBe(
          'fail_workflow',
        );
      },
    );

    it(
      'creates independent workflow definition snapshots',
      () => {
        const source =
          createDefinition();

        const model =
          new WorkflowDefinitionModel(
            source,
          );

        const result =
          model.toContract();

        expect(result).toEqual(
          source,
        );

        expect(result).not.toBe(
          source,
        );

        expect(result.steps)
          .not.toBe(
            source.steps,
          );

        expect(
          result.steps[0]
            ?.configuration,
        ).not.toBe(
          source.steps[0]
            ?.configuration,
        );

        expect(
          result.transitions,
        ).not.toBe(
          source.transitions,
        );

        expect(
          result.variables,
        ).not.toBe(
          source.variables,
        );

        expect(result.tags)
          .not.toBe(
            source.tags,
          );
      },
    );

    it(
      'creates independent workflow execution snapshots',
      () => {
        const source =
          createExecution();

        const model =
          new WorkflowExecutionModel(
            source,
          );

        const result =
          model.toContract();

        expect(result).toEqual(
          source,
        );

        expect(result).not.toBe(
          source,
        );

        expect(
          result.currentStepIds,
        ).not.toBe(
          source.currentStepIds,
        );

        expect(
          result.stepExecutions,
        ).not.toBe(
          source.stepExecutions,
        );

        expect(result.context)
          .not.toBe(
            source.context,
          );

        expect(
          result.context.variables,
        ).not.toBe(
          source.context
            .variables,
        );

        expect(result.trigger)
          .not.toBe(
            source.trigger,
          );
      },
    );
  },
);