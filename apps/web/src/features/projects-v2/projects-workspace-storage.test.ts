import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  clearProjectsWorkspacePreferences,
  loadProjectsWorkspacePreferences,
  PROJECTS_WORKSPACE_STORAGE_KEY,
  saveProjectsWorkspacePreferences,
} from "./projects-workspace-storage";

describe(
  "projects workspace storage",
  () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it(
      "returns default preferences",
      () => {
        expect(
          loadProjectsWorkspacePreferences(),
        ).toMatchObject({
          sortField: "updatedAt",
          sortDirection: "desc",
          pageSize: 10,
          viewMode: "table",
        });
      },
    );

    it(
      "saves and loads preferences",
      () => {
        saveProjectsWorkspacePreferences({
          sortField: "name",
          sortDirection: "asc",
          pageSize: 20,
          viewMode: "kanban",
        });

        expect(
          loadProjectsWorkspacePreferences(),
        ).toEqual({
          sortField: "name",
          sortDirection: "asc",
          pageSize: 20,
          viewMode: "kanban",
        });
      },
    );

    it(
      "clears saved preferences",
      () => {
        window.localStorage.setItem(
          PROJECTS_WORKSPACE_STORAGE_KEY,
          "{}",
        );

        clearProjectsWorkspacePreferences();

        expect(
          window.localStorage.getItem(
            PROJECTS_WORKSPACE_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );
  },
);
