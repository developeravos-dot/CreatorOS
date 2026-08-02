import { useMemo } from "react";
import { useTranslation } from "../hooks";
import type { EnterpriseDashboard } from "../enterprise-api";
import {
  DashboardActivityFeed,
  DashboardIntelligencePanel,
  DashboardChart,
  DashboardMetricCard,
  DashboardQuickActions,
  type DashboardActivity,
  type DashboardQuickAction,
} from "../features/dashboard-v2";
import "../features/dashboard-v2/dashboard-v2.css";
import {
  platformLabels,
  scriptStatusLabels,
  statusLabels,
} from "../utils/contentLabels";

interface DashboardPageProps {
  dashboard: EnterpriseDashboard;
  connected: boolean;
  busy: boolean;
  onCreateProject: () => Promise<void>;
  onCreateScript: () => Promise<void>;
  onSchedule: () => Promise<void>;
  onCreatePrompt: () => Promise<void>;
}

function normalizeSystemStatus(value: string): string {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("disconnected") ||
    normalized.includes("offline") ||
    normalized.includes("unavailable")
  ) {
    return "disconnected";
  }

  if (
    normalized.includes("persistent") ||
    normalized.includes("database") ||
    normalized.includes("storage")
  ) {
    return "persistent";
  }

  if (
    normalized.includes("operational") ||
    normalized.includes("active") ||
    normalized.includes("ready") ||
    normalized.includes("connected")
  ) {
    return "operational";
  }

  return value;
}
export default function DashboardPage({
  dashboard,
  connected,
  busy,
  onCreateProject,
  onCreateScript,
  onSchedule,
  onCreatePrompt,
}: DashboardPageProps) {

  const { t } = useTranslation();

  function getLocalizedSystemStatus(value: string): string {
    const status = normalizeSystemStatus(value);

    if (status === "operational") {
      return t("dashboard.operational");
    }

    if (status === "persistent") {
      return t("dashboard.persistent");
    }

    if (status === "disconnected") {
      return t("dashboard.disconnected");
    }

    return value;
  }


const chartValues = useMemo(
    () => [
      dashboard.metrics.projects,
      dashboard.metrics.activeProjects,
      dashboard.metrics.scripts,
      dashboard.metrics.scheduledContent,
      dashboard.metrics.prompts,
    ],
    [dashboard.metrics],
  );

  const chartLabels = [
    t("navigation.projects"),
    t("dashboard.active"),
    t("navigation.scripts"),
    t("navigation.calendar"),
    t("navigation.prompts"),
  ];

  const activities = useMemo<DashboardActivity[]>(() => {
    const projectActivities: DashboardActivity[] = dashboard.projects
      .slice(0, 3)
      .map((project) => ({
        id: `project-${project.id}`,
        icon: "▦",
        title: project.name,
        description: `${
          platformLabels[project.platform]
        } · ${statusLabels[project.status]}`,
        time: t("dashboard.activityProject"),
      }));

    const scriptActivities: DashboardActivity[] = dashboard.scripts
      .slice(0, 3)
      .map((script) => ({
        id: `script-${script.id}`,
        icon: "✎",
        title: script.title,
        description: scriptStatusLabels[script.status],
        time: t("dashboard.activityScript"),
      }));

    return [...projectActivities, ...scriptActivities].slice(0, 5);
  }, [dashboard.projects, dashboard.scripts]);

  const quickActions = useMemo<DashboardQuickAction[]>(
    () => [
      {
        id: "create-project",
        icon: "＋",
        title: t("quickActions.createProject"),
        description: t("quickActions.startWorkspace"),
        disabled: busy,
        onClick: () => {
          void onCreateProject();
        },
      },
      {
        id: "create-script",
        icon: "✎",
        title: t("quickActions.createScript"),
        description: t("quickActions.addScript"),
        disabled: busy,
        onClick: () => {
          void onCreateScript();
        },
      },
      {
        id: "schedule-content",
        icon: "▣",
        title: t("quickActions.scheduleContent"),
        description: t("quickActions.addPublishDate"),
        disabled: busy,
        onClick: () => {
          void onSchedule();
        },
      },
      {
        id: "create-prompt",
        icon: "✦",
        title: t("quickActions.createPrompt"),
        description: t("quickActions.saveTemplate"),
        disabled: busy,
        onClick: () => {
          void onCreatePrompt();
        },
      },
    ],
    [
      busy,
      onCreateProject,
      onCreatePrompt,
      onCreateScript,
      onSchedule,
    ],
  );

  const operationalSystems = [
    {
      label: t("dashboard.backendApi"),
      value: connected
        ? t("dashboard.connected")
        : t("dashboard.disconnected"),
      healthy: connected,
    },
    {
      label: "Project Engine",
      value: getLocalizedSystemStatus(dashboard.system.projectEngine),
      healthy: true,
    },
    {
      label: "Script Engine",
      value: getLocalizedSystemStatus(dashboard.system.scriptEngine),
      healthy: true,
    },
    {
      label: "Calendar Engine",
      value: getLocalizedSystemStatus(dashboard.system.calendarEngine),
      healthy: true,
    },
    {
      label: "Prompt Engine",
      value: getLocalizedSystemStatus(dashboard.system.promptEngine),
      healthy: true,
    },
    {
      label: t("dashboard.storage"),
      value: getLocalizedSystemStatus(dashboard.system.storage),
      healthy: true,
    },
  ];

  const healthySystems = operationalSystems.filter(
    (system) => system.healthy,
  ).length;

  const systemHealth = Math.round(
    (healthySystems / operationalSystems.length) * 100,
  );

  return (
    <div className="dashboard-v2">
      <header className="dashboard-v2__header">
        <div>
          <span>{t("app.name")}</span>
          <h2>{t("dashboard.title")}</h2>
          <p>{t("dashboard.subtitle")}</p>
        </div>

        <div className="dashboard-v2__header-actions">
          <button
            type="button"
            className="dashboard-v2-button"
            disabled={busy}
            onClick={() => void onSchedule()}
          >
            {t("actions.schedule")}
          </button>

          <button
            type="button"
            className="dashboard-v2-button dashboard-v2-button--primary"
            disabled={busy}
            onClick={() => void onCreateProject()}
          >
            ＋ {t("actions.newProject")}
          </button>
        </div>
      </header>

      <section className="dashboard-v2__metrics">
        <DashboardMetricCard
          title={t("navigation.projects")}
          value={dashboard.metrics.projects}
          description={t("dashboard.totalWorkspaces")}
          icon="▦"
          trend={`${dashboard.metrics.activeProjects} ${t("dashboard.active")}`}
          status="positive"
        />

        <DashboardMetricCard
          title={t("navigation.scripts")}
          value={dashboard.metrics.scripts}
          description={t("dashboard.scriptsStored")}
          icon="✎"
          trend={t("dashboard.productionAssets")}
          status="neutral"
        />

        <DashboardMetricCard
          title={t("dashboard.scheduledContent")}
          value={dashboard.metrics.scheduledContent}
          description={t("dashboard.calendarItems")}
          icon="▣"
          trend={t("dashboard.calendarPipeline")}
          status={
            dashboard.metrics.scheduledContent > 0
              ? "positive"
              : "warning"
          }
        />

        <DashboardMetricCard
          title={t("dashboard.aiPrompts")}
          value={dashboard.metrics.prompts}
          description={t("dashboard.promptTemplates")}
          icon="✦"
          trend={t("dashboard.aiWorkspace")}
          status="neutral"
        />
      </section>

      <DashboardIntelligencePanel />

      <section className="dashboard-v2__grid">
        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>{t("dashboard.productionOverview")}</span>
              <h3>{t("dashboard.workspaceDistribution")}</h3>
            </div>
          </header>

          <DashboardChart
            values={chartValues}
            labels={chartLabels}
          />
        </article>

        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>{t("quickActions.title")}</span>
              <h3>{t("quickActions.subtitle")}</h3>
            </div>
          </header>

          <DashboardQuickActions actions={quickActions} />
        </article>

        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>{t("dashboard.recentActivity")}</span>
              <h3>{t("dashboard.latestItems")}</h3>
            </div>
          </header>

          <DashboardActivityFeed activities={activities} />
        </article>

        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>{t("dashboard.systemStatus")}</span>
              <h3>{t("dashboard.operationalHealth")}</h3>
            </div>
          </header>

          <div className="dashboard-v2-system-health">
            <div
              className="dashboard-v2-system-health__ring"
              style={{
                background: `radial-gradient(
                  circle,
                  var(--cos-surface, #101827) 58%,
                  transparent 59%
                ),
                conic-gradient(
                  #34d399 0deg ${systemHealth * 3.6}deg,
                  rgba(148, 163, 184, 0.1) ${systemHealth * 3.6}deg 360deg
                )`,
              }}
            >
              <div>
                <strong>{systemHealth}%</strong>
                <span>
                  {connected ? t("dashboard.healthy") : t("dashboard.attention")}
                </span>
              </div>
            </div>

            <div className="dashboard-v2-system-list">
              {operationalSystems.map((system) => (
                <div key={system.label}>
                  <span>{system.label}</span>

                  <strong
                    className={
                      system.healthy
                        ? "dashboard-v2-system-list__healthy"
                        : "dashboard-v2-system-list__offline"
                    }
                  >
                    {system.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}



















