import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  beginKanbanDrag,
  bulkMoveKanbanProjects,
  canRedoKanbanState,
  canUndoKanbanState,
  clearKanbanSelection,
  commitKanbanOptimisticUpdate,
  createKanbanState,
  endKanbanDrag,
  getLatestKanbanOptimisticUpdate,
  moveKanbanProject,
  redoKanbanState,
  replaceKanbanProjects,
  rollbackKanbanOptimisticUpdate,
  selectKanbanProject,
  setKanbanDragTarget,
  toggleKanbanProjectSelection,
  undoKanbanState,
} from "./kanban-state-engine";

const planningProject:
  EnterpriseProject = {
    id: "project-planning",
    name: "Planning Project",
    description: "",
    platform: "YouTube",
    status: "planning",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-01T08:00:00.000Z",
  };

const activeProject:
  EnterpriseProject = {
    id: "project-active",
    name: "Active Project",
    description: "",
    platform: "TikTok",
    status: "active",
    createdAt:
      "2026-08-01T09:00:00.000Z",
    updatedAt:
      "2026-08-01T09:00:00.000Z",
  };

const projects:
  EnterpriseProject[] = [
    planningProject,
    activeProject,
  ];

describe(
  "kanban state engine",
  () => {
    it(
      "creates the complete initial state",
      () => {
        const state =
          createKanbanState(
            projects,
          );

        expect(
          state.present.projects,
        ).toEqual(projects);

        expect(state.past)
          .toHaveLength(0);

        expect(state.future)
          .toHaveLength(0);

        expect(
          state.selection.size,
        ).toBe(0);

        expect(
          state.dragging.projectId,
        ).toBeNull();

        expect(
          state.optimisticUpdates,
        ).toHaveLength(0);

        expect(
          state.bulkOperation.status,
        ).toBe("idle");
      },
    );

    it(
      "manages project selection",
      () => {
        let state =
          createKanbanState(
            projects,
          );

        state =
          selectKanbanProject(
            state,
            planningProject.id,
          );

        expect(
          state.selection.has(
            planningProject.id,
          ),
        ).toBe(true);

        state =
          toggleKanbanProjectSelection(
            state,
            planningProject.id,
          );

        expect(
          state.selection.has(
            planningProject.id,
          ),
        ).toBe(false);

        state =
          selectKanbanProject(
            state,
            activeProject.id,
          );

        state =
          clearKanbanSelection(
            state,
          );

        expect(
          state.selection.size,
        ).toBe(0);
      },
    );

    it(
      "manages dragging state",
      () => {
        let state =
          createKanbanState(
            projects,
          );

        state =
          beginKanbanDrag(
            state,
            planningProject.id,
          );

        expect(
          state.dragging,
        ).toEqual({
          projectId:
            planningProject.id,
          sourceStatus:
            "planning",
          targetStatus:
            null,
        });

        state =
          setKanbanDragTarget(
            state,
            "active",
          );

        expect(
          state.dragging
            .targetStatus,
        ).toBe("active");

        state =
          endKanbanDrag(
            state,
          );

        expect(
          state.dragging.projectId,
        ).toBeNull();
      },
    );

    it(
      "moves a project and creates history and an optimistic update",
      () => {
        const initial =
          createKanbanState(
            projects,
          );

        const moved =
          moveKanbanProject(
            initial,
            planningProject.id,
            "active",
          );

        expect(
          moved.present.projects.find(
            (project) =>
              project.id ===
              planningProject.id,
          )?.status,
        ).toBe("active");

        expect(moved.past)
          .toHaveLength(1);

        expect(
          canUndoKanbanState(
            moved,
          ),
        ).toBe(true);

        expect(
          moved.optimisticUpdates,
        ).toHaveLength(1);

        expect(
          getLatestKanbanOptimisticUpdate(
            moved,
          )?.type,
        ).toBe("move");
      },
    );

    it(
      "commits an optimistic update",
      () => {
        const moved =
          moveKanbanProject(
            createKanbanState(
              projects,
            ),
            planningProject.id,
            "active",
          );

        const operation =
          getLatestKanbanOptimisticUpdate(
            moved,
          );

        expect(operation)
          .not.toBeNull();

        const committed =
          commitKanbanOptimisticUpdate(
            moved,
            operation!.id,
          );

        expect(
          committed
            .optimisticUpdates,
        ).toHaveLength(0);

        expect(
          committed.present
            .projects.find(
              (project) =>
                project.id ===
                planningProject.id,
            )?.status,
        ).toBe("active");
      },
    );

    it(
      "rolls back an optimistic update",
      () => {
        const moved =
          moveKanbanProject(
            createKanbanState(
              projects,
            ),
            planningProject.id,
            "active",
          );

        const operation =
          getLatestKanbanOptimisticUpdate(
            moved,
          );

        const rolledBack =
          rollbackKanbanOptimisticUpdate(
            moved,
            operation!.id,
          );

        expect(
          rolledBack.present
            .projects.find(
              (project) =>
                project.id ===
                planningProject.id,
            )?.status,
        ).toBe("planning");

        expect(
          rolledBack
            .optimisticUpdates,
        ).toHaveLength(0);
      },
    );

    it(
      "moves selected projects in bulk",
      () => {
        let state =
          createKanbanState(
            projects,
          );

        state =
          selectKanbanProject(
            state,
            planningProject.id,
          );

        state =
          selectKanbanProject(
            state,
            activeProject.id,
          );

        state =
          bulkMoveKanbanProjects(
            state,
            state.selection,
            "paused",
          );

        expect(
          state.present.projects.every(
            (project) =>
              project.status ===
              "paused",
          ),
        ).toBe(true);

        expect(
          state.selection.size,
        ).toBe(0);

        expect(
          state.bulkOperation.status,
        ).toBe("running");

        expect(
          getLatestKanbanOptimisticUpdate(
            state,
          )?.type,
        ).toBe(
          "bulk-move",
        );
      },
    );

    it(
      "supports undo and redo",
      () => {
        const moved =
          moveKanbanProject(
            createKanbanState(
              projects,
            ),
            planningProject.id,
            "active",
          );

        const undone =
          undoKanbanState(
            moved,
          );

        expect(
          undone.present.projects.find(
            (project) =>
              project.id ===
              planningProject.id,
          )?.status,
        ).toBe("planning");

        expect(
          canRedoKanbanState(
            undone,
          ),
        ).toBe(true);

        const redone =
          redoKanbanState(
            undone,
          );

        expect(
          redone.present.projects.find(
            (project) =>
              project.id ===
              planningProject.id,
          )?.status,
        ).toBe("active");
      },
    );

    it(
      "replaces external projects and preserves valid selection",
      () => {
        let state =
          createKanbanState(
            projects,
          );

        state =
          selectKanbanProject(
            state,
            planningProject.id,
          );

        state =
          selectKanbanProject(
            state,
            activeProject.id,
          );

        const replaced =
          replaceKanbanProjects(
            state,
            [
              planningProject,
            ],
          );

        expect(
          replaced.present.projects,
        ).toHaveLength(1);

        expect(
          replaced.selection.has(
            planningProject.id,
          ),
        ).toBe(true);

        expect(
          replaced.selection.has(
            activeProject.id,
          ),
        ).toBe(false);

        expect(replaced.past)
          .toHaveLength(0);
      },
    );
  },
);
