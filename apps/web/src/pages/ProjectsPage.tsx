import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useTranslation,
} from "../hooks";

import type {
  EnterpriseProject,
} from "../enterprise-api";

import {
  buildProjectsWorkspaceResult,
  deselectProjects,
  runBulkAction,
  loadProjectsWorkspacePreferences,
  selectProjects,
  toggleProjectSelection,
  ProjectDetailsPanel,
  ProjectsKanban,
  ProjectsPagination,
  ProjectsTable,
  ProjectsToolbar,
  saveProjectsWorkspacePreferences,
  type ProjectsWorkspacePreferences,
} from "../features/projects-v2";

import {
  useProjectsQuery,
} from "../features/projects-v2/useProjectsQuery";

import "../features/projects-v2/projects-v2.css";

interface ProjectsPageProps {
  projects: EnterpriseProject[];
  busy: boolean;
  onCreate: () => Promise<void>;
  onStatus: (
    project: EnterpriseProject,
  ) => Promise<void>;
  onDelete: (
    project: EnterpriseProject,
  ) => Promise<void>;
}

export default function ProjectsPage({
  projects: initialProjects,
  busy,
  onCreate,
  onStatus,
  onDelete,
}: ProjectsPageProps) {
  const { t } = useTranslation();

  const {
    projects,
    loading,
    refreshing,
    error,
    updatedAt,
    refresh,
  } = useProjectsQuery({
    initialProjects,
  });

  const [
    preferences,
    setPreferences,
  ] = useState<
    ProjectsWorkspacePreferences
  >(
    loadProjectsWorkspacePreferences,
  );

  const [search, setSearch] =
    useState("");

  const [platform, setPlatform] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<
    EnterpriseProject | null
  >(null);

  const [
    selectedProjectIds,
    setSelectedProjectIds,
  ] = useState<
    Set<string>
  >(
    () =>
      new Set<string>(),
  );

  const [
    bulkActionBusy,
    setBulkActionBusy,
  ] = useState(false);

  const platforms = useMemo(
    () =>
      Array.from(
        new Set(
          projects.map(
            (project) =>
              project.platform,
          ),
        ),
      ),
    [projects],
  );

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          projects.map(
            (project) =>
              project.status,
          ),
        ),
      ),
    [projects],
  );

  const workspaceResult =
    useMemo(
      () =>
        buildProjectsWorkspaceResult(
          projects,
          {
            search,
            platform,
            status,
            page,
          },
          preferences,
        ),
      [
        page,
        platform,
        preferences,
        projects,
        search,
        status,
      ],
    );

  useEffect(
    () => {
      saveProjectsWorkspacePreferences(
        preferences,
      );
    },
    [preferences],
  );

  useEffect(
    () => {
      if (
        page !==
        workspaceResult.page
      ) {
        setPage(
          workspaceResult.page,
        );
      }
    },
    [
      page,
      workspaceResult.page,
    ],
  );

  useEffect(
    () => {
      if (
        selectedProject &&
        !projects.some(
          (project) =>
            project.id ===
            selectedProject.id,
        )
      ) {
        setSelectedProject(null);
      }

      const availableIds =
        new Set(
          projects.map(
            (project) =>
              project.id,
          ),
        );

      setSelectedProjectIds(
        (current) => {
          const next =
            new Set(
              [...current].filter(
                (projectId) =>
                  availableIds.has(
                    projectId,
                  ),
              ),
            );

          if (
            next.size ===
            current.size
          ) {
            return current;
          }

          return next;
        },
      );
    },
    [
      projects,
      selectedProject,
    ],
  );

  const disabled =
    busy ||
    loading ||
    refreshing ||
    bulkActionBusy;

  const changeSearch = (
    value: string,
  ): void => {
    setSearch(value);
    setPage(1);
  };

  const changePlatform = (
    value: string,
  ): void => {
    setPlatform(value);
    setPage(1);
  };

  const changeStatus = (
    value: string,
  ): void => {
    setStatus(value);
    setPage(1);
  };

  const changeViewMode = (
    value:
      ProjectsWorkspacePreferences[
        "viewMode"
      ],
  ): void => {
    setPreferences(
      (current) => ({
        ...current,
        viewMode: value,
      }),
    );
  };

  const changeSortField = (
    value:
      ProjectsWorkspacePreferences[
        "sortField"
      ],
  ): void => {
    setPreferences(
      (current) => {
        if (
          current.sortField ===
          value
        ) {
          return {
            ...current,
            sortDirection:
              current.sortDirection ===
              "asc"
                ? "desc"
                : "asc",
          };
        }

        return {
          ...current,
          sortField: value,
          sortDirection: "asc",
        };
      },
    );

    setPage(1);
  };

  const changeSortDirection = (
    value:
      ProjectsWorkspacePreferences[
        "sortDirection"
      ],
  ): void => {
    setPreferences(
      (current) => ({
        ...current,
        sortDirection: value,
      }),
    );

    setPage(1);
  };

  const changePageSize = (
    value: number,
  ): void => {
    setPreferences(
      (current) => ({
        ...current,
        pageSize: value,
      }),
    );

    setPage(1);
  };

  const changePage = (
    value: number,
  ): void => {
    setPage(
      Math.min(
        Math.max(
          value,
          1,
        ),
        workspaceResult.totalPages,
      ),
    );
  };

  const toggleSelection = (
    projectId: string,
  ): void => {
    setSelectedProjectIds(
      (current) =>
        toggleProjectSelection(
          current,
          projectId,
        ),
    );
  };

  const togglePageSelection = (
    projectIds:
      readonly string[],
    selected: boolean,
  ): void => {
    setSelectedProjectIds(
      (current) =>
        selected
          ? selectProjects(
              current,
              projectIds,
            )
          : deselectProjects(
              current,
              projectIds,
            ),
    );
  };

  const clearSelection =
    (): void => {
      setSelectedProjectIds(
        new Set<string>(),
      );
    };

  const updateSelectedProjectsStatus =
    async (): Promise<void> => {
      const projectIds = [
        ...selectedProjectIds,
      ];

      if (
        projectIds.length === 0
      ) {
        return;
      }

      setBulkActionBusy(true);

      try {
        const result =
          await runBulkAction(
            projectIds,
            async (
              projectId,
            ) => {
              const project =
                projects.find(
                  (item) =>
                    item.id ===
                    projectId,
                );

              if (!project) {
                return false;
              }

              await onStatus(
                project,
              );

              return true;
            },
          );

        setSelectedProjectIds(
          new Set(
            result.failed,
          ),
        );
      } finally {
        setBulkActionBusy(
          false,
        );
      }
    };

  const deleteSelectedProjects =
    async (): Promise<void> => {
      const projectIds = [
        ...selectedProjectIds,
      ];

      if (
        projectIds.length === 0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${projectIds.length} selected projects?`,
        );

      if (!confirmed) {
        return;
      }

      setBulkActionBusy(true);

      try {
        const result =
          await runBulkAction(
            projectIds,
            async (
              projectId,
            ) => {
              const project =
                projects.find(
                  (item) =>
                    item.id ===
                    projectId,
                );

              if (!project) {
                return false;
              }

              await onDelete(
                project,
              );

              return true;
            },
          );

        setSelectedProjectIds(
          new Set(
            result.failed,
          ),
        );

        if (
          selectedProject &&
          result.succeeded.includes(
            selectedProject.id,
          )
        ) {
          setSelectedProject(
            null,
          );
        }
      } finally {
        setBulkActionBusy(
          false,
        );
      }
    };

  return (
    <div className="projects-v2">
      <header className="projects-v2-header">
        <div>
          <span>
            {t("projects.workspace")}
          </span>

          <h2>
            {t("projects.title")}
          </h2>

          <p>
            Organize, search and manage
            all CreatorOS production
            workspaces from one
            operational view.
          </p>
        </div>

        <div className="projects-v2-header__stats">
          <div>
            <strong>
              {projects.length}
            </strong>

            <span>
              {t("projects.total")}
            </span>
          </div>

          <div>
            <strong>
              {
                workspaceResult
                  .totalProjects
              }
            </strong>

            <span>
              {t("projects.visible")}
            </span>
          </div>
        </div>
      </header>

      <section className="projects-v2-query-status">
        <div>
          <strong>
            {loading
              ? "Loading projects..."
              : refreshing
                ? "Refreshing..."
                : "Projects synchronized"}
          </strong>

          <span>
            {updatedAt > 0
              ? `Last update: ${new Date(
                  updatedAt,
                ).toLocaleTimeString()}`
              : "Waiting for first synchronization"}
          </span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            void refresh()
          }
        >
          Refresh
        </button>
      </section>

      {error ? (
        <div
          className="projects-v2-query-error"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <ProjectsToolbar
        search={search}
        platform={platform}
        status={status}
        viewMode={
          preferences.viewMode
        }
        sortField={
          preferences.sortField
        }
        sortDirection={
          preferences.sortDirection
        }
        platforms={platforms}
        statuses={statuses}
        disabled={disabled}
        onSearchChange={
          changeSearch
        }
        onPlatformChange={
          changePlatform
        }
        onStatusChange={
          changeStatus
        }
        onViewModeChange={
          changeViewMode
        }
        onSortFieldChange={
          changeSortField
        }
        onSortDirectionChange={
          changeSortDirection
        }
        onCreate={() =>
          void onCreate()
        }
      />

      {selectedProjectIds.size > 0 ? (
        <section className="projects-v2-selection-bar">
          <div>
            <strong>
              {
                selectedProjectIds.size
              }
            </strong>

            <span>
              projects selected
            </span>
          </div>

          <div className="projects-v2-selection-bar__actions">
            <button
              type="button"
              disabled={
                bulkActionBusy
              }
              onClick={
                clearSelection
              }
            >
              Clear selection
            </button>

            <button
              type="button"
              disabled={
                bulkActionBusy
              }
              onClick={() =>
                void updateSelectedProjectsStatus()
              }
            >
              {bulkActionBusy
                ? "Updating..."
                : "Update selected status"}
            </button>

            <button
              type="button"
              className="danger"
              disabled={
                bulkActionBusy
              }
              onClick={() =>
                void deleteSelectedProjects()
              }
            >
              {bulkActionBusy
                ? "Deleting..."
                : "Delete selected"}
            </button>
          </div>
        </section>
      ) : null}

      <section className="projects-v2-content">
        {preferences.viewMode ===
        "table" ? (
          <ProjectsTable
            projects={
              workspaceResult.projects
            }
            selectedId={
              selectedProject?.id
            }
            selectedIds={
              selectedProjectIds
            }
            busy={disabled}
            sortField={
              preferences.sortField
            }
            sortDirection={
              preferences.sortDirection
            }
            onSort={
              changeSortField
            }
            onToggleSelection={
              toggleSelection
            }
            onTogglePageSelection={
              togglePageSelection
            }
            onSelect={
              setSelectedProject
            }
            onStatus={(project) =>
              void onStatus(project)
            }
            onDelete={(project) =>
              void onDelete(project)
            }
          />
        ) : (
          <ProjectsKanban
            projects={
              workspaceResult.projects
            }
            busy={disabled}
            onSelect={
              setSelectedProject
            }
            onStatus={(project) =>
              void onStatus(project)
            }
          />
        )}
      </section>

      <ProjectsPagination
        page={
          workspaceResult.page
        }
        totalPages={
          workspaceResult.totalPages
        }
        pageSize={
          workspaceResult.pageSize
        }
        totalProjects={
          workspaceResult.totalProjects
        }
        disabled={disabled}
        onPageChange={
          changePage
        }
        onPageSizeChange={
          changePageSize
        }
      />

      <ProjectDetailsPanel
        project={selectedProject}
        busy={disabled}
        onClose={() =>
          setSelectedProject(null)
        }
        onStatus={(project) =>
          void onStatus(project)
        }
        onDelete={(project) =>
          void onDelete(project)
        }
      />
    </div>
  );
}
