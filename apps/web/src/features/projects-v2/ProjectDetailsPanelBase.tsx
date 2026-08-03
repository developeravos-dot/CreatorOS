import type {
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

interface ProjectDetailsPanelProps {
  project: EnterpriseProject | null;
  busy: boolean;
  onClose: () => void;
  onStatus: (
    project: EnterpriseProject,
  ) => void;
  onDelete: (
    project: EnterpriseProject,
  ) => void;
}

const PROJECT_STATUSES:
  readonly ProjectStatus[] = [
  "planning",
  "active",
  "paused",
  "completed",
];

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function getNextStatus(
  status: ProjectStatus,
): ProjectStatus {
  const currentIndex =
    PROJECT_STATUSES.indexOf(
      status,
    );

  const nextIndex =
    currentIndex < 0
      ? 0
      : (
          currentIndex + 1
        ) %
        PROJECT_STATUSES.length;

  return (
    PROJECT_STATUSES[
      nextIndex
    ] ?? "planning"
  );
}

function getHealthScore(
  project: EnterpriseProject,
): number {
  let score = 40;

  if (
    project.name.trim().length >=
    5
  ) {
    score += 15;
  }

  if (
    project.description
      .trim()
      .length >= 20
  ) {
    score += 15;
  }

  if (
    project.status === "active"
  ) {
    score += 20;
  }

  if (
    project.status ===
    "completed"
  ) {
    score += 30;
  }

  return Math.min(
    score,
    100,
  );
}

export default function ProjectDetailsPanel({
  project,
  busy,
  onClose,
  onStatus,
  onDelete,
}: ProjectDetailsPanelProps) {
  if (!project) {
    return null;
  }

  const nextStatus =
    getNextStatus(
      project.status,
    );

  const healthScore =
    getHealthScore(
      project,
    );

  const statusProject: EnterpriseProject =
    {
      ...project,
      status: nextStatus,
      updatedAt:
        new Date().toISOString(),
    };

  return (
    <div
      className="projects-v2-details-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <aside
        className="projects-v2-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-details-title"
      >
        <header className="projects-v2-details__header">
          <div>
            <span className="projects-v2-details__eyebrow">
              Project workspace
            </span>

            <h2 id="project-details-title">
              {project.name}
            </h2>

            <p>
              {project.platform}
              {" ┬╖ "}
              {project.status}
            </p>
          </div>

          <button
            type="button"
            className="projects-v2-details__close"
            aria-label="Close project details"
            onClick={onClose}
          >
            ├ù
          </button>
        </header>

        <div className="projects-v2-details__content">
          <section className="projects-v2-details__hero">
            <div>
              <span>Project health</span>

              <strong>
                {healthScore}%
              </strong>
            </div>

            <progress
              value={healthScore}
              max={100}
              aria-label="Project health"
            />

            <p>
              Health is calculated from
              project completeness and its
              current workflow status.
            </p>
          </section>

          <section className="projects-v2-details__section">
            <div className="projects-v2-details__section-heading">
              <div>
                <span>Overview</span>
                <h3>Project information</h3>
              </div>
            </div>

            <dl className="projects-v2-details__metadata">
              <div>
                <dt>Status</dt>
                <dd>
                  <span
                    className={`projects-v2-details__status projects-v2-details__status--${project.status}`}
                  >
                    {project.status}
                  </span>
                </dd>
              </div>

              <div>
                <dt>Platform</dt>
                <dd>
                  {project.platform}
                </dd>
              </div>

              <div>
                <dt>Created</dt>
                <dd>
                  {formatDate(
                    project.createdAt,
                  )}
                </dd>
              </div>

              <div>
                <dt>Last updated</dt>
                <dd>
                  {formatDate(
                    project.updatedAt,
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="projects-v2-details__section">
            <div className="projects-v2-details__section-heading">
              <div>
                <span>Description</span>
                <h3>Creative brief</h3>
              </div>
            </div>

            <p className="projects-v2-details__description">
              {project.description.trim()
                ? project.description
                : "No project description has been added yet."}
            </p>
          </section>

          <section className="projects-v2-details__section">
            <div className="projects-v2-details__section-heading">
              <div>
                <span>Workflow</span>
                <h3>Next recommended state</h3>
              </div>

              <span className="projects-v2-details__next-status">
                {nextStatus}
              </span>
            </div>

            <p className="projects-v2-details__hint">
              Move this project to the next
              workflow stage while keeping the
              workspace synchronized.
            </p>
          </section>

          <section className="projects-v2-details__section">
            <div className="projects-v2-details__section-heading">
              <div>
                <span>Intelligence</span>
                <h3>AI readiness</h3>
              </div>
            </div>

            <div className="projects-v2-details__insights">
              <article>
                <strong>
                  {
                    project.description
                      .trim().length >= 20
                      ? "Ready"
                      : "Needs brief"
                  }
                </strong>

                <span>
                  Production brief
                </span>
              </article>

              <article>
                <strong>
                  {project.status ===
                  "active"
                    ? "In progress"
                    : project.status}
                </strong>

                <span>
                  Workflow signal
                </span>
              </article>

              <article>
                <strong>
                  {project.platform}
                </strong>

                <span>
                  Primary channel
                </span>
              </article>
            </div>
          </section>
        </div>

        <footer className="projects-v2-details__footer">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onStatus(
                statusProject,
              )
            }
          >
            {busy
              ? "Updating..."
              : `Move to ${nextStatus}`}
          </button>

          <button
            type="button"
            className="danger"
            disabled={busy}
            onClick={() =>
              onDelete(project)
            }
          >
            Delete project
          </button>
        </footer>
      </aside>
    </div>
  );
}
