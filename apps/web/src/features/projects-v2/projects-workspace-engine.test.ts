import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  buildProjectsWorkspaceResult,
  deselectProjects,
  normalizeProjectsPreferences,
  selectProjects,
  toggleProjectSelection,
} from "./projects-workspace-engine";

const projects:
  EnterpriseProject[] = [
  {
    id: "project-1",
    name: "Alpha",
    description: "YouTube project",
    platform: "YouTube",
    status: "active",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-02T08:00:00.000Z",
  },
  {
    id: "project-2",
    name: "Beta",
    description: "TikTok project",
    platform: "TikTok",
    status: "completed",
    createdAt:
      "2026-08-02T08:00:00.000Z",
    updatedAt:
      "2026-08-03T08:00:00.000Z",
  },
];

describe(
  "projects workspace engine",
  () => {
    it(
      "filters and sorts projects",
      () => {
        const result =
          buildProjectsWorkspaceResult(
            projects,
            {
              search: "tiktok",
              platform: "all",
              status: "all",
              page: 1,
            },
            {
              sortField: "name",
              sortDirection: "asc",
              pageSize: 10,
              viewMode: "table",
            },
          );

        expect(
          result.projects,
        ).toEqual([
          projects[1],
        ]);

        expect(
          result.totalProjects,
        ).toBe(1);
      },
    );

    it(
      "paginates projects",
      () => {
        const paginatedProjects:
          EnterpriseProject[] =
          Array.from(
            {
              length: 11,
            },
            (_, index) => ({
              ...projects[0]!,
              id:
                `project-${index + 1}`,
              name:
                `Project ${String(
                  index + 1,
                ).padStart(
                  2,
                  "0",
                )}`,
              createdAt:
                new Date(
                  Date.UTC(
                    2026,
                    7,
                    index + 1,
                  ),
                ).toISOString(),
              updatedAt:
                new Date(
                  Date.UTC(
                    2026,
                    7,
                    index + 1,
                  ),
                ).toISOString(),
            }),
          );

        const result =
          buildProjectsWorkspaceResult(
            paginatedProjects,
            {
              search: "",
              platform: "all",
              status: "all",
              page: 2,
            },
            {
              sortField: "name",
              sortDirection: "asc",
              pageSize: 10,
              viewMode: "table",
            },
          );

        expect(
          result.projects,
        ).toHaveLength(1);

        expect(
          result.projects[0]?.name,
        ).toBe("Project 11");

        expect(
          result.totalProjects,
        ).toBe(11);

        expect(
          result.totalPages,
        ).toBe(2);

        expect(
          result.page,
        ).toBe(2);

        expect(
          result.pageSize,
        ).toBe(10);
      },
    );

    it(
      "normalizes invalid preferences",
      () => {
        expect(
          normalizeProjectsPreferences({
            pageSize: 999,
          }).pageSize,
        ).toBe(10);
      },
    );

    it(
      "manages project selection",
      () => {
        let selected =
          new Set<string>();

        selected =
          toggleProjectSelection(
            selected,
            "project-1",
          );

        selected =
          selectProjects(
            selected,
            ["project-2"],
          );

        expect(
          [...selected],
        ).toEqual([
          "project-1",
          "project-2",
        ]);

        selected =
          deselectProjects(
            selected,
            ["project-1"],
          );

        expect(
          [...selected],
        ).toEqual([
          "project-2",
        ]);
      },
    );
  },
);
