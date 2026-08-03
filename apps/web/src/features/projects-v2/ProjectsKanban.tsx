import {
  useEffect,
  useMemo,
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
  commitKanbanOptimisticUpdate,
  createKanbanState,
  endKanbanDrag,
  getLatestKanbanOptimisticUpdate,
  moveKanbanProject,
  replaceKanbanProjects,
  rollbackKanbanOptimisticUpdate,
  setKanbanDragTarget,
  type KanbanState,
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
    moveError,
    setMoveError,
  ] = useState<
    string | null
  >(null);

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

  useEffect(
    () => {
      if (
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

  const runMove =
    async (
      targetStatus:
        ProjectStatus,
    ): Promise<void> => {
      const projectId =
        state.dragging.projectId;

      if (
        !projectId ||
        updatingProjectId !== null ||
        busy
      ) {
        return;
      }

      const movedState =
        moveKanbanProject(
          state,
          projectId,
          targetStatus,
        );

      const operation =
        getLatestKanbanOptimisticUpdate(
          movedState,
        );

      if (
        movedState === state ||
        !operation ||
        operation.type !== "move"
      ) {
        setState(
          endKanbanDrag(
            state,
          ),
        );

        return;
      }

      const movedProject =
        movedState.present.projects.find(
          (project) =>
            project.id ===
            projectId,
        );

      if (!movedProject) {
        setState(
          endKanbanDrag(
            state,
          ),
        );

        return;
      }

      setMoveError(null);
      setUpdatingProjectId(
        projectId,
      );

      setState(
        movedState,
      );

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
      ]
        .filter(Boolean)
        .join(" ")}
      key={project.id}
      tabIndex={0}
      draggable={
        draggable &&
        !busy &&
        updatingProjectId ===
          null
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
        <span>
          {project.name
            .slice(0, 1)
            .toUpperCase()}
        </span>

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
