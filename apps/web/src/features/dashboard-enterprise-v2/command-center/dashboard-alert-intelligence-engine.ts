import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import type {
  DashboardOperationalAlert,
} from "./dashboard-command-center-types";

export function buildDashboardAlerts(
  dashboard:
    EnterpriseDashboard,
  connected: boolean,
): DashboardOperationalAlert[] {
  const alerts:
    DashboardOperationalAlert[] = [];

  if (!connected) {
    alerts.push({
      id: "api-disconnected",
      title:
        "Enterprise API disconnected",
      description:
        "Live operational data may be incomplete until connectivity is restored.",
      severity: "critical",
      actionLabel:
        "Retry connection",
    });
  }

  if (
    dashboard.metrics.projects === 0
  ) {
    alerts.push({
      id: "no-projects",
      title:
        "Production pipeline is empty",
      description:
        "Create the first project to initialize CreatorOS production.",
      severity: "warning",
      actionLabel:
        "Create project",
    });
  }

  if (
    dashboard.metrics.projects > 0 &&
    dashboard.metrics.activeProjects === 0
  ) {
    alerts.push({
      id: "no-active-projects",
      title:
        "No active projects",
      description:
        "Existing projects are not currently participating in production.",
      severity: "warning",
    });
  }

  if (
    dashboard.metrics.scripts === 0 &&
    dashboard.metrics.projects > 0
  ) {
    alerts.push({
      id: "no-scripts",
      title:
        "Script pipeline requires content",
      description:
        "Projects exist, but no scripts are available for production.",
      severity: "info",
      actionLabel:
        "Create script",
    });
  }

  if (
    dashboard.metrics.scripts > 0 &&
    dashboard.metrics.scheduledContent === 0
  ) {
    alerts.push({
      id: "no-scheduled-content",
      title:
        "Publishing queue is empty",
      description:
        "Scripts are available but no content has been scheduled.",
      severity: "info",
      actionLabel:
        "Schedule content",
    });
  }

  if (
    dashboard.metrics.prompts === 0
  ) {
    alerts.push({
      id: "no-prompts",
      title:
        "AI automation assets unavailable",
      description:
        "Create reusable prompts to improve workflow automation.",
      severity: "info",
      actionLabel:
        "Create prompt",
    });
  }

  return alerts;
}
