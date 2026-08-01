import { useMemo } from "react";
import type { EnterpriseDashboard } from "../enterprise-api";
import {
  DashboardActivityFeed,
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

function getSystemStatusLabel(value: string): string {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("operational") ||
    normalized.includes("active") ||
    normalized.includes("ready") ||
    normalized.includes("connected")
  ) {
    return "Operational";
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
    "Projects",
    "Active",
    "Scripts",
    "Calendar",
    "Prompts",
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
        time: "Project",
      }));

    const scriptActivities: DashboardActivity[] = dashboard.scripts
      .slice(0, 3)
      .map((script) => ({
        id: `script-${script.id}`,
        icon: "✎",
        title: script.title,
        description: scriptStatusLabels[script.status],
        time: "Script",
      }));

    return [...projectActivities, ...scriptActivities].slice(0, 5);
  }, [dashboard.projects, dashboard.scripts]);

  const quickActions = useMemo<DashboardQuickAction[]>(
    () => [
      {
        id: "create-project",
        icon: "＋",
        title: "Create project",
        description: "Start a new content workspace",
        disabled: busy,
        onClick: () => {
          void onCreateProject();
        },
      },
      {
        id: "create-script",
        icon: "✎",
        title: "Create script",
        description: "Add a script to a project",
        disabled: busy,
        onClick: () => {
          void onCreateScript();
        },
      },
      {
        id: "schedule-content",
        icon: "▣",
        title: "Schedule content",
        description: "Add a publishing date",
        disabled: busy,
        onClick: () => {
          void onSchedule();
        },
      },
      {
        id: "create-prompt",
        icon: "✦",
        title: "Create AI prompt",
        description: "Save an intelligent template",
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
      label: "Backend API",
      value: connected ? "Connected" : "Disconnected",
      healthy: connected,
    },
    {
      label: "Project Engine",
      value: getSystemStatusLabel(dashboard.system.projectEngine),
      healthy: true,
    },
    {
      label: "Script Engine",
      value: getSystemStatusLabel(dashboard.system.scriptEngine),
      healthy: true,
    },
    {
      label: "Calendar Engine",
      value: getSystemStatusLabel(dashboard.system.calendarEngine),
      healthy: true,
    },
    {
      label: "Prompt Engine",
      value: getSystemStatusLabel(dashboard.system.promptEngine),
      healthy: true,
    },
    {
      label: "Storage",
      value: getSystemStatusLabel(dashboard.system.storage),
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
          <span>CREATOROS ENTERPRISE</span>
          <h2>Command Center</h2>
          <p>
            Monitor projects, scripts, publishing operations and the
            CreatorOS production infrastructure from one workspace.
          </p>
        </div>

        <div className="dashboard-v2__header-actions">
          <button
            type="button"
            className="dashboard-v2-button"
            disabled={busy}
            onClick={() => void onSchedule()}
          >
            Schedule
          </button>

          <button
            type="button"
            className="dashboard-v2-button dashboard-v2-button--primary"
            disabled={busy}
            onClick={() => void onCreateProject()}
          >
            ＋ New Project
          </button>
        </div>
      </header>

      <section className="dashboard-v2__metrics">
        <DashboardMetricCard
          title="Projects"
          value={dashboard.metrics.projects}
          description="Total content workspaces"
          icon="▦"
          trend={`${dashboard.metrics.activeProjects} active`}
          status="positive"
        />

        <DashboardMetricCard
          title="Scripts"
          value={dashboard.metrics.scripts}
          description="Scripts stored on the server"
          icon="✎"
          trend="Production assets"
          status="neutral"
        />

        <DashboardMetricCard
          title="Scheduled Content"
          value={dashboard.metrics.scheduledContent}
          description="Publishing calendar items"
          icon="▣"
          trend="Calendar pipeline"
          status={
            dashboard.metrics.scheduledContent > 0
              ? "positive"
              : "warning"
          }
        />

        <DashboardMetricCard
          title="AI Prompts"
          value={dashboard.metrics.prompts}
          description="Reusable intelligent templates"
          icon="✦"
          trend="AI workspace"
          status="neutral"
        />
      </section>

      <section className="dashboard-v2__grid">
        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>PRODUCTION OVERVIEW</span>
              <h3>Workspace distribution</h3>
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
              <span>QUICK ACTIONS</span>
              <h3>Start creating</h3>
            </div>
          </header>

          <DashboardQuickActions actions={quickActions} />
        </article>

        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>RECENT ACTIVITY</span>
              <h3>Latest workspace items</h3>
            </div>
          </header>

          <DashboardActivityFeed activities={activities} />
        </article>

        <article className="dashboard-v2-panel">
          <header className="dashboard-v2-panel__header">
            <div>
              <span>SYSTEM STATUS</span>
              <h3>Operational health</h3>
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
                  {connected ? "Healthy" : "Attention"}
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
