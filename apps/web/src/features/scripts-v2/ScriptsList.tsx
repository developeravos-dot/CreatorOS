import type { EnterpriseScript } from "../../enterprise-api";
import { scriptStatusLabels } from "../../utils/contentLabels";

interface ScriptsListProps {
  scripts: EnterpriseScript[];
  selectedId?: string;
  onSelect: (script: EnterpriseScript) => void;
}

export default function ScriptsList({
  scripts,
  selectedId,
  onSelect,
}: ScriptsListProps) {
  if (scripts.length === 0) {
    return (
      <div className="scripts-v2-empty">
        <strong>No scripts found</strong>
        <span>Create a script or change the current filters.</span>
      </div>
    );
  }

  return (
    <div className="scripts-v2-list">
      {scripts.map((script, index) => (
        <button
          type="button"
          key={script.id}
          className={[
            "scripts-v2-list__item",
            selectedId === script.id
              ? "scripts-v2-list__item--active"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelect(script)}
        >
          <span className="scripts-v2-list__number">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="scripts-v2-list__content">
            <strong>{script.title}</strong>

            <small>
              {scriptStatusLabels[script.status] ?? script.status}
            </small>
          </span>

          <span className="scripts-v2-list__arrow">›</span>
        </button>
      ))}
    </div>
  );
}
