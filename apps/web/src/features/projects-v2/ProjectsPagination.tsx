interface ProjectsPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalProjects: number;
  disabled?: boolean;
  onPageChange: (
    page: number,
  ) => void;
  onPageSizeChange: (
    pageSize: number,
  ) => void;
}

export default function ProjectsPagination({
  page,
  totalPages,
  pageSize,
  totalProjects,
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: ProjectsPaginationProps) {
  const firstItem =
    totalProjects === 0
      ? 0
      : (page - 1) *
          pageSize +
        1;

  const lastItem = Math.min(
    page * pageSize,
    totalProjects,
  );

  return (
    <footer className="projects-v2-pagination">
      <div className="projects-v2-pagination__summary">
        <strong>
          {firstItem}-{lastItem}
        </strong>

        <span>
          of {totalProjects} projects
        </span>
      </div>

      <label className="projects-v2-pagination__size">
        <span>Rows per page</span>

        <select
          value={pageSize}
          disabled={disabled}
          aria-label="Rows per page"
          onChange={(event) =>
            onPageSizeChange(
              Number(
                event.target.value,
              ),
            )
          }
        >
          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

          <option value={50}>
            50
          </option>
        </select>
      </label>

      <div className="projects-v2-pagination__controls">
        <button
          type="button"
          disabled={
            disabled ||
            page <= 1
          }
          onClick={() =>
            onPageChange(
              page - 1,
            )
          }
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          disabled={
            disabled ||
            page >= totalPages
          }
          onClick={() =>
            onPageChange(
              page + 1,
            )
          }
        >
          Next
        </button>
      </div>
    </footer>
  );
}
