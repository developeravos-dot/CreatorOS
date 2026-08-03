import type {
  BulkPublishWorkflowsContract,
  CreateWorkflowContract,
  StartWorkflowExecutionContract,
  WorkflowDetailsContract,
  WorkflowListQueryContract,
  WorkflowListResultContract,
  WorkflowOperationResultContract,
} from './workflow.contracts';
import {
  createDefaultWorkflowStepConfiguration,
  type WorkflowDefinition,
} from '../models';

describe(
  'workflow contracts',
  () => {
    const timestamp =
      '2026-08-06T10:00:00.000Z';

    const workflow:
      WorkflowDefinition = {
        id:
          'workflow-one',
        name:
          'Workflow one',
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
              'Step one',
            type:
              'task',
            input: {},
            configuration:
              createDefaultWorkflowStepConfiguration(),
            dependencies: [],
            tags: {
              tags: [],
              labels: {},
            },
          },
        ],
        transitions: [],
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
        variables: [],
        ownership: {},
        tags: {
          tags: [],
          labels: {},
        },
        createdAt:
          timestamp,
        updatedAt:
          timestamp,
      };

    it(
      'supports workflow creation contracts',
      () => {
        const input:
          CreateWorkflowContract = {
            name:
              'Workflow one',
            type:
              'sequential',
            entryStepId:
              'step-one',
            steps:
              workflow.steps,
          };

        expect(input.name)
          .toBe(
            'Workflow one',
          );
      },
    );

    it(
      'supports workflow execution contracts',
      () => {
        const input:
          StartWorkflowExecutionContract = {
            workflow,
            trigger:
              workflow.triggers[0]!,
            input: {
              projectId:
                'project-one',
            },
          };

        expect(
          input.workflow.id,
        ).toBe(
          'workflow-one',
        );
      },
    );

    it(
      'supports workflow query and pagination contracts',
      () => {
        const query:
          WorkflowListQueryContract = {
            states: [
              'draft',
            ],
            types: [
              'sequential',
            ],
            page: 1,
            pageSize: 25,
          };

        const result:
          WorkflowListResultContract = {
            count: 1,
            total: 1,
            pagination: {
              page: 1,
              pageSize: 25,
              totalItems: 1,
              totalPages: 1,
              hasPreviousPage:
                false,
              hasNextPage:
                false,
            },
            workflows: [
              workflow,
            ],
          };

        expect(query.states)
          .toContain('draft');

        expect(result.total)
          .toBe(1);
      },
    );

    it(
      'supports workflow detail and operation contracts',
      () => {
        const details:
          WorkflowDetailsContract = {
            workflow,
            activeExecutions: [],
          };

        const operation:
          WorkflowOperationResultContract = {
            successful: true,
            workflowId:
              'workflow-one',
            state:
              'published',
            message:
              'Workflow published.',
            workflow,
          };

        expect(
          details.workflow.id,
        ).toBe(
          'workflow-one',
        );

        expect(
          operation.successful,
        ).toBe(true);
      },
    );

    it(
      'supports bulk workflow operations',
      () => {
        const input:
          BulkPublishWorkflowsContract = {
            workflowIds: [
              'workflow-one',
              'workflow-two',
            ],
            requestedBy:
              'user-one',
            changeSummary:
              'Initial release.',
          };

        expect(
          input.workflowIds,
        ).toHaveLength(2);
      },
    );
  },
);