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
  ProjectDetailsPanel,
  ProjectsKanban,
  ProjectsTable,
  ProjectsToolbar,
  useProjectsQuery,
} from "../features/projects-v2";

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

  const [search, setSearch] =
    useState("");

  const [platform, setPlatform] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [
    viewMode,
    setViewMode,
  ] = useState<
    "table" | "kanban"
  >("table");

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<
    EnterpriseProject | null
  >(null);

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

  const filteredProjects =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return projects.filter(
        (project) => {
          const matchesSearch =
            normalizedSearch.length ===
              0 ||
            project.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            project.id
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            project.platform
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            project.status
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesPlatform =
            platform === "all" ||
            project.platform ===
              platform;

          const matchesStatus =
            status === "all" ||
            project.status ===
              status;

          return (
            matchesSearch &&
            matchesPlatform &&
            matchesStatus
          );
        },
      );
    }, [
      platform,
      projects,
      search,
      status,
    ]);

  useEffect(() => {
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
  }, [
    projects,
    selectedProject,
  ]);

  const disabled =
    busy ||
    loading ||
    refreshing;

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
                filteredProjects.length
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
        viewMode={viewMode}
        platforms={platforms}
        statuses={statuses}
        disabled={disabled}
        onSearchChange={setSearch}
        onPlatformChange={
          setPlatform
        }
        onStatusChange={setStatus}
        onViewModeChange={
          setViewMode
        }
        onCreate={() =>
          void onCreate()
        }
      />

      <section className="projects-v2-content">
        {viewMode === "table" ? (
          <ProjectsTable
            projects={
              filteredProjects
            }
            selectedId={
              selectedProject?.id
            }
            busy={disabled}
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
              filteredProjects
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
