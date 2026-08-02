import type { CalendarViewMode } from "./calendar-utils";
import { useTranslation } from "../../hooks";

interface CalendarToolbarProps {
  search: string;
  status: string;
  projectId: string;
  platform: string;
  viewMode: CalendarViewMode;
  statuses: string[];
  platforms: string[];
  projects: Array<{
    id: string;
    name: string;
  }>;
  busy: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
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
  const { t } = useTranslation();
  return (
    <div className="calendar-v2-toolbar">
      <label className="calendar-v2-search">
        <span>⌕</span>

        <input
          type="search"
          value={search}
          placeholder={t("calendar.search")}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <select
        value={projectId}
        aria-label={t("calendar.filterProject")}
        onChange={(event) => onProjectChange(event.target.value)}
      >
        <option value="all">{t("calendar.allProjects")}</option>

        {projects.map((project) => (
          <option value={project.id} key={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        aria-label={t("calendar.filterStatus")}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">{t("calendar.allStatuses")}</option>

        {statuses.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>


      <select
        value={platform}
        aria-label={t("calendar.filterPlatform")}
        onChange={(event) =>
          onPlatformChange(event.target.value)
        }
      >
        <option value="all">
          {t("calendar.allPlatforms")}
        </option>

        {platforms.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <div className="calendar-v2-view-switch">
        {(["month", "week", "day", "timeline"] as const).map((mode) => (
          <button
            type="button"
            key={t(`calendar.view.${mode}`)}
            className={viewMode === mode ? "active" : ""}
            onClick={() => onViewChange(mode)}
          >
            {t(`calendar.view.${mode}`)}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="calendar-v2-create"
        disabled={busy}
        onClick={onCreate}
      >
        ＋ {t("calendar.scheduleContent")}
      </button>
    </div>
  );
}


