import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  buildProjectActivities,
  createProjectNoteActivity,
  createProjectStatusActivity,
  groupProjectActivitiesByDate,
  mergeProjectActivities,
  sortProjectActivities,
  summarizeProjectActivities,
} from "./project-activity-engine";

const project:
  EnterpriseProject = {
    id: "project-activity",
    name:
      "Project Activity Workspace",
    description:
      "Timeline and activity workspace.",
    platform: "YouTube",
    status: "active",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-03T09:30:00.000Z",
  };

describe(
  "project activity engine",
  () => {
    it(
      "builds created and updated activities",
      () => {
        const activities =
          buildProjectActivities(
            project,
          );

        expect(activities)
          .toHaveLength(2);

        expect(
          activities.map(
            (activity) =>
              activity.type,
          ),
        ).toEqual([
          "updated",
          "created",
        ]);
      },
    );

    it(
      "creates status and note activities",
      () => {
        const statusActivity =
          createProjectStatusActivity(
            project,
            "planning",
            "active",
            "2026-08-02T10:00:00.000Z",
            "Test User",
          );

        const noteActivity =
          createProjectNoteActivity(
            project,
            "Ready for production.",
            "2026-08-02T11:00:00.000Z",
            "Test User",
          );

        expect(
          statusActivity
            .previousStatus,
        ).toBe("planning");

        expect(
          statusActivity
            .nextStatus,
        ).toBe("active");

        expect(
          noteActivity.description,
        ).toBe(
          "Ready for production.",
        );
      },
    );

    it(
      "sorts activities newest first",
      () => {
        const oldActivity =
          createProjectNoteActivity(
            project,
            "Old",
            "2026-08-01T08:00:00.000Z",
          );

        const newActivity =
          createProjectNoteActivity(
            project,
            "New",
            "2026-08-04T08:00:00.000Z",
          );

        expect(
          sortProjectActivities([
            oldActivity,
            newActivity,
          ])[0]?.description,
        ).toBe("New");
      },
    );

    it(
      "merges and deduplicates activities",
      () => {
        const note =
          createProjectNoteActivity(
            project,
            "Unique note",
            "2026-08-04T08:00:00.000Z",
          );

        const merged =
          mergeProjectActivities(
            [note],
            [note],
          );

        expect(merged)
          .toHaveLength(1);
      },
    );

    it(
      "groups activities by date",
      () => {
        const activities = [
          createProjectNoteActivity(
            project,
            "First",
            "2026-08-03T08:00:00.000Z",
          ),
          createProjectNoteActivity(
            project,
            "Second",
            "2026-08-03T10:00:00.000Z",
          ),
          createProjectNoteActivity(
            project,
            "Third",
            "2026-08-02T10:00:00.000Z",
          ),
        ];

        const groups =
          groupProjectActivitiesByDate(
            activities,
          );

        expect(groups)
          .toHaveLength(2);

        expect(
          groups[0]?.date,
        ).toBe("2026-08-03");

        expect(
          groups[0]?.activities,
        ).toHaveLength(2);
      },
    );

    it(
      "summarizes activity metrics",
      () => {
        const activities =
          buildProjectActivities(
            project,
            {
              customActivities: [
                createProjectStatusActivity(
                  project,
                  "planning",
                  "active",
                  "2026-08-02T08:00:00.000Z",
                ),
                createProjectNoteActivity(
                  project,
                  "Production note",
                  "2026-08-04T08:00:00.000Z",
                ),
              ],
            },
          );

        const summary =
          summarizeProjectActivities(
            activities,
          );

        expect(summary.total)
          .toBe(4);

        expect(
          summary.created,
        ).toBe(1);

        expect(
          summary.updated,
        ).toBe(1);

        expect(
          summary.statusChanged,
        ).toBe(1);

        expect(summary.notes)
          .toBe(1);

        expect(
          summary.latestActivity
            ?.type,
        ).toBe("note");
      },
    );

    it(
      "ignores activities from another project",
      () => {
        const foreignActivity = {
          ...createProjectNoteActivity(
            project,
            "Foreign",
          ),
          id: "foreign-note",
          projectId:
            "another-project",
        };

        const activities =
          buildProjectActivities(
            project,
            {
              includeCreated:
                false,
              includeUpdated:
                false,
              customActivities: [
                foreignActivity,
              ],
            },
          );

        expect(activities)
          .toHaveLength(0);
      },
    );
  },
);
