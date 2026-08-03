import {
  createDefaultWorkflowStepConfiguration,
  type WorkflowDefinition,
  type WorkflowStep,
} from '../models';
import {
  WorkflowDefinitionValidatorService,
} from './workflow-definition-validator.service';

describe(
  'WorkflowDefinitionValidatorService',
  () => {
    let service:
      WorkflowDefinitionValidatorService;

    const now =
      '2026-08-06T10:00:00.000Z';

    beforeEach(() => {
      service =
        new WorkflowDefinitionValidatorService();
    });

    function step(
      id: string,
      dependencies:
        readonly string[] = [],
    ): WorkflowStep {
      return {
        id,
        name: id,
        type: 'task',
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

    function workflow(
      overrides:
        Partial<WorkflowDefinition> = {},
    ): WorkflowDefinition {
      return {
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
          step(
            'step-one',
          ),
          step(
            'step-two',
            [
              'step-one',
            ],
          ),
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
            conditions: [],
            default: true,
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
        variables: [],
        ownership: {},
        tags: {
          tags: [],
          labels: {},
        },
        createdAt: now,
        updatedAt: now,
        ...overrides,
      };
    }

    it(
      'accepts valid workflow definitions',
      () => {
        const result =
          service.validate(
            workflow(),
          );

        expect(result.valid)
          .toBe(true);

        expect(result.errors)
          .toEqual([]);
      },
    );

    it(
      'detects duplicate steps and missing entry step',
      () => {
        const result =
          service.validate(
            workflow({
              entryStepId:
                'missing',
              steps: [
                step('duplicate'),
                step('duplicate'),
              ],
            }),
          );

        expect(
          result.errors.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual(
          expect.arrayContaining([
            'DUPLICATE_STEP_ID',
            'ENTRY_STEP_NOT_FOUND',
          ]),
        );
      },
    );

    it(
      'detects invalid transitions',
      () => {
        const result =
          service.validate(
            workflow({
              transitions: [
                {
                  id:
                    'transition-one',
                  fromStepId:
                    'missing-source',
                  toStepId:
                    'missing-target',
                  priority: -1,
                  conditions: [],
                  default: true,
                },
              ],
            }),
          );

        expect(
          result.errors.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual(
          expect.arrayContaining([
            'TRANSITION_SOURCE_NOT_FOUND',
            'TRANSITION_TARGET_NOT_FOUND',
            'TRANSITION_PRIORITY_INVALID',
          ]),
        );
      },
    );

    it(
      'detects circular dependencies',
      () => {
        const result =
          service.validate(
            workflow({
              steps: [
                step(
                  'step-one',
                  [
                    'step-two',
                  ],
                ),
                step(
                  'step-two',
                  [
                    'step-one',
                  ],
                ),
              ],
            }),
          );

        expect(
          result.errors.map(
            (issue) =>
              issue.code,
          ),
        ).toContain(
          'CIRCULAR_STEP_DEPENDENCY',
        );
      },
    );

    it(
      'detects invalid compensation steps',
      () => {
        const source =
          step('step-one');

        const result =
          service.validate(
            workflow({
              steps: [
                {
                  ...source,
                  compensationStepId:
                    'missing',
                },
              ],
              transitions: [],
            }),
          );

        expect(
          result.errors.map(
            (issue) =>
              issue.code,
          ),
        ).toContain(
          'COMPENSATION_STEP_NOT_FOUND',
        );
      },
    );

    it(
      'warns about unreachable steps',
      () => {
        const result =
          service.validate(
            workflow({
              steps: [
                step('step-one'),
                step('step-two'),
              ],
              transitions: [],
            }),
          );

        expect(
          result.warnings.map(
            (issue) =>
              issue.code,
          ),
        ).toContain(
          'UNREACHABLE_STEP',
        );
      },
    );

    it(
      'detects duplicate trigger and variable identifiers',
      () => {
        const result =
          service.validate(
            workflow({
              triggers: [
                {
                  id:
                    'trigger-one',
                  type:
                    'manual',
                  enabled: true,
                  configuration: {},
                },
                {
                  id:
                    'trigger-one',
                  type:
                    'api',
                  enabled: true,
                  configuration: {},
                },
              ],
              variables: [
                {
                  name:
                    'value',
                  type:
                    'string',
                  value:
                    'one',
                  mutable: true,
                  secret: false,
                },
                {
                  name:
                    'value',
                  type:
                    'string',
                  value:
                    'two',
                  mutable: true,
                  secret: false,
                },
              ],
            }),
          );

        expect(
          result.errors.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual(
          expect.arrayContaining([
            'DUPLICATE_TRIGGER_ID',
            'DUPLICATE_VARIABLE_NAME',
          ]),
        );
      },
    );

    it(
      'throws an aggregated validation error',
      () => {
        expect(() =>
          service.assertValid(
            workflow({
              name: '',
              entryStepId:
                'missing',
            }),
          ),
        ).toThrow(
          'WORKFLOW_NAME_REQUIRED',
        );
      },
    );
  },
);