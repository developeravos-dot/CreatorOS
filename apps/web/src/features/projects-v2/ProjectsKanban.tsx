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
  moveProjectToColumn,
} from "./kanban-engine";

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

export default function ProjectsKanban({
  projects,
  busy,
  onSelect,
  onStatus,
}: ProjectsKanbanProps) {
  const { t } =
    useTranslation();

  const [
    optimisticProjects,
    setOptimisticProjects,
  ] = useState<
    EnterpriseProject[]
  >(
    () => projects,
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

  const [
    draggedProjectId,
    setDraggedProjectId,
  ] = useState<
    string | null
  >(null);

  const [
    activeDropColumn,
    setActiveDropColumn,
  ] = useState<
    ProjectStatus | null
  >(null);

  useEffect(
    () => {
      if (
        updatingProjectId ===
        null
      ) {
        setOptimisticProjects(
          projects,
        );
      }
    },
    [
      projects,
      updatingProjectId,
    ],
  );

  const board = useMemo(
    () =>
      buildKanbanBoard(
        optimisticProjects,
        {
          columns:
            DEFAULT_KANBAN_COLUMNS,
          sortField:
            "updatedAt",
          sortDirection:
            "desc",
        },
      ),
    [optimisticProjects],
  );

  const moveProject = async (
    targetStatus:
      ProjectStatus,
  ): Promise<void> => {
    if (
      !draggedProjectId ||
      updatingProjectId !== null
    ) {
      return;
    }

    const currentProjects =
      optimisticProjects;

    const result =
      moveProjectToColumn(
        currentProjects,
        draggedProjectId,
        targetStatus,
      );

    setDraggedProjectId(
      null,
    );

    setActiveDropColumn(
      null,
    );

    if (
      !result.changed ||
      !result.movedProject
    ) {
      return;
    }

    setMoveError(null);

    setUpdatingProjectId(
      result.movedProject.id,
    );

    setOptimisticProjects(
      result.projects,
    );

    try {
      await onStatus(
        result.movedProject,
      );
    } catch (
      error: unknown
    ) {
      setOptimisticProjects(
        currentProjects,
      );

      setMoveError(
        error instanceof Error
          ? error.message
          : "Project status update failed.",
      );
    } finally {
      setUpdatingProjectId(
        null,
      );
    }
  };

  if (
    optimisticProjects.length === 0
  ) {
    return (
      <div className="projects-v2-empty">
        <strong>
          {
            t(
              "projects.noProjects",
            )
          }
        </strong>

        <span>
          {
            t(
              "projects.adjustFilters",
            )
          }
        </span>
      </div>
    );
  }

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
              activeDropColumn ===
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

              setActiveDropColumn(
                column.id,
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

              setActiveDropColumn(
                null,
              );
            }}
            onDrop={(
              event,
            ) => {
              event.preventDefault();

              moveProject(
                column.id,
              );
            }}
          >
            <header className="projects-v2-kanban__column-header">
              <div>
                <strong>
                  {
                    statusLabels[
                      column.id
                    ] ??
                    column.label
                  }
                </strong>

                <span>
                  {
                    column.projectCount
                  }
                </span>
              </div>

              <small>
                {
                  column.projectCount ===
                  1
                    ? "1 project"
                    : `${column.projectCount} projects`
                }
              </small>
            </header>

            <div className="projects-v2-kanban__cards">
              {column.projects.length ===
              0 ? (
                <div className="projects-v2-kanban__empty-column">
                  No projects
                </div>
              ) : (
                column.projects.map(
                  (project) => (
                    <article
                      className={[
                        "projects-v2-kanban__card",
                        draggedProjectId ===
                        project.id
                          ? "projects-v2-kanban__card--dragging"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={
                        project.id
                      }
                      tabIndex={0}
                      draggable={
                        !busy &&
                        updatingProjectId ===
                          null
                      }
                      data-project-id={
                        project.id
                      }
                      onDragStart={(
                        event,
                      ) => {
                        setDraggedProjectId(
                          project.id,
                        );

                        event.dataTransfer.effectAllowed =
                          "move";

                        event.dataTransfer.setData(
                          "text/plain",
                          project.id,
                        );
                      }}
                      onDragEnd={() => {
                        setDraggedProjectId(
                          null,
                        );

                        setActiveDropColumn(
                          null,
                        );
                      }}
                      role="button"
                      aria-label={
                        `Open ${project.name}`
                      }
                      onClick={() =>
                        onSelect(
                          project,
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key ===
                            " "
                        ) {
                          event.preventDefault();

                          onSelect(
                            project,
                          );
                        }
                      }}
                    >
                      <div className="projects-v2-kanban__card-top">
                        <span>
                          {
                            project.name
                              .slice(
                                0,
                                1,
                              )
                              .toUpperCase()
                          }
                        </span>

                        <small>
                          {
                            platformLabels[
                              project
                                .platform
                            ] ??
                            project.platform
                          }
                        </small>
                      </div>

                      <strong>
                        {
                          project.name
                        }
                      </strong>

                      <p>
                        {
                          project.description ||
                          "No project description."
                        }
                      </p>

                      <footer>
                        <code>
                          {
                            project.id.slice(
                              0,
                              8,
                            )
                          }
                        </code>

                        <button
                          type="button"
                          disabled={
                            busy ||
                            updatingProjectId ===
                              project.id
                          }
                          onClick={(
                            event,
                          ) => {
                            event
                              .stopPropagation();

                            onStatus(
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
                  ),
                )
              )}
            </div>
          </section>
        ),
      )}

      {board.unassignedProjects.length >
      0 ? (
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
              (project) => (
                <article
                  className="projects-v2-kanban__card"
                  key={project.id}
                  tabIndex={0}
                  role="button"
                  aria-label={
                    `Open ${project.name}`
                  }
                  onClick={() =>
                    onSelect(
                      project,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                        "Enter" ||
                      event.key ===
                        " "
                    ) {
                      event.preventDefault();

                      onSelect(
                        project,
                      );
                    }
                  }}
                >
                  <div className="projects-v2-kanban__card-top">
                    <span>
                      {
                        project.name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()
                      }
                    </span>

                    <small>
                      {
                        project.status
                      }
                    </small>
                  </div>

                  <strong>
                    {
                      project.name
                    }
                  </strong>

                  <p>
                    {
                      project.description ||
                      "No project description."
                    }
                  </p>

                  <footer>
                    <code>
                      {
                        project.id.slice(
                          0,
                          8,
                        )
                      }
                    </code>

                    <button
                      type="button"
                      disabled={
                        busy
                      }
                      onClick={(
                        event,
                      ) => {
                        event
                          .stopPropagation();

                        onStatus(
                          project,
                        );
                      }}
                    >
                      {
                        t(
                          "projects.updateStatus",
                        )
                      }
                    </button>
                  </footer>
                </article>
              ),
            )}
          </div>
        </section>
      ) : null}
      </div>
    </div>
  );
}
