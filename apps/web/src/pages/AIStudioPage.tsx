import {
  useMemo,
  useState,
} from "react";
import { useTranslation } from "../hooks";
import {
  AIRuntimeExecutionCenter,
  AIRuntimeProviderPanel,
  useAIStudioRuntime,
  type AIRuntimeCollection,
} from "../features/ai-studio-v2/runtime";
import "../features/ai-studio-v2/ai-studio-v2.css";

type RuntimeSection =
  | "agents"
  | "tasks"
  | "workflows"
  | "approvals"
  | "memory"
  | "models"
  | "executions"
  | "tools"
  | "queues"
  | "logs";

interface RuntimeSectionDefinition {
  id: RuntimeSection;
  title: string;
  description: string;
  icon: string;
}

const runtimeSections: RuntimeSectionDefinition[] = [
  {
    id: "agents",
    title: "Agents",
    description: "Specialist organization",
    icon: "◎",
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Commands and operations",
    icon: "✓",
  },
  {
    id: "workflows",
    title: "Workflows",
    description: "Pipelines and orchestration",
    icon: "⌘",
  },
  {
    id: "approvals",
    title: "Approvals",
    description: "Human authority gates",
    icon: "!",
  },
  {
    id: "memory",
    title: "Memory",
    description: "Knowledge and shared context",
    icon: "◈",
  },
  {
    id: "models",
    title: "Models",
    description: "AI providers and routers",
    icon: "◇",
  },
  {
    id: "executions",
    title: "Executions",
    description: "Runtime and monitoring",
    icon: "▶",
  },
  {
    id: "tools",
    title: "Tools",
    description: "Capabilities and integrations",
    icon: "✦",
  },
  {
    id: "queues",
    title: "Queues",
    description: "Jobs and scheduling",
    icon: "≡",
  },
  {
    id: "logs",
    title: "Logs",
    description: "Audit and observability",
    icon: "▤",
  },
];

export default function AIStudioPage() {
  const { t } = useTranslation();

  const {
    data,
    loading,
    refreshing,
    error,
    pendingProviderId,
    pendingExecutionId,
    history,
    refresh,
    runCommand,
    approveExecution,
    rejectExecution,
  } = useAIStudioRuntime();

  const [activeSection, setActiveSection] =
    useState<RuntimeSection>("agents");

  const activeDefinition = useMemo(
    () =>
      runtimeSections.find(
        (section) => section.id === activeSection,
      ) ?? runtimeSections[0]!,
    [activeSection],
  );

  if (loading && !data) {
    return (
      <div className="ai-runtime-state">
        <span className="ai-runtime-state__spinner" />
        <h2>{t("aiStudio.runtimeLoading")}</h2>
        <p>{t("aiStudio.runtimeLoadingDescription")}</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="ai-runtime-state ai-runtime-state--error">
        <span>!</span>
        <h2>{t("aiStudio.runtimeUnavailable")}</h2>
        <p>{error}</p>

        <button
          type="button"
          className="ai-studio-button ai-studio-button--primary"
          onClick={() => void refresh()}
        >
          {t("aiStudio.retry")}
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const activeCollection =
    data[activeSection] as AIRuntimeCollection;

  return (
    <div className="ai-studio ai-runtime-live">
      <header className="ai-studio-page-header">
        <div>
          <span>{t("aiStudio.runtimeWorkspace")}</span>
          <h2>{t("aiStudio.runtimeTitle")}</h2>
          <p>{t("aiStudio.runtimeSubtitle")}</p>
        </div>

        <div className="ai-studio-page-header__actions">
          <div
            className={[
              "ai-runtime-connection",
              data.overview.status === "operational"
                ? "ai-runtime-connection--online"
                : "ai-runtime-connection--degraded",
            ].join(" ")}
          >
            <span />

            <div>
              <strong>
                {data.overview.status === "operational"
                  ? t("aiStudio.runtimeOnline")
                  : t("aiStudio.runtimeDegraded")}
              </strong>

              <small>
                {new Date(
                  data.overview.generatedAt,
                ).toLocaleTimeString()}
              </small>
            </div>
          </div>

          <button
            type="button"
            className="ai-studio-button"
            disabled={refreshing}
            onClick={() => void refresh()}
          >
            {refreshing ? "…" : "↻"}{" "}
            {t("aiStudio.refreshRuntime")}
          </button>
        </div>
      </header>

      {error ? (
        <div className="ai-runtime-warning">
          <strong>
            {t("aiStudio.lastRefreshFailed")}
          </strong>
          <span>{error}</span>
        </div>
      ) : null}

      <section className="ai-studio-kpis">
        <article>
          <span>◎</span>

          <div>
            <small>
              {t("aiStudio.runtimeProviders")}
            </small>
            <strong>{data.overview.providers}</strong>
            <p>
              {t("aiStudio.discoveredProviders")}
            </p>
          </div>
        </article>

        <article>
          <span>⌘</span>

          <div>
            <small>
              {t("aiStudio.runtimeCapabilities")}
            </small>
            <strong>{runtimeSections.length}</strong>
            <p>
              {t("aiStudio.connectedCapabilities")}
            </p>
          </div>
        </article>

        <article>
          <span>▶</span>

          <div>
            <small>{t("aiStudio.workflows")}</small>
            <strong>{data.workflows.total}</strong>
            <p>{t("aiStudio.liveOrchestrators")}</p>
          </div>
        </article>

        <article>
          <span>✓</span>

          <div>
            <small>{t("aiStudio.systemHealth")}</small>
            <strong>{data.overview.health}%</strong>
            <p>
              {data.overview.status === "operational"
                ? t("aiStudio.operational")
                : t("aiStudio.runtimeDegraded")}
            </p>
          </div>
        </article>
      </section>

      <nav className="ai-runtime-navigation">
        {runtimeSections.map((section) => (
          <button
            type="button"
            key={section.id}
            className={
              activeSection === section.id
                ? "ai-runtime-navigation__item ai-runtime-navigation__item--active"
                : "ai-runtime-navigation__item"
            }
            onClick={() =>
              setActiveSection(section.id)
            }
          >
            <span>{section.icon}</span>

            <div>
              <strong>{section.title}</strong>
              <small>{data[section.id].total}</small>
            </div>
          </button>
        ))}
      </nav>

      <AIRuntimeProviderPanel
        title={activeDefinition.title}
        description={activeDefinition.description}
        icon={activeDefinition.icon}
        collection={activeCollection}
        pendingProviderId={pendingProviderId}
        onInspect={(providerId) =>
          void runCommand(providerId, "inspect")
        }
        onPing={(providerId) =>
          void runCommand(providerId, "ping")
        }
        onDryRun={(providerId) =>
          void runCommand(providerId, "dry-run")
        }
      />

      <AIRuntimeExecutionCenter
        history={history}
        pendingExecutionId={pendingExecutionId}
        onApprove={(executionId) =>
          void approveExecution(executionId)
        }
        onReject={(executionId) =>
          void rejectExecution(executionId)
        }
      />

      <section className="ai-runtime-capability-grid">
        {runtimeSections.map((section) => (
          <button
            type="button"
            key={section.id}
            onClick={() =>
              setActiveSection(section.id)
            }
          >
            <span>{section.icon}</span>

            <div>
              <small>{section.description}</small>
              <strong>{section.title}</strong>
            </div>

            <b>{data[section.id].total}</b>
          </button>
        ))}
      </section>
    </div>
  );
}


