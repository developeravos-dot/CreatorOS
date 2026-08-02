import { useTranslation } from "../../../hooks";
import {
  getRuntimeProviderMetadata,
} from "./ai-runtime-metadata";
import type {
  AIRuntimeCommandAction,
  AIRuntimeExecution,
  AIRuntimeProvider,
} from "./ai-runtime-types";

interface AIRuntimeProviderInspectorProps {
  provider: AIRuntimeProvider | null;
  latestExecution: AIRuntimeExecution | null;
  pendingProviderId: string | null;
  pendingExecutionId: string | null;
  onCommand: (
    providerId: string,
    action: AIRuntimeCommandAction,
  ) => void;
  onApprove: (executionId: string) => void;
  onReject: (executionId: string) => void;
  onClose: () => void;
}

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function AIRuntimeProviderInspector({
  provider,
  latestExecution,
  pendingProviderId,
  pendingExecutionId,
  onCommand,
  onApprove,
  onReject,
  onClose,
}: AIRuntimeProviderInspectorProps) {
  const { t } = useTranslation();

  if (!provider) {
    return (
      <aside className="ai-runtime-inspector ai-runtime-inspector--empty">
        <div>
          <span>◇</span>
          <h3>{t("aiStudio.selectProvider")}</h3>
          <p>{t("aiStudio.selectProviderHint")}</p>
        </div>
      </aside>
    );
  }

  const metadata =
    getRuntimeProviderMetadata(provider);

  const localizedDisplayName =
    metadata.displayNameKey
      ? t(metadata.displayNameKey)
      : metadata.displayName;

  const providerBusy =
    pendingProviderId === provider.id;

  const executionBusy =
    latestExecution !== null &&
    pendingExecutionId === latestExecution.id;

  return (
    <aside className="ai-runtime-inspector">
      <header className="ai-runtime-inspector__header">
        <div>
          <span>
            {t("aiStudio.providerInspector")}
          </span>
          <h3>{localizedDisplayName}</h3>
        </div>

        <button
          type="button"
          className="ai-runtime-inspector__close"
          aria-label={t("actions.close")}
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <section className="ai-runtime-inspector__catalog-identity">
        <span>{metadata.icon}</span>

        <div>
          <strong>{localizedDisplayName}</strong>
          <small>{t(metadata.descriptionKey)}</small>
        </div>
      </section>

      <section className="ai-runtime-inspector__identity">
        <span
          className={[
            "ai-runtime-inspector__availability",
            provider.available
              ? "ai-runtime-inspector__availability--online"
              : "ai-runtime-inspector__availability--offline",
          ].join(" ")}
        />

        <div>
          <strong>
            {provider.available
              ? t("aiStudio.available")
              : t("aiStudio.unavailable")}
          </strong>

          <small>
            {t(metadata.categoryKey)} ·{" "}
            {t(
              `aiStudio.capabilities.${provider.capability}`,
            )}
          </small>
        </div>
      </section>

      <dl className="ai-runtime-inspector__metadata">
        <div>
          <dt>{t("aiStudio.displayName")}</dt>
          <dd>{localizedDisplayName}</dd>
        </div>

        <div>
          <dt>{t("aiStudio.category")}</dt>
          <dd>{t(metadata.categoryKey)}</dd>
        </div>

        <div>
          <dt>{t("aiStudio.module")}</dt>
          <dd>{metadata.moduleDisplayName}</dd>
        </div>

        <div>
          <dt>{t("aiStudio.capability")}</dt>
          <dd>
            {t(
              `aiStudio.capabilities.${provider.capability}`,
            )}
          </dd>
        </div>

        <div>
          <dt>{t("aiStudio.scope")}</dt>
          <dd>
            {provider.scope === "0"
              ? t("aiStudio.singleton")
              : provider.scope === "default"
                ? t("aiStudio.enterpriseRuntime")
                : provider.scope}
          </dd>
        </div>

        <div>
          <dt>{t("aiStudio.technicalName")}</dt>
          <dd>{metadata.technicalName}</dd>
        </div>

        <div>
          <dt>{t("aiStudio.providerId")}</dt>
          <dd>{provider.id}</dd>
        </div>
      </dl>

      <section className="ai-runtime-command-console">
        <header>
          <span>{t("aiStudio.commandConsole")}</span>
          <h4>{t("aiStudio.safeCommands")}</h4>
        </header>

        <div className="ai-runtime-command-console__actions">
          <button
            type="button"
            disabled={providerBusy}
            onClick={() =>
              onCommand(provider.id, "inspect")
            }
          >
            ◉ {t("aiStudio.inspect")}
          </button>

          <button
            type="button"
            disabled={providerBusy}
            onClick={() =>
              onCommand(provider.id, "ping")
            }
          >
            ◌ {t("aiStudio.ping")}
          </button>

          <button
            type="button"
            className="primary"
            disabled={providerBusy}
            onClick={() =>
              onCommand(provider.id, "dry-run")
            }
          >
            ▶{" "}
            {providerBusy
              ? t("aiStudio.executing")
              : t("aiStudio.dryRun")}
          </button>
        </div>

        <p>{t("aiStudio.safeCommandNotice")}</p>
      </section>

      <section className="ai-runtime-inspector__execution">
        <header>
          <span>
            {t("aiStudio.latestExecution")}
          </span>

          {latestExecution ? (
            <strong
              className={`ai-runtime-inspector__execution-status ai-runtime-inspector__execution-status--${latestExecution.status}`}
            >
              {latestExecution.status === "completed"
                ? t("aiStudio.status.completed")
                : latestExecution.status === "failed"
                  ? t("aiStudio.status.failed")
                  : t(
                      "aiStudio.status.awaitingApproval",
                    )}
            </strong>
          ) : null}
        </header>

        {!latestExecution ? (
          <div className="ai-runtime-inspector__no-execution">
            {t("aiStudio.noProviderExecutions")}
          </div>
        ) : (
          <>
            <div className="ai-runtime-inspector__execution-summary">
              <div>
                <small>{t("aiStudio.action")}</small>
                <strong>
                  {latestExecution.action}
                </strong>
              </div>

              <div>
                <small>
                  {t("aiStudio.createdAt")}
                </small>
                <strong>
                  {new Date(
                    latestExecution.createdAt,
                  ).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="ai-runtime-inspector__payload">
              <span>
                {t("aiStudio.executionInput")}
              </span>
              <pre>
                {formatJson(latestExecution.input)}
              </pre>
            </div>

            <div className="ai-runtime-inspector__payload">
              <span>
                {t("aiStudio.executionOutput")}
              </span>
              <pre>
                {formatJson(latestExecution.output)}
              </pre>
            </div>

            {latestExecution.status ===
            "awaiting_approval" ? (
              <div className="ai-runtime-inspector__approval-actions">
                <button
                  type="button"
                  className="approve"
                  disabled={executionBusy}
                  onClick={() =>
                    onApprove(latestExecution.id)
                  }
                >
                  ✓ {t("aiStudio.approve")}
                </button>

                <button
                  type="button"
                  className="reject"
                  disabled={executionBusy}
                  onClick={() =>
                    onReject(latestExecution.id)
                  }
                >
                  × {t("aiStudio.reject")}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </aside>
  );
}

