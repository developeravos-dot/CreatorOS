import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createDashboardSavedView,
  moveDashboardSection,
  resetDashboardPreferences,
  toggleDashboardSection,
  updateDashboardDensity,
  updateDashboardLayoutMode,
} from "./dashboard-personalization-engine";

describe(
  "dashboard personalization engine",
  () => {
    it(
      "updates density",
      () => {
        const preferences =
          updateDashboardDensity(
            resetDashboardPreferences(),
            "compact",
          );

        expect(
          preferences.density,
        ).toBe("compact");
      },
    );

    it(
      "updates layout mode",
      () => {
        const preferences =
          updateDashboardLayoutMode(
            resetDashboardPreferences(),
            "analytics",
          );

        expect(
          preferences.layoutMode,
        ).toBe("analytics");
      },
    );

    it(
      "toggles dashboard sections",
      () => {
        const preferences =
          toggleDashboardSection(
            resetDashboardPreferences(),
            "intelligence",
          );

        expect(
          preferences.sections.find(
            (section) =>
              section.id ===
              "intelligence",
          )?.visible,
        ).toBe(false);
      },
    );

    it(
      "moves dashboard sections",
      () => {
        const preferences =
          moveDashboardSection(
            resetDashboardPreferences(),
            "command-center",
            "up",
          );

        expect(
          preferences.sections
            .sort(
              (
                left,
                right,
              ) =>
                left.order -
                right.order,
            )[1]?.id,
        ).toBe(
          "command-center",
        );
      },
    );

    it(
      "creates saved views",
      () => {
        const view =
          createDashboardSavedView(
            "Analytics view",
            "Focus on KPI intelligence.",
            resetDashboardPreferences(),
            new Date(
              "2026-08-02T12:00:00.000Z",
            ),
          );

        expect(
          view.name,
        ).toBe(
          "Analytics view",
        );

        expect(
          view.id,
        ).toBe(
          "dashboard-view-1785672000000",
        );
      },
    );

    it(
      "requires saved view names",
      () => {
        expect(() =>
          createDashboardSavedView(
            " ",
            "",
            resetDashboardPreferences(),
          ),
        ).toThrow(
          "Saved view name is required.",
        );
      },
    );
  },
);
