import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

import {
  useTranslation,
} from "../../hooks";

import {
  platformLabels,
  statusLabels,
} from "../../utils/contentLabels";

import {
  buildKanbanBoard,
  DEFAULT_KANBAN_COLUMNS,
} from "./kanban-engine";

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
  setKanbanDragTarget,
  toggleKanbanProjectSelection,
  type KanbanState,
  undoKanbanState,
} from "./kanban-state-engine";

interface ProjectsKanbanProps {
  projects: EnterpriseProject[];
  busy: boolean;
  onSelect: (
    project: EnterpriseProject,
  ) => void;
  onStatus: (
    project: EnterpriseProject,
  ) => void | Promise<void>;
}

const BULK_STATUSES:
  readonly ProjectStatus[] = [
    "planning",
    "active",
    "paused",
    "completed",
  ];

function createProjectsSignature(
  projects:
    readonly EnterpriseProject[],
): string {
  return projects
    .map(
      (project) =>
        [
          project.id,
          project.status,
          project.updatedAt,
        ].join(":"),
    )
    .sort()
    .join("|");
}

function findChangedProjects(
  current:
    readonly EnterpriseProject[],
  next:
    readonly EnterpriseProject[],
): EnterpriseProject[] {
  const currentById =
    new Map(
      current.map(
        (project) => [
          project.id,
          project,
        ],
      ),
    );

  return next.filter(
    (project) => {
      const previous =
        currentById.get(
          project.id,
        );

      return (
        previous !== undefined &&
        (
          previous.status !==
            project.status ||
          previous.updatedAt !==
            project.updatedAt
        )
      );
    },
  );
}

export default function ProjectsKanban({
  projects,
  busy,
  onSelect,
  onStatus,
}: ProjectsKanbanProps) {
  const { t } =
    useTranslation();

  const [
    state,
    setState,
  ] = useState<KanbanState>(
    () =>
      createKanbanState(
        projects,
      ),
  );

  const [
    updatingProjectId,
    setUpdatingProjectId,
  ] = useState<
    string | null
  >(null);

  const [
    operationBusy,
    setOperationBusy,
  ] = useState(false);

  const [
    moveError,
    setMoveError,
  ] = useState<
    string | null
  >(null);

  const [
    bulkTargetStatus,
    setBulkTargetStatus,
  ] = useState<ProjectStatus>(
    "active",
  );

  const externalSignature =
    useMemo(
      () =>
        createProjectsSignature(
          projects,
        ),
      [projects],
    );

  const internalSignature =
    useMemo(
      () =>
        createProjectsSignature(
          state.present.projects,
        ),
      [state.present.projects],
    );

  const lastExternalSignature =
    useRef(
      externalSignature,
    );

  useEffect(
    () => {
      if (
        lastExternalSignature
          .current ===
        externalSignature
      ) {
        return;
      }

      lastExternalSignature.current =
        externalSignature;

      if (
        operationBusy ||
        updatingProjectId !==
          null ||
        state.optimisticUpdates
          .length > 0 ||
        externalSignature ===
          internalSignature
      ) {
        return;
      }

      setState(
        (current) =>
          replaceKanbanProjects(
            current,
            projects,
          ),
      );
    },
    [
      externalSignature,
      internalSignature,
      operationBusy,
      projects,
      state.optimisticUpdates.length,
      updatingProjectId,
    ],
  );

  const board =
    useMemo(
      () =>
        buildKanbanBoard(
          state.present.projects,
          {
            columns:
              DEFAULT_KANBAN_COLUMNS,
            sortField:
              "updatedAt",
            sortDirection:
              "desc",
          },
        ),
      [state.present.projects],
    );

  const disabled =
    busy ||
    operationBusy ||
    updatingProjectId !==
      null;

  const persistTransition =
    async (
      previousState:
        KanbanState,
      nextState:
        KanbanState,
      rollbackWithEngine:
        boolean,
    ): Promise<boolean> => {
      const operation =
        getLatestKanbanOptimisticUpdate(
          nextState,
        );

      if (!operation) {
        return false;
      }

      const changedProjects =
        findChangedProjects(
          previousState
            .present.projects,
          nextState
            .present.projects,
        );

      if (
        changedProjects.length ===
        0
      ) {
        setState(
          nextState,
        );

        return false;
      }

      setMoveError(null);
      setOperationBusy(true);
      setState(nextState);

      try {
        for (
          const project of
          changedProjects
        ) {
          await onStatus(
            project,
          );
        }

        setState(
          (current) =>
            commitKanbanOptimisticUpdate(
              current,
              operation.id,
            ),
        );

        return true;
      }
      catch (
        error: unknown
      ) {
        setState(
          (current) =>
            rollbackWithEngine
              ? rollbackKanbanOptimisticUpdate(
                  current,
                  operation.id,
                )
              : previousState,
        );

        setMoveError(
          error instanceof Error
            ? error.message
            : "Kanban operation failed.",
        );

        return false;
      }
      finally {
        setOperationBusy(false);
      }
    };

  const runMove =
    async (
      targetStatus:
        ProjectStatus,
    ): Promise<void> => {
      const projectId =
        state.dragging.projectId;

      if (
        !projectId ||
        disabled
      ) {
        return;
      }

      const previousState =
        state;

      const movedState =
        moveKanbanProject(
          previousState,
          projectId,
          targetStatus,
        );

      const operation =
        getLatestKanbanOptimisticUpdate(
          movedState,
        );

      if (
        movedState ===
          previousState ||
        !operation ||
        operation.type !==
          "move"
      ) {
        setState(
          endKanbanDrag(
            previousState,
          ),
        );

        return;
      }

      const movedProject =
        movedState.present
          .projects.find(
            (project) =>
              project.id ===
              projectId,
          );

      if (!movedProject) {
        setState(
          endKanbanDrag(
            previousState,
          ),
        );

        return;
      }

      setUpdatingProjectId(
        projectId,
      );

      setMoveError(null);
      setState(movedState);

      try {
        await onStatus(
          movedProject,
        );

        setState(
          (current) =>
            commitKanbanOptimisticUpdate(
              current,
              operation.id,
            ),
        );
      }
      catch (
        error: unknown
      ) {
        setState(
          (current) =>
            rollbackKanbanOptimisticUpdate(
              current,
              operation.id,
            ),
        );

        setMoveError(
          error instanceof Error
            ? error.message
            : "Project status update failed.",
        );
      }
      finally {
        setUpdatingProjectId(
          null,
        );
      }
    };

  const runBulkMove =
    async (): Promise<void> => {
      if (
        disabled ||
        state.selection.size ===
          0
      ) {
        return;
      }

      const previousState =
        state;

      const nextState =
        bulkMoveKanbanProjects(
          previousState,
          previousState.selection,
          bulkTargetStatus,
        );

      if (
        nextState ===
        previousState
      ) {
        return;
      }

      await persistTransition(
        previousState,
        nextState,
        true,
      );
    };

  const runUndo =
    async (): Promise<void> => {
      if (
        disabled ||
        !canUndoKanbanState(
          state,
        )
      ) {
        return;
      }

      const previousState =
        state;

      const nextState =
        undoKanbanState(
          previousState,
        );

      await persistTransition(
        previousState,
        nextState,
        false,
      );
    };

  const runRedo =
    async (): Promise<void> => {
      if (
        disabled ||
        !canRedoKanbanState(
          state,
        )
      ) {
        return;
      }

      const previousState =
        state;

      const nextState =
        redoKanbanState(
          previousState,
        );

      await persistTransition(
        previousState,
        nextState,
        false,
      );
    };

  useEffect(
    () => {
      const handleKeyDown = (
        event: KeyboardEvent,
      ): void => {
        if (
          !event.ctrlKey &&
          !event.metaKey
        ) {
          return;
        }

        const key =
          event.key.toLowerCase();

        if (
          key === "z" &&
          event.shiftKey
        ) {
          event.preventDefault();

          void runRedo();

          return;
        }

        if (key === "z") {
          event.preventDefault();

          void runUndo();

          return;
        }

        if (key === "y") {
          event.preventDefault();

          void runRedo();
        }
      };

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [
      disabled,
      state,
    ],
  );

  if (
    state.present.projects.length ===
    0
  ) {
    return (
      <div className="projects-v2-empty">
        <strong>
          {t(
            "projects.noProjects",
          )}
        </strong>

        <span>
          {t(
            "projects.adjustFilters",
          )}
        </span>
      </div>
    );
  }

  const renderProjectCard = (
    project: EnterpriseProject,
    draggable: boolean,
  ) => (
    <article
      className={[
        "projects-v2-kanban__card",
        state.dragging.projectId ===
        project.id
          ? "projects-v2-kanban__card--dragging"
          : "",
        state.selection.has(
          project.id,
        )
          ? "projects-v2-kanban__card--selected"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      key={project.id}
      tabIndex={0}
      draggable={
        draggable &&
        !disabled
      }
      data-project-id={
        project.id
      }
      onDragStart={
        draggable
          ? (event) => {
              setState(
                (current) =>
                  beginKanbanDrag(
                    current,
                    project.id,
                  ),
              );

              event.dataTransfer.effectAllowed =
                "move";

              event.dataTransfer.setData(
                "text/plain",
                project.id,
              );
            }
          : undefined
      }
      onDragEnd={
        draggable
          ? () => {
              setState(
                (current) =>
                  endKanbanDrag(
                    current,
                  ),
              );
            }
          : undefined
      }
      role="button"
      aria-label={
        `Open ${project.name}`
      }
      onClick={() =>
        onSelect(project)
      }
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          onSelect(project);
        }
      }}
    >
      <div className="projects-v2-kanban__card-top">
        <label
          className="projects-v2-kanban__select"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <input
            type="checkbox"
            aria-label={`Select ${project.name}`}
            checked={
              state.selection.has(
                project.id,
              )
            }
            disabled={disabled}
            onChange={() => {
              setState(
                (current) =>
                  toggleKanbanProjectSelection(
                    current,
                    project.id,
                  ),
              );
            }}
          />

          <span>
            {project.name
              .slice(0, 1)
              .toUpperCase()}
          </span>
        </label>

        <small>
          {platformLabels[
            project.platform
          ] ??
            project.platform}
        </small>
      </div>

      <strong>
        {project.name}
      </strong>

      <p>
        {project.description ||
          "No project description."}
      </p>

      <footer>
        <code>
          {project.id.slice(
            0,
            8,
          )}
        </code>

        <button
          type="button"
          disabled={
            busy ||
            updatingProjectId ===
              project.id
          }
          onClick={(event) => {
            event.stopPropagation();

            void onStatus(
              project,
            );
          }}
        >
          {updatingProjectId ===
          project.id
            ? "Updating..."
            : t(
                "projects.updateStatus",
              )}
        </button>
      </footer>
    </article>
  );

  return (
    <div className="projects-v2-kanban-shell">
      <div className="projects-v2-kanban-actions">
        <div className="projects-v2-kanban-actions__history">
          <button
            type="button"
            disabled={
              disabled ||
              !canUndoKanbanState(
                state,
              )
            }
            onClick={() => {
              void runUndo();
            }}
          >
            Undo
          </button>

          <button
            type="button"
            disabled={
              disabled ||
              !canRedoKanbanState(
                state,
              )
            }
            onClick={() => {
              void runRedo();
            }}
          >
            Redo
          </button>
        </div>

        <div className="projects-v2-kanban-actions__bulk">
          <strong>
            {state.selection.size}
            {" selected"}
          </strong>

          <select
            aria-label="Bulk move status"
            value={bulkTargetStatus}
            disabled={disabled}
            onChange={(event) => {
              setBulkTargetStatus(
                event.target.value as
                  ProjectStatus,
              );
            }}
          >
            {BULK_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            disabled={
              disabled ||
              state.selection.size ===
                0
            }
            onClick={() => {
              void runBulkMove();
            }}
          >
            Move selected
          </button>

          <button
            type="button"
            disabled={
              disabled ||
              state.selection.size ===
                0
            }
            onClick={() => {
              setState(
                (current) =>
                  clearKanbanSelection(
                    current,
                  ),
              );
            }}
          >
            Clear selection
          </button>
        </div>
      </div>

      {moveError ? (
        <div
          className="projects-v2-kanban-error"
          role="alert"
        >
          <span>
            {moveError}
          </span>

          <button
            type="button"
            onClick={() =>
              setMoveError(null)
            }
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="projects-v2-kanban">
        {board.columns.map(
          (column) => (
            <section
              className={[
                "projects-v2-kanban__column",
                state.dragging
                  .targetStatus ===
                column.id
                  ? "projects-v2-kanban__column--drop-active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={column.id}
              data-column-id={
                column.id
              }
              onDragEnter={(
                event,
              ) => {
                event.preventDefault();

                setState(
                  (current) =>
                    setKanbanDragTarget(
                      current,
                      column.id,
                    ),
                );
              }}
              onDragOver={(
                event,
              ) => {
                event.preventDefault();

                event.dataTransfer.dropEffect =
                  "move";
              }}
              onDragLeave={(
                event,
              ) => {
                if (
                  event.currentTarget.contains(
                    event.relatedTarget as
                      Node | null,
                  )
                ) {
                  return;
                }

                setState(
                  (current) =>
                    setKanbanDragTarget(
                      current,
                      null,
                    ),
                );
              }}
              onDrop={(
                event,
              ) => {
                event.preventDefault();

                void runMove(
                  column.id,
                );
              }}
            >
              <header className="projects-v2-kanban__column-header">
                <div>
                  <strong>
                    {statusLabels[
                      column.id
                    ] ??
                      column.label}
                  </strong>

                  <span>
                    {
                      column.projectCount
                    }
                  </span>
                </div>

                <small>
                  {column.projectCount ===
                  1
                    ? "1 project"
                    : `${column.projectCount} projects`}
                </small>
              </header>

              <div className="projects-v2-kanban__cards">
                {column.projects
                  .length === 0 ? (
                  <div className="projects-v2-kanban__empty-column">
                    No projects
                  </div>
                ) : (
                  column.projects.map(
                    (project) =>
                      renderProjectCard(
                        project,
                        true,
                      ),
                  )
                )}
              </div>
            </section>
          ),
        )}

        {board.unassignedProjects
          .length > 0 ? (
          <section className="projects-v2-kanban__column projects-v2-kanban__column--unassigned">
            <header className="projects-v2-kanban__column-header">
              <div>
                <strong>
                  Unassigned
                </strong>

                <span>
                  {
                    board
                      .unassignedProjects
                      .length
                  }
                </span>
              </div>

              <small>
                Projects outside the configured workflow
              </small>
            </header>

            <div className="projects-v2-kanban__cards">
              {board.unassignedProjects.map(
                (project) =>
                  renderProjectCard(
                    project,
                    false,
                  ),
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
