import {
  describe,
  expect,
  it,
} from "vitest";

import {
  readActiveDashboardViewId,
  readDashboardPreferences,
  readDashboardSavedViews,
  writeActiveDashboardViewId,
  writeDashboardPreferences,
  writeDashboardSavedViews,
} from "./dashboard-personalization-storage";

import {
  defaultDashboardPreferences,
  type DashboardSavedView,
} from "./dashboard-personalization-types";

describe(
  "dashboard personalization storage",
  () => {
    it(
      "reads default preferences",
      () => {
        expect(
          readDashboardPreferences(),
        ).toEqual(
          defaultDashboardPreferences,
        );
      },
    );

    it(
      "persists preferences",
      () => {
        writeDashboardPreferences({
          ...defaultDashboardPreferences,
          density: "compact",
        });

        expect(
          readDashboardPreferences()
            .density,
        ).toBe("compact");
      },
    );

    it(
      "persists saved views",
      () => {
        const views:
          DashboardSavedView[] = [
          {
            id: "view-1",
            name: "View one",
            description: "",
            createdAt:
              "2026-08-02T12:00:00.000Z",
            updatedAt:
              "2026-08-02T12:00:00.000Z",
            preferences:
              defaultDashboardPreferences,
          },
        ];

        writeDashboardSavedViews(
          views,
        );

        expect(
          readDashboardSavedViews(),
        ).toHaveLength(1);
      },
    );

    it(
      "persists active view",
      () => {
        writeActiveDashboardViewId(
          "view-1",
        );

        expect(
          readActiveDashboardViewId(),
        ).toBe("view-1");

        writeActiveDashboardViewId(
          null,
        );

        expect(
          readActiveDashboardViewId(),
        ).toBeNull();
      },
    );
  },
);
