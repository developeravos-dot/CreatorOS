import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import DashboardAccessibilityControls from "./DashboardAccessibilityControls";
import DashboardLiveRegion from "./DashboardLiveRegion";

import {
  announceDashboardUpdate,
  clearDashboardAnnouncements,
  resetDashboardAccessibilityPreferences,
} from "./dashboard-accessibility-store";

describe(
  "dashboard accessibility components",
  () => {
    it(
      "updates accessibility controls",
      () => {
        const onReducedMotionChange =
          vi.fn();

        render(
          <DashboardAccessibilityControls
            preferences={{
              reducedMotion: false,
              highContrast: false,
              announceUpdates: true,
            }}
            onReducedMotionChange={
              onReducedMotionChange
            }
            onHighContrastChange={
              vi.fn()
            }
            onAnnounceUpdatesChange={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Reduce animations",
            },
          ),
        );

        expect(
          onReducedMotionChange,
        ).toHaveBeenCalledWith(
          true,
        );
      },
    );

    it(
      "renders live announcements",
      () => {
        resetDashboardAccessibilityPreferences();
        clearDashboardAnnouncements();

        render(
          <DashboardLiveRegion />,
        );

        act(() => {
          announceDashboardUpdate(
            "Dashboard updated.",
          );
        });

        expect(
          screen.getByText(
            "Dashboard updated.",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
