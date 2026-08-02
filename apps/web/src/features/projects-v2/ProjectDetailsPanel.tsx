import type { EnterpriseProject } from "../../enterprise-api";
import { useTranslation } from "../../hooks";
import {
  platformLabels,
  statusLabels,
} from "../../utils/contentLabels";

interface ProjectDetailsPanelProps {
  project: EnterpriseProject | null;
  busy: boolean;
  onClose: () => void;
  onStatus: (project: EnterpriseProject) => void;
  onDelete: (project: EnterpriseProject) => void;
}

export default function ProjectDetailsPanel({
  project,
  busy,
  onClose,
  onStatus,
  onDelete,
}: ProjectDetailsPanelProps) {

  const { t } = useTranslation();
  if (!project) {
    return null;
  }

  return (
    <div
      className="projects-v2-details-overlay"
      onMouseDown={onClose}
    >
      <aside
        className="projects-v2-details"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="projects-v2-details__header">
          <div>
            <span>{t("projects.details")}</span>
            <h2>{project.name}</h2>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="projects-v2-details__identity">
          <span>{project.name.slice(0, 1).toUpperCase()}</span>

          <div>
            <strong>{project.name}</strong>
            <small>{project.id}</small>
          </div>
        </div>

        <dl className="projects-v2-details__list">
          <div>
            <dt>{t("projects.platform")}</dt>
            <dd>
              {platformLabels[project.platform] ?? project.platform}
            </dd>
          </div>

          <div>
            <dt>{t("projects.status")}</dt>
            <dd>
              {statusLabels[project.status] ?? project.status}
            </dd>
          </div>

          {Object.entries(project)
            .filter(
              ([key]) =>
                !["id", "name", "platform", "status"].includes(key),
            )
            .slice(0, 8)
            .map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value ?? "—")}
                </dd>
              </div>
            ))}
        </dl>

        <footer className="projects-v2-details__actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatus(project)}
          >
            {t("projects.updateStatus")}
          </button>

          <button
            type="button"
            className="danger"
            disabled={busy}
            onClick={() => onDelete(project)}
          >
            {t("projects.deleteProject")}
          </button>
        </footer>
      </aside>
    </div>
  );
}

