import type {
  DashboardAccessibilityPreferences,
} from "./dashboard-accessibility-types";

interface DashboardAccessibilityControlsProps {
  preferences:
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
}

export default function DashboardAccessibilityControls({
  preferences,
  onReducedMotionChange,
  onHighContrastChange,
  onAnnounceUpdatesChange,
}: DashboardAccessibilityControlsProps) {
  return (
    <section className="dashboard-accessibility-controls">
      <h3>
        Accessibility
      </h3>

      <label>
        <input
          type="checkbox"
          checked={
            preferences.reducedMotion
          }
          onChange={(event) =>
            onReducedMotionChange(
              event.target.checked,
            )
          }
        />

        <span>
          Reduce animations
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            preferences.highContrast
          }
          onChange={(event) =>
            onHighContrastChange(
              event.target.checked,
            )
          }
        />

        <span>
          Increase contrast
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            preferences.announceUpdates
          }
          onChange={(event) =>
            onAnnounceUpdatesChange(
              event.target.checked,
            )
          }
        />

        <span>
          Announce dashboard updates
        </span>
      </label>
    </section>
  );
}
