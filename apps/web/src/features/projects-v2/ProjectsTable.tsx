import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  useTranslation,
} from "../../hooks";

import {
  platformLabels,
  statusLabels,
} from "../../utils/contentLabels";

import type {
  ProjectSortDirection,
  ProjectSortField,
} from "./projects-workspace-types";

interface ProjectsTableProps {
  projects: EnterpriseProject[];
  selectedId?: string;
  selectedIds: ReadonlySet<string>;
  busy: boolean;
  sortField: ProjectSortField;
  sortDirection: ProjectSortDirection;
  onSort: (
    field: ProjectSortField,
  ) => void;
  onSelect: (
    project: EnterpriseProject,
  ) => void;
  onToggleSelection: (
    projectId: string,
  ) => void;
  onTogglePageSelection: (
    projectIds: readonly string[],
    selected: boolean,
  ) => void;
  onStatus: (
    project: EnterpriseProject,
  ) => void;
  onDelete: (
    project: EnterpriseProject,
  ) => void;
}

interface SortHeaderProps {
  field: ProjectSortField;
  label: string;
  activeField: ProjectSortField;
  direction: ProjectSortDirection;
  onSort: (
    field: ProjectSortField,
  ) => void;
}

function SortHeader({
  field,
  label,
  activeField,
  direction,
  onSort,
}: SortHeaderProps) {
  const active =
    activeField === field;

  const indicator =
    active
      ? direction === "asc"
        ? "↑"
        : "↓"
      : "↕";

  return (
    <button
      type="button"
      className={[
        "projects-v2-sort-header",
        active
          ? "projects-v2-sort-header--active"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={
        `Sort by ${label.toLowerCase()}`
      }
      onClick={() =>
        onSort(field)
      }
    >
      <span>{label}</span>

      <span
        aria-hidden="true"
        className="projects-v2-sort-header__indicator"
      >
        {indicator}
      </span>
    </button>
  );
}

export default function ProjectsTable({
  projects,
  selectedId,
  selectedIds,
  busy,
  sortField,
  sortDirection,
  onSort,
  onSelect,
  onToggleSelection,
  onTogglePageSelection,
  onStatus,
  onDelete,
}: ProjectsTableProps) {
  const { t } =
    useTranslation();

  if (
    projects.length === 0
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

  const pageProjectIds =
    projects.map(
      (project) =>
        project.id,
    );

  const selectedOnPage =
    pageProjectIds.filter(
      (projectId) =>
        selectedIds.has(
          projectId,
        ),
    ).length;

  const allPageSelected =
    selectedOnPage ===
    pageProjectIds.length;

  const somePageSelected =
    selectedOnPage > 0 &&
    !allPageSelected;

  return (
    <div className="projects-v2-table-wrap">
      <table className="projects-v2-table">
        <thead>
          <tr>
            <th className="projects-v2-selection-cell">
              <input
                type="checkbox"
                aria-label="Select all projects on page"
                checked={
                  allPageSelected
                }
                ref={(element) => {
                  if (element) {
                    element.indeterminate =
                      somePageSelected;
                  }
                }}
                onChange={(event) =>
                  onTogglePageSelection(
                    pageProjectIds,
                    event.target
                      .checked,
                  )
                }
              />
            </th>

            <th>
              <SortHeader
                field="name"
                label={
                  t(
                    "projects.project",
                  )
                }
                activeField={
                  sortField
                }
                direction={
                  sortDirection
                }
                onSort={onSort}
              />
            </th>

            <th>
              <SortHeader
                field="platform"
                label={
                  t(
                    "projects.platform",
                  )
                }
                activeField={
                  sortField
                }
                direction={
                  sortDirection
                }
                onSort={onSort}
              />
            </th>

            <th>
              <SortHeader
                field="status"
                label={
                  t(
                    "projects.status",
                  )
                }
                activeField={
                  sortField
                }
                direction={
                  sortDirection
                }
                onSort={onSort}
              />
            </th>

            <th>
              {
                t(
                  "projects.id",
                )
              }
            </th>

            <th
              aria-label={
                t(
                  "projects.actions",
                )
              }
            />
          </tr>
        </thead>

        <tbody>
          {projects.map(
            (project) => {
              const selected =
                selectedIds.has(
                  project.id,
                );

              return (
                <tr
                  key={
                    project.id
                  }
                  className={[
                    selectedId ===
                    project.id
                      ? "projects-v2-table__selected"
                      : "",
                    selected
                      ? "projects-v2-table__checked"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    onSelect(
                      project,
                    )
                  }
                >
                  <td className="projects-v2-selection-cell">
                    <input
                      type="checkbox"
                      aria-label={
                        `Select ${project.name}`
                      }
                      checked={
                        selected
                      }
                      disabled={
                        busy
                      }
                      onClick={(
                        event,
                      ) =>
                        event
                          .stopPropagation()
                      }
                      onChange={() =>
                        onToggleSelection(
                          project.id,
                        )
                      }
                    />
                  </td>

                  <td>
                    <div className="projects-v2-project-cell">
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

                      <div>
                        <strong>
                          {
                            project.name
                          }
                        </strong>

                        <small>
                          {
                            t(
                              "projects.creatorProject",
                            )
                          }
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    {
                      platformLabels[
                        project
                          .platform
                      ] ??
                      project.platform
                    }
                  </td>

                  <td>
                    <span className="projects-v2-status">
                      {
                        statusLabels[
                          project
                            .status
                        ] ??
                        project.status
                      }
                    </span>
                  </td>

                  <td>
                    <code>
                      {
                        project.id.slice(
                          0,
                          8,
                        )
                      }
                    </code>
                  </td>

                  <td>
                    <div className="projects-v2-row-actions">
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

                      <button
                        type="button"
                        className="danger"
                        disabled={
                          busy
                        }
                        onClick={(
                          event,
                        ) => {
                          event
                            .stopPropagation();

                          onDelete(
                            project,
                          );
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
}
