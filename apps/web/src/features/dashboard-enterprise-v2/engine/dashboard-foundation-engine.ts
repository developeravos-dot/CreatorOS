import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  average,
  formatMetricValue,
  safeRatio,
} from "./dashboard-math";

import type {
  DashboardFoundationInput,
  DashboardFoundationSnapshot,
  DashboardMetric,
  DashboardMetricTone,
  DashboardOperationalStatus,
} from "../dashboard-foundation-types";

function metricTone(
  percentage: number,
): DashboardMetricTone {
  if (percentage >= 75) {
    return "success";
  }

  if (percentage >= 45) {
    return "info";
  }

  if (percentage > 0) {
    return "warning";
  }

  return "neutral";
}

function buildMetrics(
  dashboard: EnterpriseDashboard,
): DashboardMetric[] {
  const {
    projects,
    activeProjects,
    scripts,
    scheduledContent,
    prompts,
  } = dashboard.metrics;

  const projectActivity =
    safeRatio(
      activeProjects,
      projects,
    );

  const scriptCoverage =
    safeRatio(
      scripts,
      Math.max(
        projects,
        1,
      ),
    );

  const schedulingCoverage =
    safeRatio(
      scheduledContent,
      Math.max(
        scripts,
        1,
      ),
    );

  const promptCoverage =
    safeRatio(
      prompts,
      Math.max(
        projects,
        1,
      ),
    );

  return [
    {
      id: "projects",
      label: "Total projects",
      value: projects,
      formattedValue:
        formatMetricValue(
          projects,
        ),
      description:
        "All registered CreatorOS production workspaces.",
      tone:
        projects > 0
          ? "info"
          : "neutral",
      progress:
        projectActivity,
    },
    {
      id: "active-projects",
      label: "Active projects",
      value: activeProjects,
      formattedValue:
        formatMetricValue(
          activeProjects,
        ),
      description:
        "Projects currently participating in production.",
      tone:
        metricTone(
          projectActivity,
        ),
      progress:
        projectActivity,
      trend: {
        direction:
          projectActivity >= 50
            ? "up"
            : activeProjects > 0
              ? "stable"
              : "down",
        value:
          projectActivity,
        label:
          `${projectActivity}% active`,
      },
    },
    {
      id: "scripts",
      label: "Scripts",
      value: scripts,
      formattedValue:
        formatMetricValue(
          scripts,
        ),
      description:
        "Scripts available across the production pipeline.",
      tone:
        scripts > 0
          ? "success"
          : "neutral",
      progress:
        scriptCoverage,
    },
    {
      id: "scheduled-content",
      label:
        "Scheduled content",
      value:
        scheduledContent,
      formattedValue:
        formatMetricValue(
          scheduledContent,
        ),
      description:
        "Content entries currently assigned to publishing dates.",
      tone:
        metricTone(
          schedulingCoverage,
        ),
      progress:
        schedulingCoverage,
    },
    {
      id: "prompts",
      label:
        "Reusable prompts",
      value: prompts,
      formattedValue:
        formatMetricValue(
          prompts,
        ),
      description:
        "Prompt assets available to CreatorOS agents and workflows.",
      tone:
        metricTone(
          promptCoverage,
        ),
      progress:
        promptCoverage,
    },
  ];
}

function buildStatuses(
  connected: boolean,
  dashboard: EnterpriseDashboard,
): DashboardOperationalStatus[] {
  const hasProjects =
    dashboard.metrics.projects > 0;

  const hasScripts =
    dashboard.metrics.scripts > 0;

  const hasScheduledContent =
    dashboard.metrics
      .scheduledContent > 0;

  return [
    {
      id: "api",
      label: "Enterprise API",
      value:
        connected
          ? "Connected"
          : "Disconnected",
      tone:
        connected
          ? "success"
          : "danger",
      description:
        connected
          ? "The dashboard is receiving enterprise data."
          : "The dashboard is operating without a live API connection.",
    },
    {
      id: "projects",
      label:
        "Project pipeline",
      value:
        hasProjects
          ? "Available"
          : "Empty",
      tone:
        hasProjects
          ? "success"
          : "warning",
      description:
        hasProjects
          ? "Project workspaces are available for production."
          : "Create a project to initialize the production pipeline.",
    },
    {
      id: "scripts",
      label:
        "Script pipeline",
      value:
        hasScripts
          ? "Available"
          : "Empty",
      tone:
        hasScripts
          ? "success"
          : "warning",
      description:
        hasScripts
          ? "Script assets are available for review and production."
          : "No scripts are currently registered.",
    },
    {
      id: "publishing",
      label:
        "Publishing queue",
      value:
        hasScheduledContent
          ? "Scheduled"
          : "Waiting",
      tone:
        hasScheduledContent
          ? "info"
          : "neutral",
      description:
        hasScheduledContent
          ? "Scheduled content is present in the publishing calendar."
          : "The publishing queue has no scheduled content.",
    },
  ];
}

export function buildDashboardFoundation(
  input: DashboardFoundationInput,
): DashboardFoundationSnapshot {
  const {
    dashboard,
    connected,
  } = input;

  const activeRatio =
    safeRatio(
      dashboard.metrics
        .activeProjects,
      dashboard.metrics.projects,
    );

  const schedulingRatio =
    safeRatio(
      dashboard.metrics
        .scheduledContent,
      dashboard.metrics.scripts,
    );

  const automationRatio =
    safeRatio(
      dashboard.metrics.prompts,
      Math.max(
        dashboard.metrics.projects,
        1,
      ),
    );

  const productionReadiness =
    Math.round(
      average([
        connected ? 100 : 0,
        activeRatio,
        schedulingRatio,
        automationRatio,
      ]),
    );

  const totalEntities =
    dashboard.metrics.projects +
    dashboard.metrics.scripts +
    dashboard.metrics
      .scheduledContent +
    dashboard.metrics.prompts;

  return {
    generatedAt:
      new Date().toISOString(),

    connected,

    metrics:
      buildMetrics(
        dashboard,
      ),

    statuses:
      buildStatuses(
        connected,
        dashboard,
      ),

    summary: {
      totalEntities,
      productionReadiness,
      activeRatio,
      schedulingRatio,
      automationRatio,
    },
  };
}
