import {
  useState,
} from "react";

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

import {
  useDashboardPersonalization,
} from "./hooks/useDashboardPersonalization";

import DashboardPersonalizationButton from "./personalization/DashboardPersonalizationButton";
import DashboardPersonalizationDrawer from "./personalization/DashboardPersonalizationDrawer";

import type {
  DashboardSectionId,
} from "./personalization/dashboard-personalization-types";

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
  const [
    personalizationOpen,
    setPersonalizationOpen,
  ] = useState(false);

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

  const personalization =
    useDashboardPersonalization();

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

  const renderSection = (
    sectionId:
      DashboardSectionId,
  ) => {
    switch (sectionId) {
      case "foundation":
        return (
          <DashboardFoundationShell
            key="foundation"
            snapshot={foundation}
            loading={loading}
            refreshing={
              refreshing
            }
            error={error}
            onRefresh={onRefresh}
          />
        );

      case "intelligence":
        if (
          loading ||
          error
        ) {
          return null;
        }

        return (
          <DashboardIntelligenceOverview
            key="intelligence"
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
        );

      case "command-center":
        if (
          loading ||
          error
        ) {
          return null;
        }

        return (
          <DashboardCommandCenterOverview
            key="command-center"
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
        );
    }
  };

  return (
    <div
      className={[
        "dashboard-enterprise-v2-personalized",
        `dashboard-enterprise-v2-personalized--${personalization.preferences.density}`,
        `dashboard-enterprise-v2-personalized--${personalization.preferences.layoutMode}`,
      ].join(" ")}
    >
      <div className="dashboard-enterprise-v2-personalized__toolbar">
        <div>
          <span>
            Layout
          </span>

          <strong>
            {
              personalization.preferences
                .layoutMode
            }
          </strong>
        </div>

        <DashboardPersonalizationButton
          onClick={() =>
            setPersonalizationOpen(
              true,
            )
          }
        />
      </div>

      <div className="dashboard-enterprise-v2-stack">
        {personalization.visibleSections.map(
          (section) =>
            renderSection(
              section.id,
            ),
        )}
      </div>

      <DashboardPersonalizationDrawer
        open={
          personalizationOpen
        }
        density={
          personalization.preferences
            .density
        }
        layoutMode={
          personalization.preferences
            .layoutMode
        }
        sections={
          personalization.preferences
            .sections
        }
        savedViews={
          personalization.savedViews
        }
        activeViewId={
          personalization.activeViewId
        }
        onClose={() =>
          setPersonalizationOpen(
            false,
          )
        }
        onDensityChange={
          personalization.setDensity
        }
        onLayoutModeChange={
          personalization.setLayoutMode
        }
        onToggleSection={
          personalization.toggleSection
        }
        onMoveSection={
          personalization.moveSection
        }
        onReset={
          personalization.resetPreferences
        }
        onSaveView={(
          name,
          description,
        ) => {
          personalization.saveView(
            name,
            description,
          );
        }}
        onApplyView={
          personalization.applyView
        }
        onUpdateActiveView={
          personalization.updateActiveView
        }
        onDeleteView={
          personalization.deleteView
        }
      />
    </div>
  );
}
