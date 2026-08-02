import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  clearDashboardRenderMeasurements,
  getDashboardRenderMeasurements,
  recordDashboardRender,
  subscribeDashboardPerformance,
} from "./dashboard-performance-store";

describe(
  "dashboard performance store",
  () => {
    it(
      "records dashboard render measurements",
      () => {
        clearDashboardRenderMeasurements();

        recordDashboardRender(
          "dashboard",
          42,
          new Date(
            "2026-08-02T12:00:00.000Z",
          ),
        );

        expect(
          getDashboardRenderMeasurements(),
        ).toEqual([
          {
            id: "dashboard",
            durationMs: 42,
            timestamp:
              "2026-08-02T12:00:00.000Z",
          },
        ]);
      },
    );

    it(
      "sanitizes invalid durations",
      () => {
        clearDashboardRenderMeasurements();

        recordDashboardRender(
          "dashboard",
          Number.NaN,
        );

        expect(
          getDashboardRenderMeasurements()[0]
            ?.durationMs,
        ).toBe(0);
      },
    );

    it(
      "notifies subscribers",
      () => {
        clearDashboardRenderMeasurements();

        const listener =
          vi.fn();

        const unsubscribe =
          subscribeDashboardPerformance(
            listener,
          );

        recordDashboardRender(
          "dashboard",
          12,
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );

        unsubscribe();

        recordDashboardRender(
          "dashboard",
          14,
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);
