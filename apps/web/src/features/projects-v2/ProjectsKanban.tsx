import type { EnterpriseProject } from "../../enterprise-api";
import { useTranslation } from "../../hooks";
import {
  platformLabels,
  statusLabels,
} from "../../utils/contentLabels";

interface ProjectsKanbanProps {
  projects: EnterpriseProject[];
  busy: boolean;
  onSelect: (project: EnterpriseProject) => void;
  onStatus: (project: EnterpriseProject) => void;
}

export default function ProjectsKanban({
  projects,
  busy,
  onSelect,
  onStatus,
}: ProjectsKanbanProps) {

  const { t } = useTranslation();
  const statusGroups = Array.from(
    new Set(projects.map((project) => project.status)),
  );

  if (projects.length === 0) {
    return (
      <div className="projects-v2-empty">
        <strong>{t("projects.noProjects")}</strong>
        <span>{t("projects.adjustFilters")}</span>
      </div>
    );
  }

  return (
    <div className="projects-v2-kanban">
      {statusGroups.map((status) => {
        const items = projects.filter(
          (project) => project.status === status,
        );

        return (
          <section className="projects-v2-kanban__column" key={status}>
            <header>
              <div>
                <span className="projects-v2-kanban__dot" />
                <strong>{statusLabels[status] ?? status}</strong>
              </div>

              <small>{items.length}</small>
            </header>

            <div className="projects-v2-kanban__items">
              {items.map((project) => (
                <article
                  className="projects-v2-kanban__card"
                  key={project.id}
                  onClick={() => onSelect(project)}
                >
                  <div className="projects-v2-kanban__avatar">
                    {project.name.slice(0, 1).toUpperCase()}
                  </div>

                  <h3>{project.name}</h3>

                  <p>
                    {platformLabels[project.platform] ?? project.platform}
                  </p>

                  <footer>
                    <code>{project.id.slice(0, 8)}</code>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={(event) => {
                        event.stopPropagation();
                        onStatus(project);
                      }}
                    >
                      Update
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

