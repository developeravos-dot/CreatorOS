import DashboardAccessibilityControls from "../accessibility/DashboardAccessibilityControls";

import DashboardDensitySelector from "./DashboardDensitySelector";
import DashboardLayoutModeSelector from "./DashboardLayoutModeSelector";
import DashboardSavedViewsPanel from "./DashboardSavedViewsPanel";
import DashboardSectionManager from "./DashboardSectionManager";

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

interface DashboardPersonalizationPanelProps {
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

export default function DashboardPersonalizationPanel({
  density,
  layoutMode,
  sections,
  savedViews,
  activeViewId,
  accessibility,
  onReducedMotionChange,
  onHighContrastChange,
  onAnnounceUpdatesChange,
  onDensityChange,
  onLayoutModeChange,
  onToggleSection,
  onMoveSection,
  onReset,
  onSaveView,
  onApplyView,
  onUpdateActiveView,
  onDeleteView,
}: DashboardPersonalizationPanelProps) {
  return (
    <div className="dashboard-personalization-panel">
      <header>
        <div>
          <h2>
            Personalize dashboard
          </h2>

          <p>
            Configure spacing, section visibility, order and saved views.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
        >
          Reset
        </button>
      </header>

      <section>
        <h3>
          Density
        </h3>

        <DashboardDensitySelector
          value={density}
          onChange={
            onDensityChange
          }
        />
      </section>

      <section>
        <h3>
          Layout mode
        </h3>

        <DashboardLayoutModeSelector
          value={layoutMode}
          onChange={
            onLayoutModeChange
          }
        />
      </section>

      <section>
        <h3>
          Sections
        </h3>

        <DashboardSectionManager
          sections={sections}
          onToggle={
            onToggleSection
          }
          onMove={
            onMoveSection
          }
        />
      </section>

      <DashboardAccessibilityControls
        preferences={
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
      />

      <section>
        <h3>
          Saved views
        </h3>

        <DashboardSavedViewsPanel
          savedViews={
            savedViews
          }
          activeViewId={
            activeViewId
          }
          onSave={
            onSaveView
          }
          onApply={
            onApplyView
          }
          onUpdateActive={
            onUpdateActiveView
          }
          onDelete={
            onDeleteView
          }
        />
      </section>
    </div>
  );
}
