import { useTranslation } from "../../hooks";

interface ScriptsToolbarProps {
  search: string;
  status: string;
  statuses: string[];
  busy: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreate: () => void;
}

export default function ScriptsToolbar({
  search,
  status,
  statuses,
  busy,
  onSearchChange,
  onStatusChange,
  onCreate,
}: ScriptsToolbarProps) {

  const { t } = useTranslation();
  return (
    <div className="scripts-v2-toolbar">
      <label className="scripts-v2-search">
        <span>⌕</span>

        <input
          type="search"
          value={search}
          placeholder={t("scripts.search")}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <select
        value={status}
        aria-label={t("scripts.filterStatus")}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">{t("scripts.allStatuses")}</option>

        {statuses.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="scripts-v2-create"
        disabled={busy}
        onClick={onCreate}
      >
        ＋ {t("actions.newScript")}
      </button>
    </div>
  );
}

