import type {
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

export type KanbanColumnId =
  ProjectStatus;

export type KanbanProjectSortField =
  | "name"
  | "createdAt"
  | "updatedAt";

export type KanbanSortDirection =
  | "asc"
  | "desc";

export interface KanbanColumnDefinition {
  id: KanbanColumnId;
  label: string;
  order: number;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  label: string;
  order: number;
  projects: EnterpriseProject[];
  projectCount: number;
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  totalProjects: number;
  unassignedProjects:
    EnterpriseProject[];
}

export interface BuildKanbanBoardOptions {
  columns?:
    readonly KanbanColumnDefinition[];
  sortField?:
    KanbanProjectSortField;
  sortDirection?:
    KanbanSortDirection;
}

export interface MoveProjectResult {
  projects: EnterpriseProject[];
  movedProject:
    EnterpriseProject | null;
  previousStatus:
    ProjectStatus | null;
  nextStatus: ProjectStatus;
  changed: boolean;
}

export const DEFAULT_KANBAN_COLUMNS:
  readonly KanbanColumnDefinition[] = [
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
  {
    id: "paused",
    label: "Paused",
    order: 2,
  },
  {
    id: "completed",
    label: "Completed",
    order: 3,
  },
];

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

function compareDates(
  left: string,
  right: string,
): number {
  const leftTime =
    Date.parse(left);

  const rightTime =
    Date.parse(right);

  return (
    (
      Number.isFinite(leftTime)
        ? leftTime
        : 0
    ) -
    (
      Number.isFinite(rightTime)
        ? rightTime
        : 0
    )
  );
}

function compareProjects(
  left: EnterpriseProject,
  right: EnterpriseProject,
  sortField:
    KanbanProjectSortField,
): number {
  switch (sortField) {
    case "name":
      return compareText(
        left.name,
        right.name,
      );

    case "createdAt":
      return compareDates(
        left.createdAt,
        right.createdAt,
      );

    case "updatedAt":
      return compareDates(
        left.updatedAt,
        right.updatedAt,
      );
  }
}

export function sortKanbanProjects(
  projects:
    readonly EnterpriseProject[],
  sortField:
    KanbanProjectSortField =
      "updatedAt",
  sortDirection:
    KanbanSortDirection =
      "desc",
): EnterpriseProject[] {
  const multiplier =
    sortDirection === "asc"
      ? 1
      : -1;

  return [...projects].sort(
    (left, right) => {
      const primary =
        compareProjects(
          left,
          right,
          sortField,
        ) * multiplier;

      if (primary !== 0) {
        return primary;
      }

      return compareText(
        left.name,
        right.name,
      );
    },
  );
}

export function normalizeKanbanColumns(
  columns:
    readonly KanbanColumnDefinition[],
): KanbanColumnDefinition[] {
  const unique =
    new Map<
      ProjectStatus,
      KanbanColumnDefinition
    >();

  for (const column of columns) {
    if (
      unique.has(column.id)
    ) {
      continue;
    }

    unique.set(
      column.id,
      {
        id: column.id,
        label:
          column.label.trim() ||
          column.id,
        order:
          Number.isFinite(
            column.order,
          )
            ? column.order
            : unique.size,
      },
    );
  }

  return [
    ...unique.values(),
  ].sort(
    (left, right) =>
      left.order -
      right.order,
  );
}

export function createColumnsFromProjects(
  projects:
    readonly EnterpriseProject[],
): KanbanColumnDefinition[] {
  const statuses =
    new Set<ProjectStatus>();

  for (const project of projects) {
    statuses.add(
      project.status,
    );
  }

  return [
    ...statuses,
  ].map(
    (status, index) => ({
      id: status,
      label: status,
      order: index,
    }),
  );
}

export function buildKanbanBoard(
  projects:
    readonly EnterpriseProject[],
  options:
    BuildKanbanBoardOptions = {},
): KanbanBoard {
  const definitions =
    normalizeKanbanColumns(
      options.columns ??
        DEFAULT_KANBAN_COLUMNS,
    );

  const columnMap =
    new Map<
      ProjectStatus,
      KanbanColumn
    >();

  for (
    const definition of
    definitions
  ) {
    columnMap.set(
      definition.id,
      {
        ...definition,
        projects: [],
        projectCount: 0,
      },
    );
  }

  const unassignedProjects:
    EnterpriseProject[] = [];

  for (const project of projects) {
    const column =
      columnMap.get(
        project.status,
      );

    if (!column) {
      unassignedProjects.push(
        project,
      );

      continue;
    }

    column.projects.push(
      project,
    );
  }

  const sortField =
    options.sortField ??
    "updatedAt";

  const sortDirection =
    options.sortDirection ??
    "desc";

  const columns = [
    ...columnMap.values(),
  ]
    .sort(
      (left, right) =>
        left.order -
        right.order,
    )
    .map(
      (column) => {
        const sortedProjects =
          sortKanbanProjects(
            column.projects,
            sortField,
            sortDirection,
          );

        return {
          ...column,
          projects:
            sortedProjects,
          projectCount:
            sortedProjects.length,
        };
      },
    );

  return {
    columns,
    totalProjects:
      projects.length,
    unassignedProjects:
      sortKanbanProjects(
        unassignedProjects,
        sortField,
        sortDirection,
      ),
  };
}

export function getKanbanColumn(
  board: KanbanBoard,
  columnId: ProjectStatus,
): KanbanColumn | null {
  return (
    board.columns.find(
      (column) =>
        column.id ===
        columnId,
    ) ??
    null
  );
}

export function getProjectColumnId(
  project:
    EnterpriseProject,
): KanbanColumnId {
  return project.status;
}

export function canMoveProject(
  project:
    EnterpriseProject,
  targetColumnId:
    ProjectStatus,
): boolean {
  return (
    project.status !==
    targetColumnId
  );
}

export function moveProjectToColumn(
  projects:
    readonly EnterpriseProject[],
  projectId: string,
  targetColumnId:
    ProjectStatus,
): MoveProjectResult {
  const project =
    projects.find(
      (item) =>
        item.id ===
        projectId,
    );

  if (!project) {
    return {
      projects: [
        ...projects,
      ],
      movedProject: null,
      previousStatus: null,
      nextStatus:
        targetColumnId,
      changed: false,
    };
  }

  const previousStatus =
    project.status;

  if (
    previousStatus ===
    targetColumnId
  ) {
    return {
      projects: [
        ...projects,
      ],
      movedProject:
        project,
      previousStatus,
      nextStatus:
        targetColumnId,
      changed: false,
    };
  }

  const movedProject:
    EnterpriseProject = {
    ...project,
    status:
      targetColumnId,
  };

  return {
    projects:
      projects.map(
        (item) =>
          item.id ===
          projectId
            ? movedProject
            : item,
      ),
    movedProject,
    previousStatus,
    nextStatus:
      targetColumnId,
    changed: true,
  };
}
