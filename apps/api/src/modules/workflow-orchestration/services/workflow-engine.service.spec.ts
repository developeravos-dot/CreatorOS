import {
  createDefaultWorkflowStepConfiguration,
} from '../models';
import {
  WorkflowDefinitionValidatorService,
} from './workflow-definition-validator.service';
import {
  WorkflowEngineService,
} from './workflow-engine.service';
import {
  WorkflowStateMachineService,
} from './workflow-state-machine.service';
import {
  WorkflowVersioningService,
} from './workflow-versioning.service';

describe(
  'WorkflowEngineService',
  () => {
    function setup() {
      const versioning =
        new WorkflowVersioningService();

      const engine =
        new WorkflowEngineService(
          new WorkflowDefinitionValidatorService(),
          new WorkflowStateMachineService(),
          versioning,
        );

      return {
        engine,
        versioning,
      };
    }

    function createWorkflow(
      engine:
        WorkflowEngineService,
      id =
        'workflow-one',
    ) {
      return engine.create({
        id,
        name:
          'Content workflow',
        type:
          'sequential',
        entryStepId:
          'step-one',
        steps: [
          {
            id:
              'step-one',
            name:
              'Generate',
            type:
              'task',
            input: {
              token:
                'secret-token',
            },
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
        tags: [
          'Content',
          'content',
        ],
      });
    }

    it(
      'creates validated workflows',
      () => {
        const {
          engine,
          versioning,
        } = setup();

        const workflow =
          createWorkflow(
            engine,
          );

        expect(workflow.state)
          .toBe('draft');

        expect(
          workflow.tags.tags,
        ).toEqual([
          'content',
        ]);

        expect(
          versioning.listVersions(
            workflow.id,
          ),
        ).toHaveLength(1);
      },
    );

    it(
      'updates draft workflows',
      () => {
        const {
          engine,
        } = setup();

        createWorkflow(
          engine,
        );

        const updated =
          engine.update(
            'workflow-one',
            {
              name:
                'Updated workflow',
              type:
                'parallel',
            },
          );

        expect(updated.name)
          .toBe(
            'Updated workflow',
          );

        expect(updated.type)
          .toBe('parallel');
      },
    );

    it(
      'publishes activates pauses resumes and archives workflows',
      () => {
        const {
          engine,
        } = setup();

        createWorkflow(
          engine,
        );

        expect(
          engine.publish(
            'workflow-one',
          ).state,
        ).toBe('published');

        expect(
          engine.activate(
            'workflow-one',
          ).state,
        ).toBe('active');

        expect(
          engine.pause(
            'workflow-one',
          ).state,
        ).toBe('paused');

        expect(
          engine.resume(
            'workflow-one',
          ).state,
        ).toBe('active');

        expect(
          engine.archive(
            'workflow-one',
          ).state,
        ).toBe('archived');
      },
    );

    it(
      'creates and restores versions',
      () => {
        const {
          engine,
          versioning,
        } = setup();

        createWorkflow(
          engine,
        );

        engine.publish(
          'workflow-one',
          {
            changeSummary:
              'Version one.',
          },
        );

        const versions =
          versioning.listVersions(
            'workflow-one',
          );

        expect(
          versions.length,
        ).toBeGreaterThanOrEqual(
          2,
        );

        const restored =
          engine.restoreVersion(
            'workflow-one',
            1,
          );

        expect(restored.state)
          .toBe('draft');
      },
    );

    it(
      'clones workflows',
      () => {
        const {
          engine,
        } = setup();

        const source =
          createWorkflow(
            engine,
          );

        const clone =
          engine.clone(
            source.id,
            {
              name:
                'Cloned workflow',
            },
          );

        expect(clone.id)
          .not.toBe(source.id);

        expect(clone.name)
          .toBe(
            'Cloned workflow',
          );

        expect(clone.state)
          .toBe('draft');
      },
    );

    it(
      'sanitizes workflow secrets',
      () => {
        const {
          engine,
        } = setup();

        const workflow =
          createWorkflow(
            engine,
          );

        const serialized =
          JSON.stringify(
            workflow,
          );

        expect(serialized)
          .not.toContain(
            'secret-token',
          );

        expect(serialized)
          .toContain(
            '[REDACTED]',
          );
      },
    );

    it(
      'rejects duplicate identifiers',
      () => {
        const {
          engine,
        } = setup();

        createWorkflow(
          engine,
        );

        expect(() =>
          createWorkflow(
            engine,
          ),
        ).toThrow(
          'already exists',
        );
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const {
          engine,
        } = setup();

        createWorkflow(
          engine,
        );

        const first =
          engine.getById(
            'workflow-one',
          );

        const second =
          engine.getById(
            'workflow-one',
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(first?.steps)
          .not.toBe(
            second?.steps,
          );
      },
    );

    it(
      'deletes draft workflows',
      () => {
        const {
          engine,
        } = setup();

        createWorkflow(
          engine,
        );

        expect(
          engine.delete(
            'workflow-one',
          ),
        ).toBe(true);

        expect(
          engine.getById(
            'workflow-one',
          ),
        ).toBeUndefined();
      },
    );
  },
);