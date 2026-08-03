import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  buildKanbanBoard,
  canMoveProject,
  createColumnsFromProjects,
  getKanbanColumn,
  getProjectColumnId,
  moveProjectToColumn,
  normalizeKanbanColumns,
  sortKanbanProjects,
} from "./kanban-engine";

const projects:
  EnterpriseProject[] = [
  {
    id: "project-1",
    name: "Alpha",
    description:
      "Alpha project",
    platform: "YouTube",
    status: "planning",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-03T08:00:00.000Z",
  },
  {
    id: "project-2",
    name: "Beta",
    description:
      "Beta project",
    platform: "TikTok",
    status: "active",
    createdAt:
      "2026-08-02T08:00:00.000Z",
    updatedAt:
      "2026-08-04T08:00:00.000Z",
  },
  {
    id: "project-3",
    name: "Gamma",
    description:
      "Gamma project",
    platform: "Both",
    status: "planning",
    createdAt:
      "2026-08-03T08:00:00.000Z",
    updatedAt:
      "2026-08-02T08:00:00.000Z",
  },
];

describe(
  "kanban engine",
  () => {
    it(
      "normalizes and deduplicates columns",
      () => {
        expect(
          normalizeKanbanColumns([
            {
              id: "planning",
              label: "Planning",
              order: 2,
            },
            {
              id: "planning",
              label: "Duplicate",
              order: 1,
            },
            {
              id: "active",
              label: "Active",
              order: 0,
            },
          ]),
        ).toEqual([
          {
            id: "active",
            label: "Active",
            order: 0,
          },
          {
            id: "planning",
            label: "Planning",
            order: 2,
          },
        ]);
      },
    );

    it(
      "creates columns from project statuses",
      () => {
        expect(
          createColumnsFromProjects(
            projects,
          ),
        ).toEqual([
          {
            id: "planning",
            label: "planning",
            order: 0,
          },
          {
            id: "active",
            label: "active",
            order: 1,
          },
        ]);
      },
    );

    it(
      "builds columns and counts",
      () => {
        const board =
          buildKanbanBoard(
            projects,
            {
              columns: [
                {
                  id: "planning",
                  label: "Planning",
                  order: 0,
                },
                {
                  id: "active",
                  label: "Active",
                  order: 1,
                },
              ],
              sortField: "name",
              sortDirection: "asc",
            },
          );

        expect(
          board.totalProjects,
        ).toBe(3);

        expect(
          board.columns[0]
            ?.projectCount,
        ).toBe(2);

        expect(
          board.columns[0]
            ?.projects.map(
              (project) =>
                project.name,
            ),
        ).toEqual([
          "Alpha",
          "Gamma",
        ]);

        expect(
          board.columns[1]
            ?.projectCount,
        ).toBe(1);

        expect(
          board.unassignedProjects,
        ).toHaveLength(0);
      },
    );

    it(
      "keeps projects unassigned when their column is omitted",
      () => {
        const board =
          buildKanbanBoard(
            projects,
            {
              columns: [
                {
                  id: "planning",
                  label: "Planning",
                  order: 0,
                },
              ],
            },
          );

        expect(
          board.unassignedProjects.map(
            (project) =>
              project.id,
          ),
        ).toEqual([
          "project-2",
        ]);
      },
    );

    it(
      "sorts by name and update date",
      () => {
        expect(
          sortKanbanProjects(
            projects,
            "name",
            "desc",
          ).map(
            (project) =>
              project.name,
          ),
        ).toEqual([
          "Gamma",
          "Beta",
          "Alpha",
        ]);

        expect(
          sortKanbanProjects(
            projects,
            "updatedAt",
            "desc",
          ).map(
            (project) =>
              project.id,
          ),
        ).toEqual([
          "project-2",
          "project-1",
          "project-3",
        ]);
      },
    );

    it(
      "finds columns and project status",
      () => {
        const board =
          buildKanbanBoard(
            projects,
          );

        expect(
          getKanbanColumn(
            board,
            "planning",
          )?.id,
        ).toBe(
          "planning",
        );

        expect(
          getProjectColumnId(
            projects[0]!,
          ),
        ).toBe(
          "planning",
        );
      },
    );

    it(
      "checks whether a project can move",
      () => {
        expect(
          canMoveProject(
            projects[0]!,
            "active",
          ),
        ).toBe(true);

        expect(
          canMoveProject(
            projects[0]!,
            "planning",
          ),
        ).toBe(false);
      },
    );

    it(
      "moves a project to another column",
      () => {
        const result =
          moveProjectToColumn(
            projects,
            "project-1",
            "active",
          );

        expect(
          result.changed,
        ).toBe(true);

        expect(
          result.previousStatus,
        ).toBe(
          "planning",
        );

        expect(
          result.nextStatus,
        ).toBe(
          "active",
        );

        expect(
          result.movedProject
            ?.status,
        ).toBe(
          "active",
        );

        expect(
          projects[0]?.status,
        ).toBe(
          "planning",
        );
      },
    );

    it(
      "does not mutate missing or unchanged projects",
      () => {
        const missing =
          moveProjectToColumn(
            projects,
            "missing",
            "paused",
          );

        expect(
          missing.changed,
        ).toBe(false);

        expect(
          missing.movedProject,
        ).toBeNull();

        const unchanged =
          moveProjectToColumn(
            projects,
            "project-1",
            "planning",
          );

        expect(
          unchanged.changed,
        ).toBe(false);

        expect(
          unchanged.movedProject
            ?.id,
        ).toBe(
          "project-1",
        );
      },
    );
  },
);
