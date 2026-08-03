import 'reflect-metadata';

import {
  plainToInstance,
} from 'class-transformer';
import {
  validate,
} from 'class-validator';

import {
  CreateWorkflowDto,
  WorkflowListQueryDto,
} from './workflow.dto';

describe(
  'workflow DTOs',
  () => {
    it(
      'accepts a valid workflow definition',
      async () => {
        const dto =
          plainToInstance(
            CreateWorkflowDto,
            {
              name:
                'Workflow one',
              type:
                'sequential',
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
                  configuration: {
                    retry: {
                      maximumAttempts:
                        3,
                      initialDelayMs:
                        1000,
                      maximumDelayMs:
                        60000,
                      multiplier: 2,
                      jitter: false,
                    },
                    timeout: {
                      timeoutState:
                        'timed_out',
                    },
                    failureStrategy:
                      'fail_workflow',
                    continueOnFailure:
                      false,
                    requiresApproval:
                      false,
                  },
                  dependencies: [],
                },
              ],
            },
          );

        const errors =
          await validate(dto);

        expect(errors)
          .toHaveLength(0);
      },
    );

    it(
      'rejects an invalid workflow type',
      async () => {
        const dto =
          plainToInstance(
            CreateWorkflowDto,
            {
              name:
                'Workflow one',
              type:
                'invalid',
              entryStepId:
                'step-one',
              steps: [],
            },
          );

        const errors =
          await validate(dto);

        expect(
          errors.some(
            (error) =>
              error.property ===
              'type',
          ),
        ).toBe(true);
      },
    );

    it(
      'rejects missing workflow name and entry step',
      async () => {
        const dto =
          plainToInstance(
            CreateWorkflowDto,
            {
              steps: [],
            },
          );

        const errors =
          await validate(dto);

        expect(
          errors.map(
            (error) =>
              error.property,
          ),
        ).toEqual(
          expect.arrayContaining([
            'name',
            'entryStepId',
          ]),
        );
      },
    );

    it(
      'accepts valid list query filters',
      async () => {
        const dto =
          plainToInstance(
            WorkflowListQueryDto,
            {
              states: [
                'draft',
                'published',
              ],
              types: [
                'sequential',
              ],
              sortBy:
                'updatedAt',
              sortDirection:
                'desc',
              page: 1,
              pageSize: 50,
            },
          );

        const errors =
          await validate(dto);

        expect(errors)
          .toHaveLength(0);
      },
    );

    it(
      'rejects invalid pagination',
      async () => {
        const dto =
          plainToInstance(
            WorkflowListQueryDto,
            {
              page: 0,
              pageSize: 1000,
            },
          );

        const errors =
          await validate(dto);

        expect(
          errors.map(
            (error) =>
              error.property,
          ),
        ).toEqual(
          expect.arrayContaining([
            'page',
            'pageSize',
          ]),
        );
      },
    );
  },
);