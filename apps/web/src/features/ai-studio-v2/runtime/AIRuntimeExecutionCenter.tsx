import { useTranslation } from "../../../hooks";
import type {
  AIRuntimeExecution,
  AIRuntimeExecutionCollection,
} from "./ai-runtime-types";

interface AIRuntimeExecutionCenterProps {
  history: AIRuntimeExecutionCollection;
  pendingExecutionId: string | null;
  onApprove: (executionId: string) => void;
  onReject: (executionId: string) => void;
}

export default function AIRuntimeExecutionCenter({
  history,
  pendingExecutionId,
  onApprove,
  onReject,
}: AIRuntimeExecutionCenterProps) {
  const { t } = useTranslation();

  return (
    <article className="ai-runtime-execution-center">
      <header>
        <div>
          <span>{t("aiStudio.executionRuntimeLocalized")}</span>
          <h3>{t("aiStudio.executionHistory")}</h3>
        </div>

        <strong>{history.total}</strong>
      </header>

      <div className="ai-runtime-execution-list">
        {history.items.length === 0 ? (
          <div className="ai-runtime-execution-empty">
            {t("aiStudio.noExecutions")}
          </div>
        ) : (
          history.items.slice(0, 20).map(
            (execution: AIRuntimeExecution) => {
              const busy =
                pendingExecutionId === execution.id;

              return (
                <section
                  className="ai-runtime-execution-item"
                  key={execution.id}
                >
                  <div
                    className={[
                      "ai-runtime-execution-item__status",
                      `ai-runtime-execution-item__status--${execution.status === "completed"
  ? t("aiStudio.status.completed")
  : execution.status === "failed"
    ? t("aiStudio.status.failed")
    : t("aiStudio.status.awaitingApproval")}`,
                    ].join(" ")}
                  />

                  <div className="ai-runtime-execution-item__content">
                    <strong>
                      {execution.providerName}
                    </strong>

                    <small>
                      {execution.action} ·{" "}
                      {execution.capability}
                    </small>

                    <span>
                      {new Date(
                        execution.createdAt,
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="ai-runtime-execution-item__state">
                    {execution.status === "completed"
  ? t("aiStudio.status.completed")
  : execution.status === "failed"
    ? t("aiStudio.status.failed")
    : t("aiStudio.status.awaitingApproval")}
                  </div>

                  {execution.status ===
                  "awaiting_approval" ? (
                    <div className="ai-runtime-execution-item__actions">
                      <button
                        type="button"
                        className="approve"
                        disabled={busy}
                        onClick={() =>
                          onApprove(execution.id)
                        }
                      >
                        {t("aiStudio.approve")}
                      </button>

                      <button
                        type="button"
                        className="reject"
                        disabled={busy}
                        onClick={() =>
                          onReject(execution.id)
                        }
                      >
                        {t("aiStudio.reject")}
                      </button>
                    </div>
                  ) : null}
                </section>
              );
            },
          )
        )}
      </div>
    </article>
  );
}


