import {
  useCallback,
  useSyncExternalStore,
} from "react";

import {
  getDashboardAccessibilityPreferencesSnapshot,
  subscribeDashboardAccessibility,
  updateDashboardAccessibilityPreferences,
} from "../accessibility/dashboard-accessibility-store";

export function useDashboardAccessibility() {
  const preferences =
    useSyncExternalStore(
      subscribeDashboardAccessibility,
      getDashboardAccessibilityPreferencesSnapshot,
      getDashboardAccessibilityPreferencesSnapshot,
    );

  const setReducedMotion =
    useCallback(
      (
        value: boolean,
      ): void => {
        updateDashboardAccessibilityPreferences({
          reducedMotion: value,
        });
      },
      [],
    );

  const setHighContrast =
    useCallback(
      (
        value: boolean,
      ): void => {
        updateDashboardAccessibilityPreferences({
          highContrast: value,
        });
      },
      [],
    );

  const setAnnounceUpdates =
    useCallback(
      (
        value: boolean,
      ): void => {
        updateDashboardAccessibilityPreferences({
          announceUpdates: value,
        });
      },
      [],
    );

  return {
    preferences,
    setReducedMotion,
    setHighContrast,
    setAnnounceUpdates,
  };
}
