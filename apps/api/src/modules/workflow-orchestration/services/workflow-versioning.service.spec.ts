import {
  createDefaultWorkflowStepConfiguration,
  type WorkflowDefinition,
} from '../models';
import {
  WorkflowVersioningService,
} from './workflow-versioning.service';

describe(
  'WorkflowVersioningService',
  () => {
    const now =
      '2026-08-06T10:00:00.000Z';

    function workflow():
      WorkflowDefinition {
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

    it(
      'creates sequential workflow versions',
      () => {
        const service =
          new WorkflowVersioningService();

        const first =
          service.createVersion(
            workflow(),
          );

        const second =
          service.createVersion(
            workflow(),
          );

        expect(first.version)
          .toBe(1);

        expect(second.version)
          .toBe(2);

        expect(
          service.listVersions(
            'workflow-one',
          ),
        ).toHaveLength(2);
      },
    );

    it(
      'marks one published version',
      () => {
        const service =
          new WorkflowVersioningService();

        service.createVersion(
          workflow(),
        );

        service.createVersion(
          workflow(),
        );

        const published =
          service.markPublished(
            'workflow-one',
            2,
          );

        expect(
          published.published,
        ).toBe(true);

        expect(
          service.listVersions(
            'workflow-one',
          ).filter(
            (item) =>
              item.published,
          ),
        ).toHaveLength(1);
      },
    );

    it(
      'restores versions as drafts',
      () => {
        const service =
          new WorkflowVersioningService();

        service.createVersion(
          workflow(),
        );

        const restored =
          service.restoreVersion(
            'workflow-one',
            1,
          );

        expect(restored.state)
          .toBe('draft');

        expect(
          restored.publishedAt,
        ).toBeUndefined();
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const service =
          new WorkflowVersioningService();

        service.createVersion(
          workflow(),
        );

        const first =
          service.getVersion(
            'workflow-one',
            1,
          );

        const second =
          service.getVersion(
            'workflow-one',
            1,
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(
          first?.definition,
        ).not.toBe(
          second?.definition,
        );
      },
    );
  },
);