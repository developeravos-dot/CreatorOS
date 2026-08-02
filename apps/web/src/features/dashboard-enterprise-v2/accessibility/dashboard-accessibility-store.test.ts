import {
  describe,
  expect,
  it,
} from "vitest";

import {
  announceDashboardUpdate,
  clearDashboardAnnouncements,
  getDashboardAccessibilityPreferences,
  getDashboardAnnouncements,
  resetDashboardAccessibilityPreferences,
  updateDashboardAccessibilityPreferences,
} from "./dashboard-accessibility-store";

describe(
  "dashboard accessibility store",
  () => {
    it(
      "updates accessibility preferences",
      () => {
        resetDashboardAccessibilityPreferences();

        updateDashboardAccessibilityPreferences({
          reducedMotion: true,
          highContrast: true,
        });

        expect(
          getDashboardAccessibilityPreferences(),
        ).toMatchObject({
          reducedMotion: true,
          highContrast: true,
        });
      },
    );

    it(
      "records dashboard announcements",
      () => {
        resetDashboardAccessibilityPreferences();
        clearDashboardAnnouncements();

        announceDashboardUpdate(
          "Dashboard refreshed.",
          "polite",
          new Date(
            "2026-08-02T12:00:00.000Z",
          ),
        );

        expect(
          getDashboardAnnouncements(),
        ).toEqual([
          {
            id:
              "dashboard-announcement-1785672000000",

            message:
              "Dashboard refreshed.",

            priority:
              "polite",

            createdAt:
              "2026-08-02T12:00:00.000Z",
          },
        ]);
      },
    );

    it(
      "respects disabled announcements",
      () => {
        resetDashboardAccessibilityPreferences();
        clearDashboardAnnouncements();

        updateDashboardAccessibilityPreferences({
          announceUpdates: false,
        });

        expect(
          announceDashboardUpdate(
            "Hidden update",
          ),
        ).toBeNull();

        expect(
          getDashboardAnnouncements(),
        ).toHaveLength(0);
      },
    );
  },
);
