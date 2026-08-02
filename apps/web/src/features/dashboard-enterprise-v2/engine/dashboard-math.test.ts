import {
  describe,
  expect,
  it,
} from "vitest";

import {
  average,
  clampPercentage,
  formatMetricValue,
  safeRatio,
} from "./dashboard-math";

describe(
  "dashboard math",
  () => {
    it(
      "clamps percentages",
      () => {
        expect(
          clampPercentage(
            140,
          ),
        ).toBe(100);

        expect(
          clampPercentage(
            -10,
          ),
        ).toBe(0);
      },
    );

    it(
      "calculates safe ratios",
      () => {
        expect(
          safeRatio(
            3,
            4,
          ),
        ).toBe(75);

        expect(
          safeRatio(
            3,
            0,
          ),
        ).toBe(0);
      },
    );

    it(
      "formats metric values",
      () => {
        expect(
          formatMetricValue(
            1250,
          ),
        ).toBe("1,250");
      },
    );

    it(
      "calculates averages",
      () => {
        expect(
          average([
            20,
            40,
            60,
          ]),
        ).toBe(40);
      },
    );
  },
);
