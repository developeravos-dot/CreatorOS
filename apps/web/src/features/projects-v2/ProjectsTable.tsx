import type { EnterpriseProject } from "../../enterprise-api";
import {
  platformLabels,
  statusLabels,
} from "../../utils/contentLabels";

interface ProjectsTableProps {
  projects: EnterpriseProject[];
  selectedId?: string;
  busy: boolean;
  onSelect: (project: EnterpriseProject) => void;
  onStatus: (project: EnterpriseProject) => void;
  onDelete: (project: EnterpriseProject) => void;
}

export default function ProjectsTable({
  projects,
  selectedId,
  busy,
  onSelect,
  onStatus,
  onDelete,
}: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="projects-v2-empty">
        <strong>No projects found</strong>
        <span>Adjust the filters or create a new project.</span>
      </div>
    );
  }

  return (
    <div className="projects-v2-table-wrap">
      <table className="projects-v2-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Platform</th>
            <th>Status</th>
            <th>ID</th>
            <th aria-label="Actions" />
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className={
                selectedId === project.id
                  ? "projects-v2-table__selected"
                  : ""
              }
              onClick={() => onSelect(project)}
            >
              <td>
                <div className="projects-v2-project-cell">
                  <span>{project.name.slice(0, 1).toUpperCase()}</span>

                  <div>
                    <strong>{project.name}</strong>
                    <small>CreatorOS project</small>
                  </div>
                </div>
              </td>

              <td>
                {platformLabels[project.platform] ?? project.platform}
              </td>

              <td>
                <span className="projects-v2-status">
                  {statusLabels[project.status] ?? project.status}
                </span>
              </td>

              <td>
                <code>{project.id.slice(0, 8)}</code>
              </td>

              <td>
                <div className="projects-v2-row-actions">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={(event) => {
                      event.stopPropagation();
                      onStatus(project);
                    }}
                  >
                    Update status
                  </button>

                  <button
                    type="button"
                    className="danger"
                    disabled={busy}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(project);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
