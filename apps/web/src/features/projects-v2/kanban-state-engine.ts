import type {
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

import {
  moveProjectToColumn,
} from "./kanban-engine";

export interface KanbanSnapshot {
  readonly projects:
    readonly EnterpriseProject[];
}

export interface KanbanDraggingState {
  readonly projectId:
    string | null;
  readonly sourceStatus:
    ProjectStatus | null;
  readonly targetStatus:
    ProjectStatus | null;
}

export interface KanbanOptimisticUpdate {
  readonly id: string;
  readonly type:
    | "move"
    | "bulk-move"
    | "undo"
    | "redo";
  readonly projectIds:
    readonly string[];
  readonly previous:
    KanbanSnapshot;
  readonly next:
    KanbanSnapshot;
}

export interface KanbanBulkOperation {
  readonly status:
    "idle"
    | "running"
    | "succeeded"
    | "failed";
  readonly targetStatus:
    ProjectStatus | null;
  readonly projectIds:
    readonly string[];
  readonly error:
    string | null;
}

export interface KanbanState {
  readonly present:
    KanbanSnapshot;
  readonly past:
    readonly KanbanSnapshot[];
  readonly future:
    readonly KanbanSnapshot[];
  readonly selection:
    ReadonlySet<string>;
  readonly dragging:
    KanbanDraggingState;
  readonly optimisticUpdates:
    readonly KanbanOptimisticUpdate[];
  readonly bulkOperation:
    KanbanBulkOperation;
}

function cloneProjects(
  projects:
    readonly EnterpriseProject[],
): EnterpriseProject[] {
  return projects.map(
    (project) => ({
      ...project,
    }),
  );
}

function createSnapshot(
  projects:
    readonly EnterpriseProject[],
): KanbanSnapshot {
  return {
    projects:
      cloneProjects(projects),
  };
}

function createIdleDragging():
  KanbanDraggingState {
  return {
    projectId: null,
    sourceStatus: null,
    targetStatus: null,
  };
}

function createIdleBulkOperation():
  KanbanBulkOperation {
  return {
    status: "idle",
    targetStatus: null,
    projectIds: [],
    error: null,
  };
}

function createOperationId(
  prefix: string,
): string {
  return [
    prefix,
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}

function pushSnapshot(
  state: KanbanState,
  snapshot: KanbanSnapshot,
): KanbanState {
  return {
    ...state,
    past: [
      ...state.past,
      state.present,
    ],
    present: snapshot,
    future: [],
  };
}

export function createKanbanState(
  projects:
    readonly EnterpriseProject[],
): KanbanState {
  return {
    present:
      createSnapshot(projects),
    past: [],
    future: [],
    selection:
      new Set<string>(),
    dragging:
      createIdleDragging(),
    optimisticUpdates: [],
    bulkOperation:
      createIdleBulkOperation(),
  };
}

export function replaceKanbanProjects(
  state: KanbanState,
  projects:
    readonly EnterpriseProject[],
): KanbanState {
  const availableIds =
    new Set(
      projects.map(
        (project) =>
          project.id,
      ),
    );

  return {
    ...state,
    present:
      createSnapshot(projects),
    past: [],
    future: [],
    selection:
      new Set(
        [...state.selection].filter(
          (projectId) =>
            availableIds.has(
              projectId,
            ),
        ),
      ),
    dragging:
      createIdleDragging(),
    optimisticUpdates: [],
    bulkOperation:
      createIdleBulkOperation(),
  };
}

export function selectKanbanProject(
  state: KanbanState,
  projectId: string,
): KanbanState {
  if (
    !state.present.projects.some(
      (project) =>
        project.id === projectId,
    )
  ) {
    return state;
  }

  if (
    state.selection.has(
      projectId,
    )
  ) {
    return state;
  }

  return {
    ...state,
    selection:
      new Set([
        ...state.selection,
        projectId,
      ]),
  };
}

export function deselectKanbanProject(
  state: KanbanState,
  projectId: string,
): KanbanState {
  if (
    !state.selection.has(
      projectId,
    )
  ) {
    return state;
  }

  const selection =
    new Set(
      state.selection,
    );

  selection.delete(
    projectId,
  );

  return {
    ...state,
    selection,
  };
}

export function toggleKanbanProjectSelection(
  state: KanbanState,
  projectId: string,
): KanbanState {
  return state.selection.has(
    projectId,
  )
    ? deselectKanbanProject(
        state,
        projectId,
      )
    : selectKanbanProject(
        state,
        projectId,
      );
}

export function clearKanbanSelection(
  state: KanbanState,
): KanbanState {
  if (
    state.selection.size === 0
  ) {
    return state;
  }

  return {
    ...state,
    selection:
      new Set<string>(),
  };
}

export function replaceKanbanSelection(
  state: KanbanState,
  projectIds:
    ReadonlySet<string>,
): KanbanState {
  const availableIds =
    new Set(
      state.present.projects.map(
        (project) =>
          project.id,
      ),
    );

  return {
    ...state,
    selection:
      new Set(
        [...projectIds].filter(
          (projectId) =>
            availableIds.has(
              projectId,
            ),
        ),
      ),
  };
}

export function beginKanbanDrag(
  state: KanbanState,
  projectId: string,
): KanbanState {
  const project =
    state.present.projects.find(
      (item) =>
        item.id === projectId,
    );

  if (!project) {
    return state;
  }

  return {
    ...state,
    dragging: {
      projectId,
      sourceStatus:
        project.status,
      targetStatus: null,
    },
  };
}

export function setKanbanDragTarget(
  state: KanbanState,
  targetStatus:
    ProjectStatus | null,
): KanbanState {
  if (
    state.dragging.projectId ===
    null
  ) {
    return state;
  }

  return {
    ...state,
    dragging: {
      ...state.dragging,
      targetStatus,
    },
  };
}

export function endKanbanDrag(
  state: KanbanState,
): KanbanState {
  if (
    state.dragging.projectId ===
      null &&
    state.dragging.targetStatus ===
      null
  ) {
    return state;
  }

  return {
    ...state,
    dragging:
      createIdleDragging(),
  };
}

export function moveKanbanProject(
  state: KanbanState,
  projectId: string,
  targetStatus:
    ProjectStatus,
): KanbanState {
  const result =
    moveProjectToColumn(
      state.present.projects,
      projectId,
      targetStatus,
    );

  if (
    !result.changed ||
    !result.movedProject
  ) {
    return endKanbanDrag(
      state,
    );
  }

  const nextSnapshot =
    createSnapshot(
      result.projects,
    );

  const optimisticUpdate:
    KanbanOptimisticUpdate = {
    id:
      createOperationId(
        "move",
      ),
    type: "move",
    projectIds: [
      projectId,
    ],
    previous:
      state.present,
    next:
      nextSnapshot,
  };

  return {
    ...pushSnapshot(
      state,
      nextSnapshot,
    ),
    dragging:
      createIdleDragging(),
    optimisticUpdates: [
      ...state.optimisticUpdates,
      optimisticUpdate,
    ],
  };
}

export function bulkMoveKanbanProjects(
  state: KanbanState,
  projectIds:
    ReadonlySet<string>,
  targetStatus:
    ProjectStatus,
): KanbanState {
  const movedIds: string[] = [];

  const nextProjects =
    state.present.projects.map(
      (project) => {
        if (
          !projectIds.has(
            project.id,
          ) ||
          project.status ===
            targetStatus
        ) {
          return project;
        }

        movedIds.push(
          project.id,
        );

        return {
          ...project,
          status:
            targetStatus,
        };
      },
    );

  if (
    movedIds.length === 0
  ) {
    return state;
  }

  const nextSnapshot =
    createSnapshot(
      nextProjects,
    );

  const optimisticUpdate:
    KanbanOptimisticUpdate = {
    id:
      createOperationId(
        "bulk-move",
      ),
    type: "bulk-move",
    projectIds:
      movedIds,
    previous:
      state.present,
    next:
      nextSnapshot,
  };

  return {
    ...pushSnapshot(
      state,
      nextSnapshot,
    ),
    selection:
      new Set<string>(),
    optimisticUpdates: [
      ...state.optimisticUpdates,
      optimisticUpdate,
    ],
    bulkOperation: {
      status: "running",
      targetStatus,
      projectIds:
        movedIds,
      error: null,
    },
  };
}

export function beginKanbanBulkOperation(
  state: KanbanState,
  targetStatus:
    ProjectStatus,
): KanbanState {
  const projectIds =
    [...state.selection].filter(
      (projectId) =>
        state.present.projects.some(
          (project) =>
            project.id ===
              projectId &&
            project.status !==
              targetStatus,
        ),
    );

  if (
    projectIds.length === 0
  ) {
    return state;
  }

  return {
    ...state,
    bulkOperation: {
      status: "running",
      targetStatus,
      projectIds,
      error: null,
    },
  };
}

export function completeKanbanBulkOperation(
  state: KanbanState,
): KanbanState {
  if (
    state.bulkOperation.status !==
    "running"
  ) {
    return state;
  }

  return {
    ...state,
    bulkOperation: {
      ...state.bulkOperation,
      status: "succeeded",
      error: null,
    },
  };
}

export function failKanbanBulkOperation(
  state: KanbanState,
  error: string,
): KanbanState {
  return {
    ...state,
    bulkOperation: {
      ...state.bulkOperation,
      status: "failed",
      error,
    },
  };
}

export function resetKanbanBulkOperation(
  state: KanbanState,
): KanbanState {
  return {
    ...state,
    bulkOperation:
      createIdleBulkOperation(),
  };
}

export function commitKanbanOptimisticUpdate(
  state: KanbanState,
  operationId: string,
): KanbanState {
  if (
    !state.optimisticUpdates.some(
      (operation) =>
        operation.id ===
        operationId,
    )
  ) {
    return state;
  }

  return {
    ...state,
    optimisticUpdates:
      state.optimisticUpdates.filter(
        (operation) =>
          operation.id !==
          operationId,
      ),
  };
}

export function rollbackKanbanOptimisticUpdate(
  state: KanbanState,
  operationId: string,
): KanbanState {
  const operation =
    state.optimisticUpdates.find(
      (item) =>
        item.id ===
        operationId,
    );

  if (!operation) {
    return state;
  }

  return {
    ...state,
    present:
      operation.previous,
    past:
      state.past.slice(
        0,
        -1,
      ),
    future: [],
    dragging:
      createIdleDragging(),
    optimisticUpdates:
      state.optimisticUpdates.filter(
        (item) =>
          item.id !==
          operationId,
      ),
    bulkOperation:
      operation.type ===
      "bulk-move"
        ? {
            ...state.bulkOperation,
            status: "failed",
          }
        : state.bulkOperation,
  };
}

export function undoKanbanState(
  state: KanbanState,
): KanbanState {
  const previous =
    state.past.at(-1);

  if (!previous) {
    return state;
  }

  const operation:
    KanbanOptimisticUpdate = {
    id:
      createOperationId(
        "undo",
      ),
    type: "undo",
    projectIds:
      previous.projects.map(
        (project) =>
          project.id,
      ),
    previous:
      state.present,
    next:
      previous,
  };

  return {
    ...state,
    past:
      state.past.slice(
        0,
        -1,
      ),
    present:
      previous,
    future: [
      state.present,
      ...state.future,
    ],
    optimisticUpdates: [
      ...state.optimisticUpdates,
      operation,
    ],
    dragging:
      createIdleDragging(),
  };
}

export function redoKanbanState(
  state: KanbanState,
): KanbanState {
  const next =
    state.future[0];

  if (!next) {
    return state;
  }

  const operation:
    KanbanOptimisticUpdate = {
    id:
      createOperationId(
        "redo",
      ),
    type: "redo",
    projectIds:
      next.projects.map(
        (project) =>
          project.id,
      ),
    previous:
      state.present,
    next,
  };

  return {
    ...state,
    past: [
      ...state.past,
      state.present,
    ],
    present: next,
    future:
      state.future.slice(1),
    optimisticUpdates: [
      ...state.optimisticUpdates,
      operation,
    ],
    dragging:
      createIdleDragging(),
  };
}

export function canUndoKanbanState(
  state: KanbanState,
): boolean {
  return state.past.length > 0;
}

export function canRedoKanbanState(
  state: KanbanState,
): boolean {
  return state.future.length > 0;
}

export function getLatestKanbanOptimisticUpdate(
  state: KanbanState,
): KanbanOptimisticUpdate | null {
  return (
    state.optimisticUpdates.at(
      -1,
    ) ??
    null
  );
}
