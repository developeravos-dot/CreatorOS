import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardIntelligenceOverview from "./charts/DashboardIntelligenceOverview";
import DashboardFoundationShell from "./components/DashboardFoundationShell";
import DashboardCommandCenterOverview from "./command-center/DashboardCommandCenterOverview";

import type {
  DashboardOperationalAlert,
  DashboardQuickCommand,
} from "./command-center/dashboard-command-center-types";

import {
  useDashboardCharts,
} from "./hooks/useDashboardCharts";

import {
  useDashboardCommandCenter,
} from "./hooks/useDashboardCommandCenter";

import {
  useDashboardFoundation,
} from "./hooks/useDashboardFoundation";

interface DashboardEnterpriseV2Props {
  dashboard:
    EnterpriseDashboard;

  connected: boolean;
  loading?: boolean;
  refreshing?: boolean;
  error?: string | null;

  onRefresh?: () => void;
  onCreateProject?: () => void;
  onCreateScript?: () => void;
  onScheduleContent?: () => void;
  onCreatePrompt?: () => void;
}

export default function DashboardEnterpriseV2({
  dashboard,
  connected,
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
  onCreateProject,
  onCreateScript,
  onScheduleContent,
  onCreatePrompt,
}: DashboardEnterpriseV2Props) {
  const foundation =
    useDashboardFoundation({
      dashboard,
      connected,
    });

  const {
    period,
    setPeriod,
    snapshot:
      chartSnapshot,
  } = useDashboardCharts({
    dashboard,
  });

  const commandCenter =
    useDashboardCommandCenter({
      dashboard,
      connected,
      busy:
        loading ||
        refreshing,
    });

  const runCommand = (
    command:
      DashboardQuickCommand,
  ): void => {
    switch (command.id) {
      case "create-project":
        onCreateProject?.();
        break;

      case "create-script":
        onCreateScript?.();
        break;

      case "schedule-content":
        onScheduleContent?.();
        break;

      case "create-prompt":
        onCreatePrompt?.();
        break;
    }
  };

  const runAlertAction = (
    alert:
      DashboardOperationalAlert,
  ): void => {
    switch (alert.id) {
      case "api-disconnected":
        onRefresh?.();
        break;

      case "no-projects":
        onCreateProject?.();
        break;

      case "no-scripts":
        onCreateScript?.();
        break;

      case "no-scheduled-content":
        onScheduleContent?.();
        break;

      case "no-prompts":
        onCreatePrompt?.();
        break;
    }
  };

  return (
    <div className="dashboard-enterprise-v2-stack">
      <DashboardFoundationShell
        snapshot={foundation}
        loading={loading}
        refreshing={
          refreshing
        }
        error={error}
        onRefresh={onRefresh}
      />

      {!loading && !error ? (
        <>
          <DashboardIntelligenceOverview
            snapshot={
              chartSnapshot
            }
            period={period}
            loading={
              refreshing
            }
            onPeriodChange={
              setPeriod
            }
          />

          <DashboardCommandCenterOverview
            snapshot={
              commandCenter
            }
            onCommand={
              runCommand
            }
            onAlertAction={
              runAlertAction
            }
          />
        </>
      ) : null}
    </div>
  );
}
