import { useTranslation } from "../../hooks";

interface ProjectsToolbarProps {
  search: string;
  platform: string;
  status: string;
  viewMode: "table" | "kanban";
  platforms: string[];
  statuses: string[];
  disabled?: boolean;
  onSearchChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onViewModeChange: (value: "table" | "kanban") => void;
  onCreate: () => void;
}

export default function ProjectsToolbar({
  search,
  platform,
  status,
  viewMode,
  platforms,
  statuses,
  disabled,
  onSearchChange,
  onPlatformChange,
  onStatusChange,
  onViewModeChange,
  onCreate,
}: ProjectsToolbarProps) {

  const { t } = useTranslation();
  return (
    <div className="projects-v2-toolbar">
      <label className="projects-v2-search">
        <span>⌕</span>

        <input
          type="search"
          value={search}
          placeholder={t("projects.search")}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <select
        value={platform}
        aria-label={t("projects.filterPlatform")}
        onChange={(event) => onPlatformChange(event.target.value)}
      >
        <option value="all">{t("projects.allPlatforms")}</option>

        {platforms.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={status}
        aria-label={t("projects.filterStatus")}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">{t("projects.allStatuses")}</option>

        {statuses.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <div className="projects-v2-view-switch">
        <button
          type="button"
          className={viewMode === "table" ? "active" : ""}
          onClick={() => onViewModeChange("table")}
        >
          Table
        </button>

        <button
          type="button"
          className={viewMode === "kanban" ? "active" : ""}
          onClick={() => onViewModeChange("kanban")}
        >
          Kanban
        </button>
      </div>

      <button
        type="button"
        className="projects-v2-create"
        disabled={disabled}
        onClick={onCreate}
      >
        ＋ {t("actions.newProject")}
      </button>
    </div>
  );
}

