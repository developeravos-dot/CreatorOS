import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  DEFAULT_PROJECTS_WORKSPACE_PREFERENCES,
  DEFAULT_PROJECTS_WORKSPACE_QUERY,
  PROJECTS_PAGE_SIZES,
  type ProjectSortDirection,
  type ProjectSortField,
  type ProjectsWorkspacePreferences,
  type ProjectsWorkspaceQuery,
  type ProjectsWorkspaceResult,
} from "./projects-workspace-types";

function compareText(
  left: string,
  right: string,
): number {
  return left.localeCompare(
    right,
    undefined,
    {
      sensitivity: "base",
      numeric: true,
    },
  );
}

function compareProjects(
  left: EnterpriseProject,
  right: EnterpriseProject,
  field: ProjectSortField,
): number {
  switch (field) {
    case "name":
      return compareText(
        left.name,
        right.name,
      );

    case "platform":
      return compareText(
        left.platform,
        right.platform,
      );

    case "status":
      return compareText(
        left.status,
        right.status,
      );

    case "createdAt":
      return (
        Date.parse(left.createdAt) -
        Date.parse(right.createdAt)
      );

    case "updatedAt":
      return (
        Date.parse(left.updatedAt) -
        Date.parse(right.updatedAt)
      );
  }
}

export function normalizeProjectsPreferences(
  value:
    | Partial<ProjectsWorkspacePreferences>
    | null
    | undefined,
): ProjectsWorkspacePreferences {
  const pageSize =
    PROJECTS_PAGE_SIZES.includes(
      value?.pageSize as
        (typeof PROJECTS_PAGE_SIZES)[number],
    )
      ? value!.pageSize!
      : DEFAULT_PROJECTS_WORKSPACE_PREFERENCES
          .pageSize;

  const sortFields:
    ProjectSortField[] = [
      "name",
      "platform",
      "status",
      "createdAt",
      "updatedAt",
    ];

  const sortDirections:
    ProjectSortDirection[] = [
      "asc",
      "desc",
    ];

  return {
    sortField:
      value?.sortField &&
      sortFields.includes(
        value.sortField,
      )
        ? value.sortField
        : DEFAULT_PROJECTS_WORKSPACE_PREFERENCES
            .sortField,

    sortDirection:
      value?.sortDirection &&
      sortDirections.includes(
        value.sortDirection,
      )
        ? value.sortDirection
        : DEFAULT_PROJECTS_WORKSPACE_PREFERENCES
            .sortDirection,

    pageSize,

    viewMode:
      value?.viewMode === "kanban"
        ? "kanban"
        : "table",
  };
}

export function normalizeProjectsQuery(
  value:
    | Partial<ProjectsWorkspaceQuery>
    | null
    | undefined,
): ProjectsWorkspaceQuery {
  const page =
    Number.isFinite(value?.page) &&
    Number(value?.page) > 0
      ? Math.floor(
          Number(value?.page),
        )
      : 1;

  return {
    search:
      value?.search?.trim() ?? "",

    platform:
      value?.platform?.trim() ||
      DEFAULT_PROJECTS_WORKSPACE_QUERY
        .platform,

    status:
      value?.status?.trim() ||
      DEFAULT_PROJECTS_WORKSPACE_QUERY
        .status,

    page,
  };
}

export function buildProjectsWorkspaceResult(
  projects: EnterpriseProject[],
  query: ProjectsWorkspaceQuery,
  preferences:
    ProjectsWorkspacePreferences,
): ProjectsWorkspaceResult {
  const normalizedQuery =
    normalizeProjectsQuery(query);

  const normalizedPreferences =
    normalizeProjectsPreferences(
      preferences,
    );

  const normalizedSearch =
    normalizedQuery.search.toLowerCase();

  const filtered = projects.filter(
    (project) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          project.id,
          project.name,
          project.description,
          project.platform,
          project.status,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
        );

      const matchesPlatform =
        normalizedQuery.platform ===
          "all" ||
        project.platform ===
          normalizedQuery.platform;

      const matchesStatus =
        normalizedQuery.status ===
          "all" ||
        project.status ===
          normalizedQuery.status;

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesStatus
      );
    },
  );

  const directionMultiplier =
    normalizedPreferences
      .sortDirection === "asc"
      ? 1
      : -1;

  const sorted = [...filtered].sort(
    (left, right) =>
      compareProjects(
        left,
        right,
        normalizedPreferences.sortField,
      ) * directionMultiplier,
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      sorted.length /
        normalizedPreferences.pageSize,
    ),
  );

  const page = Math.min(
    normalizedQuery.page,
    totalPages,
  );

  const start =
    (page - 1) *
    normalizedPreferences.pageSize;

  return {
    projects: sorted.slice(
      start,
      start +
        normalizedPreferences.pageSize,
    ),

    totalProjects: sorted.length,
    totalPages,
    page,
    pageSize:
      normalizedPreferences.pageSize,
  };
}

export function toggleProjectSelection(
  selectedIds: ReadonlySet<string>,
  projectId: string,
): Set<string> {
  const next =
    new Set(selectedIds);

  if (next.has(projectId)) {
    next.delete(projectId);
  } else {
    next.add(projectId);
  }

  return next;
}

export function selectProjects(
  selectedIds: ReadonlySet<string>,
  projectIds: readonly string[],
): Set<string> {
  return new Set([
    ...selectedIds,
    ...projectIds,
  ]);
}

export function deselectProjects(
  selectedIds: ReadonlySet<string>,
  projectIds: readonly string[],
): Set<string> {
  const next =
    new Set(selectedIds);

  for (const projectId of projectIds) {
    next.delete(projectId);
  }

  return next;
}
