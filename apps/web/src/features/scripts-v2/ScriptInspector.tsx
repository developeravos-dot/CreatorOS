import type { EnterpriseScript } from "../../enterprise-api";
import { useTranslation } from "../../hooks";
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

  const { t } = useTranslation();
  if (!script) {
    return (
      <aside className="scripts-v2-inspector">
        <div className="scripts-v2-inspector__empty">
          {t("scripts.selectToView")}
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
        <span>{t("scripts.details")}</span>
        <h3>{t("scripts.information")}</h3>
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
          <dt>{t("scripts.status")}</dt>
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
          <span>{t("scripts.versionHistory")}</span>
          <strong>{t("scripts.currentVersion")}</strong>
        </header>

        <div className="scripts-v2-history__item">
          <span>✓</span>

          <div>
            <strong>{t("scripts.currentServerVersion")}</strong>
            <small>{t("scripts.loadedBackend")}</small>
          </div>
        </div>
      </section>
    </aside>
  );
}

