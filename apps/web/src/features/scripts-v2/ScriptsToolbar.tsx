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
  return (
    <div className="scripts-v2-toolbar">
      <label className="scripts-v2-search">
        <span>⌕</span>

        <input
          type="search"
          value={search}
          placeholder="Search scripts..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <select
        value={status}
        aria-label="Filter scripts by status"
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">All statuses</option>

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
        ＋ New Script
      </button>
    </div>
  );
}
