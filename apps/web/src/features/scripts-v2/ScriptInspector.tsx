import type { EnterpriseScript } from "../../enterprise-api";
import { scriptStatusLabels } from "../../utils/contentLabels";

interface ScriptInspectorProps {
  script: EnterpriseScript | null;
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function ScriptInspector({
  script,
}: ScriptInspectorProps) {
  if (!script) {
    return (
      <aside className="scripts-v2-inspector">
        <div className="scripts-v2-inspector__empty">
          Select a script to view its information.
        </div>
      </aside>
    );
  }

  const metadata = Object.entries(script)
    .filter(([key]) => !["id", "title", "status"].includes(key))
    .slice(0, 8);

  return (
    <aside className="scripts-v2-inspector">
      <header>
        <span>SCRIPT DETAILS</span>
        <h3>Information</h3>
      </header>

      <div className="scripts-v2-inspector__identity">
        <span>{script.title.slice(0, 1).toUpperCase()}</span>

        <div>
          <strong>{script.title}</strong>
          <small>{script.id}</small>
        </div>
      </div>

      <dl className="scripts-v2-inspector__metadata">
        <div>
          <dt>Status</dt>
          <dd>
            {scriptStatusLabels[script.status] ?? script.status}
          </dd>
        </div>

        {metadata.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{displayValue(value)}</dd>
          </div>
        ))}
      </dl>

      <section className="scripts-v2-history">
        <header>
          <span>VERSION HISTORY</span>
          <strong>Current version</strong>
        </header>

        <div className="scripts-v2-history__item">
          <span>✓</span>

          <div>
            <strong>Current server version</strong>
            <small>Loaded from CreatorOS backend</small>
          </div>
        </div>
      </section>
    </aside>
  );
}
