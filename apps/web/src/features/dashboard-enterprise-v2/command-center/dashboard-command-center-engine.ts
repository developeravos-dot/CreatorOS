import type {
  EnterpriseDashboard,
} from "../../../enterprise-api";

import {
  buildDashboardLiveActivities,
} from "../activity/dashboard-live-activity-engine";

import {
  buildDashboardAlerts,
} from "./dashboard-alert-intelligence-engine";

import {
  buildDashboardQuickCommands,
} from "./dashboard-quick-commands-engine";

import type {
  DashboardCommandCenterSnapshot,
} from "./dashboard-command-center-types";

interface BuildDashboardCommandCenterInput {
  dashboard:
    EnterpriseDashboard;

  connected: boolean;
  busy: boolean;
  now?: Date;
}

export function buildDashboardCommandCenter({
  dashboard,
  connected,
  busy,
  now = new Date(),
}: BuildDashboardCommandCenterInput):
  DashboardCommandCenterSnapshot {
  const activities =
    buildDashboardLiveActivities(
      dashboard,
      now,
    );

  const commands =
    buildDashboardQuickCommands({
      busy,
      hasProjects:
        dashboard.metrics
          .projects > 0,
    });

  const alerts =
    buildDashboardAlerts(
      dashboard,
      connected,
    );

  return {
    generatedAt:
      now.toISOString(),

    activities,
    commands,
    alerts,

    summary: {
      totalActivities:
        activities.length,

      actionableAlerts:
        alerts.filter(
          (alert) =>
            Boolean(
              alert.actionLabel,
            ),
        ).length,

      criticalAlerts:
        alerts.filter(
          (alert) =>
            alert.severity ===
            "critical",
        ).length,

      availableCommands:
        commands.filter(
          (command) =>
            !command.disabled,
        ).length,
    },
  };
}
