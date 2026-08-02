import {
  useEffect,
  useState,
} from "react";

import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardFoundationShell from "./components/DashboardFoundationShell";

import type {
  DashboardOperationalAlert,
  DashboardQuickCommand,
} from "./command-center/dashboard-command-center-types";

import {
  announceDashboardUpdate,
} from "./accessibility/dashboard-accessibility-store";

import DashboardLiveRegion from "./accessibility/DashboardLiveRegion";

import {
  useDashboardAccessibility,
} from "./hooks/useDashboardAccessibility";

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

import {
  useDashboardPerformance,
} from "./hooks/useDashboardPerformance";

import {
  useDashboardRenderMeasurement,
} from "./hooks/useDashboardRenderMeasurement";

import DashboardErrorBoundary from "./performance/DashboardErrorBoundary";
import DashboardLazySection from "./performance/DashboardLazySection";
import DashboardPerformancePanel from "./performance/DashboardPerformancePanel";

import {
  LazyDashboardCommandCenterOverview,
  LazyDashboardIntelligenceOverview,
  LazyDashboardPersonalizationDrawer,
} from "./performance/dashboard-lazy-components";

import DashboardPersonalizationButton from "./personalization/DashboardPersonalizationButton";

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

  useDashboardRenderMeasurement(
    "dashboard-enterprise-v2",
  );

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

  const accessibility =
    useDashboardAccessibility();

  const performanceSnapshot =
    useDashboardPerformance({
      componentCount: 120,
      estimatedBundleKb: 478,
    });

  useEffect(
    () => {
      if (refreshing) {
        announceDashboardUpdate(
          "Dashboard refresh started.",
        );
      }
    },
    [
      refreshing,
    ],
  );

  useEffect(
    () => {
      if (!refreshing && !loading) {
        announceDashboardUpdate(
          "Dashboard data is ready.",
        );
      }
    },
    [
      loading,
      refreshing,
    ],
  );

  const runCommand = (
    command:
      DashboardQuickCommand,
  ): void => {
    announceDashboardUpdate(
      `${command.label} selected.`,
    );

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
    announceDashboardUpdate(
      `${alert.title} action selected.`,
      alert.severity ===
        "critical"
        ? "assertive"
        : "polite",
    );

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
          <DashboardLazySection
            key="intelligence"
            label="KPI intelligence"
          >
            <LazyDashboardIntelligenceOverview
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
          </DashboardLazySection>
        );

      case "command-center":
        if (
          loading ||
          error
        ) {
          return null;
        }

        return (
          <DashboardLazySection
            key="command-center"
            label="operational command center"
          >
            <LazyDashboardCommandCenterOverview
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
          </DashboardLazySection>
        );
    }
  };

  return (
    <div
      className={[
        "dashboard-enterprise-v2-personalized",
        `dashboard-enterprise-v2-personalized--${personalization.preferences.density}`,
        `dashboard-enterprise-v2-personalized--${personalization.preferences.layoutMode}`,
        accessibility.preferences.reducedMotion
          ? "dashboard-enterprise-v2-personalized--reduced-motion"
          : "",
        accessibility.preferences.highContrast
          ? "dashboard-enterprise-v2-personalized--high-contrast"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <DashboardLiveRegion />

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

      <DashboardErrorBoundary>
        <div className="dashboard-enterprise-v2-stack">
          {personalization.visibleSections.map(
            (section) =>
              renderSection(
                section.id,
              ),
          )}
        </div>
      </DashboardErrorBoundary>

      <DashboardPerformancePanel
        snapshot={
          performanceSnapshot
        }
      />

      <DashboardLazySection
        label="dashboard personalization"
      >
        <LazyDashboardPersonalizationDrawer
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
          accessibility={
            accessibility.preferences
          }
          onReducedMotionChange={
            accessibility.setReducedMotion
          }
          onHighContrastChange={
            accessibility.setHighContrast
          }
          onAnnounceUpdatesChange={
            accessibility.setAnnounceUpdates
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

            announceDashboardUpdate(
              "Dashboard view saved.",
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
      </DashboardLazySection>
    </div>
  );
}
