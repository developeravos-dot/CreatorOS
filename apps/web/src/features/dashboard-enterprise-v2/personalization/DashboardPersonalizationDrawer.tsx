import {
  useEffect,
} from "react";

import DashboardPersonalizationPanel from "./DashboardPersonalizationPanel";

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
            ×
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
