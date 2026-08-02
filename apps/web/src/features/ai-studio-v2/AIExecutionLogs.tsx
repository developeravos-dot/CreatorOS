import { useTranslation } from "../../hooks";
import type { AIStudioLog } from "./ai-studio-types";

interface AIExecutionLogsProps {
  logs: AIStudioLog[];
}

export default function AIExecutionLogs({
  logs,
}: AIExecutionLogsProps) {
  const { t } = useTranslation();

  return (
    <section className="ai-studio-panel ai-studio-logs">
      <header className="ai-studio-panel__header">
        <div>
          <span>{t("aiStudio.executionLogs")}</span>
          <h3>{t("aiStudio.liveRuntimeEvents")}</h3>
        </div>

        <span className="ai-studio-live-indicator">
          {t("aiStudio.live")}
        </span>
      </header>

      <div className="ai-studio-log-list">
        {logs.map((log) => (
          <div
            className={[
              "ai-studio-log",
              `ai-studio-log--${log.type}`,
            ].join(" ")}
            key={log.id}
          >
            <span className="ai-studio-log__dot" />

            <div>
              <strong>{log.message}</strong>
              <small>{log.source}</small>
            </div>

            <time>{log.timestamp}</time>
          </div>
        ))}
      </div>
    </section>
  );
}
