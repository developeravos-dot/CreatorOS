import {
  useEffect,
  useRef,
} from "react";

import {
  useDashboardFocusTrap,
} from "../accessibility/useDashboardFocusTrap";

import DashboardPersonalizationPanel from "./DashboardPersonalizationPanel";

import type {
  DashboardAccessibilityPreferences,
} from "../accessibility/dashboard-accessibility-types";

import type {
  DashboardDensity,
  DashboardLayoutMode,
  DashboardSavedView,
  DashboardSectionId,
  DashboardSectionPreference,
} from "./dashboard-personalization-types";

interface DashboardPersonalizationDrawerProps {
  open: boolean;

  density:
    DashboardDensity;

  layoutMode:
    DashboardLayoutMode;

  sections:
    DashboardSectionPreference[];

  savedViews:
    DashboardSavedView[];

  activeViewId:
    string | null;

  accessibility:
    DashboardAccessibilityPreferences;

  onReducedMotionChange: (
    value: boolean,
  ) => void;

  onHighContrastChange: (
    value: boolean,
  ) => void;

  onAnnounceUpdatesChange: (
    value: boolean,
  ) => void;

  onClose: () => void;

  onDensityChange: (
    value:
      DashboardDensity,
  ) => void;

  onLayoutModeChange: (
    value:
      DashboardLayoutMode,
  ) => void;

  onToggleSection: (
    sectionId:
      DashboardSectionId,
  ) => void;

  onMoveSection: (
    sectionId:
      DashboardSectionId,
    direction:
      "up" |
      "down",
  ) => void;

  onReset: () => void;

  onSaveView: (
    name: string,
    description: string,
  ) => void;

  onApplyView: (
    viewId: string,
  ) => void;

  onUpdateActiveView: () => void;

  onDeleteView: (
    viewId: string,
  ) => void;
}

export default function DashboardPersonalizationDrawer({
  open,
  density,
  layoutMode,
  sections,
  savedViews,
  activeViewId,
  accessibility,
  onReducedMotionChange,
  onHighContrastChange,
  onAnnounceUpdatesChange,
  onClose,
  onDensityChange,
  onLayoutModeChange,
  onToggleSection,
  onMoveSection,
  onReset,
  onSaveView,
  onApplyView,
  onUpdateActiveView,
  onDeleteView,
}: DashboardPersonalizationDrawerProps) {
  const panelRef =
    useRef<HTMLElement | null>(
      null,
    );

  useDashboardFocusTrap(
    panelRef,
    open,
  );

  useEffect(
    () => {
      if (!open) {
        return;
      }

      const handleKeyDown = (
        event: KeyboardEvent,
      ): void => {
        if (
          event.key === "Escape"
        ) {
          onClose();
        }
      };

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [
      onClose,
      open,
    ],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="dashboard-personalization-drawer"
      role="presentation"
    >
      <button
        type="button"
        className="dashboard-personalization-drawer__backdrop"
        aria-label="Close personalization"
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        className="dashboard-personalization-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard personalization"
      >
        <div className="dashboard-personalization-drawer__toolbar">
          <strong>
            Dashboard settings
          </strong>

          <button
            type="button"
            aria-label="Close dashboard personalization"
            onClick={onClose}
          >
            {"\u00D7"}
          </button>
        </div>

        <div className="dashboard-personalization-drawer__content">
          <DashboardPersonalizationPanel
            density={density}
            layoutMode={
              layoutMode
            }
            sections={sections}
            savedViews={
              savedViews
            }
            activeViewId={
              activeViewId
            }
            accessibility={
              accessibility
            }
            onReducedMotionChange={
              onReducedMotionChange
            }
            onHighContrastChange={
              onHighContrastChange
            }
            onAnnounceUpdatesChange={
              onAnnounceUpdatesChange
            }
            onDensityChange={
              onDensityChange
            }
            onLayoutModeChange={
              onLayoutModeChange
            }
            onToggleSection={
              onToggleSection
            }
            onMoveSection={
              onMoveSection
            }
            onReset={onReset}
            onSaveView={
              onSaveView
            }
            onApplyView={
              onApplyView
            }
            onUpdateActiveView={
              onUpdateActiveView
            }
            onDeleteView={
              onDeleteView
            }
          />
        </div>
      </aside>
    </div>
  );
}
