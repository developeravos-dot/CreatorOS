import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "../hooks";
import {
  AIRuntimeExecutionCenter,
  AIRuntimeProviderInspector,
  AIRuntimeProviderPanel,
  useAIStudioRuntime,
  type AIRuntimeCollection,
  type AIRuntimeProvider,
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
    title: "aiStudio.sections.agents.title",
    description: "aiStudio.sections.agents.description",
    icon: "◎",
  },
  {
    id: "tasks",
    title: "aiStudio.sections.tasks.title",
    description: "aiStudio.sections.tasks.description",
    icon: "✓",
  },
  {
    id: "workflows",
    title: "aiStudio.sections.workflows.title",
    description: "aiStudio.sections.workflows.description",
    icon: "⌘",
  },
  {
    id: "approvals",
    title: "aiStudio.sections.approvals.title",
    description: "aiStudio.sections.approvals.description",
    icon: "!",
  },
  {
    id: "memory",
    title: "aiStudio.sections.memory.title",
    description: "aiStudio.sections.memory.description",
    icon: "◈",
  },
  {
    id: "models",
    title: "aiStudio.sections.models.title",
    description: "aiStudio.sections.models.description",
    icon: "◇",
  },
  {
    id: "executions",
    title: "aiStudio.sections.executions.title",
    description: "aiStudio.sections.executions.description",
    icon: "▶",
  },
  {
    id: "tools",
    title: "aiStudio.sections.tools.title",
    description: "aiStudio.sections.tools.description",
    icon: "✦",
  },
  {
    id: "queues",
    title: "aiStudio.sections.queues.title",
    description: "aiStudio.sections.queues.description",
    icon: "≡",
  },
  {
    id: "logs",
    title: "aiStudio.sections.logs.title",
    description: "aiStudio.sections.logs.description",
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

  const [selectedProvider, setSelectedProvider] =
    useState<AIRuntimeProvider | null>(null);

  const activeDefinition = useMemo(
    () =>
      runtimeSections.find(
        (section) => section.id === activeSection,
      ) ?? runtimeSections[0]!,
    [activeSection],
  );

  const activeCollection = data
    ? (data[activeSection] as AIRuntimeCollection)
    : null;

  const latestSelectedExecution = useMemo(() => {
    if (!selectedProvider) {
      return null;
    }

    return (
      history.items.find(
        (execution) =>
          execution.providerId === selectedProvider.id,
      ) ?? null
    );
  }, [history.items, selectedProvider]);

  useEffect(() => {
    if (!activeCollection) {
      return;
    }

    if (
      selectedProvider &&
      activeCollection.items.some(
        (provider) =>
          provider.id === selectedProvider.id,
      )
    ) {
      return;
    }

    setSelectedProvider(
      activeCollection.items[0] ?? null,
    );
  }, [activeCollection, selectedProvider]);

  function changeSection(section: RuntimeSection) {
    setActiveSection(section);
    setSelectedProvider(null);
  }

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

  if (!data || !activeCollection) {
    return null;
  }

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
            <small>{t("aiStudio.runtimeProviders")}</small>
            <strong>{data.overview.providers}</strong>
            <p>{t("aiStudio.discoveredProviders")}</p>
          </div>
        </article>

        <article>
          <span>⌘</span>
          <div>
            <small>{t("aiStudio.runtimeCapabilities")}</small>
            <strong>{runtimeSections.length}</strong>
            <p>{t("aiStudio.connectedCapabilities")}</p>
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
            <p>{t("aiStudio.operational")}</p>
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
            onClick={() => changeSection(section.id)}
          >
            <span>{section.icon}</span>

            <div>
              <strong>{t(section.title)}</strong>
              <small>{data[section.id].total}</small>
            </div>
          </button>
        ))}
      </nav>

      <section className="ai-runtime-command-workspace">
        <AIRuntimeProviderPanel
          title={t(activeDefinition.title)}
          description={t(activeDefinition.description)}
          icon={activeDefinition.icon}
          collection={activeCollection}
          selectedProviderId={selectedProvider?.id ?? null}
          pendingProviderId={pendingProviderId}
          onSelect={setSelectedProvider}
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

        <AIRuntimeProviderInspector
          provider={selectedProvider}
          latestExecution={latestSelectedExecution}
          pendingProviderId={pendingProviderId}
          pendingExecutionId={pendingExecutionId}
          onCommand={(providerId, action) =>
            void runCommand(providerId, action)
          }
          onApprove={(executionId) =>
            void approveExecution(executionId)
          }
          onReject={(executionId) =>
            void rejectExecution(executionId)
          }
          onClose={() => setSelectedProvider(null)}
        />
      </section>

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
            onClick={() => changeSection(section.id)}
          >
            <span>{section.icon}</span>

            <div>
              <small>{t(section.description)}</small>
              <strong>{t(section.title)}</strong>
            </div>

            <b>{data[section.id].total}</b>
          </button>
        ))}
      </section>
    </div>
  );
}

