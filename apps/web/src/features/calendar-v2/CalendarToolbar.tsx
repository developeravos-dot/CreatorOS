import type { CalendarViewMode } from "./calendar-utils";

interface CalendarToolbarProps {
  search: string;
  status: string;
  projectId: string;
  viewMode: CalendarViewMode;
  statuses: string[];
  projects: Array<{
    id: string;
    name: string;
  }>;
  busy: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onViewChange: (value: CalendarViewMode) => void;
  onCreate: () => void;
}

export default function CalendarToolbar({
  search,
  status,
  projectId,
  viewMode,
  statuses,
  projects,
  busy,
  onSearchChange,
  onStatusChange,
  onProjectChange,
  onViewChange,
  onCreate,
}: CalendarToolbarProps) {
  return (
    <div className="calendar-v2-toolbar">
      <label className="calendar-v2-search">
        <span>⌕</span>

        <input
          type="search"
          value={search}
          placeholder="Search scheduled content..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <select
        value={projectId}
        aria-label="Filter by project"
        onChange={(event) => onProjectChange(event.target.value)}
      >
        <option value="all">All projects</option>

        {projects.map((project) => (
          <option value={project.id} key={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        aria-label="Filter by status"
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">All statuses</option>

        {statuses.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <div className="calendar-v2-view-switch">
        {(["month", "week", "timeline"] as const).map((mode) => (
          <button
            type="button"
            key={mode}
            className={viewMode === mode ? "active" : ""}
            onClick={() => onViewChange(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="calendar-v2-create"
        disabled={busy}
        onClick={onCreate}
      >
        ＋ Schedule Content
      </button>
    </div>
  );
}
