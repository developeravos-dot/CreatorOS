import {
  DEFAULT_PROJECTS_WORKSPACE_PREFERENCES,
  type ProjectsWorkspacePreferences,
} from "./projects-workspace-types";

import {
  normalizeProjectsPreferences,
} from "./projects-workspace-engine";

export const PROJECTS_WORKSPACE_STORAGE_KEY =
  "creatoros.projects-workspace.preferences.v1";

export function loadProjectsWorkspacePreferences():
  ProjectsWorkspacePreferences {
  if (
    typeof window === "undefined" ||
    !window.localStorage
  ) {
    return {
      ...DEFAULT_PROJECTS_WORKSPACE_PREFERENCES,
    };
  }

  const stored =
    window.localStorage.getItem(
      PROJECTS_WORKSPACE_STORAGE_KEY,
    );

  if (!stored) {
    return {
      ...DEFAULT_PROJECTS_WORKSPACE_PREFERENCES,
    };
  }

  try {
    return normalizeProjectsPreferences(
      JSON.parse(stored) as
        Partial<ProjectsWorkspacePreferences>,
    );
  } catch {
    return {
      ...DEFAULT_PROJECTS_WORKSPACE_PREFERENCES,
    };
  }
}

export function saveProjectsWorkspacePreferences(
  preferences:
    ProjectsWorkspacePreferences,
): void {
  if (
    typeof window === "undefined" ||
    !window.localStorage
  ) {
    return;
  }

  window.localStorage.setItem(
    PROJECTS_WORKSPACE_STORAGE_KEY,
    JSON.stringify(
      normalizeProjectsPreferences(
        preferences,
      ),
    ),
  );
}

export function clearProjectsWorkspacePreferences():
  void {
  if (
    typeof window === "undefined" ||
    !window.localStorage
  ) {
    return;
  }

  window.localStorage.removeItem(
    PROJECTS_WORKSPACE_STORAGE_KEY,
  );
}
