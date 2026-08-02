import {
  describe,
  expect,
  it,
} from "vitest";

import {
  averageSeries,
  calculateDelta,
  normalizeSeriesValues,
  sanitizeNumber,
} from "./dashboard-data-normalizer";

describe(
  "dashboard data normalizer",
  () => {
    it(
      "sanitizes invalid numbers",
      () => {
        expect(
          sanitizeNumber(
            Number.NaN,
          ),
        ).toBe(0);

        expect(
          sanitizeNumber(8),
        ).toBe(8);
      },
    );

    it(
      "normalizes series values",
      () => {
        expect(
          normalizeSeriesValues([
            10,
            20,
            40,
          ]),
        ).toEqual([
          25,
          50,
          100,
        ]);
      },
    );

    it(
      "calculates positive delta",
      () => {
        expect(
          calculateDelta(
            15,
            10,
          ),
        ).toEqual({
          absolute: 5,
          percentage: 50,
          direction: "up",
        });
      },
    );

    it(
      "calculates negative delta",
      () => {
        expect(
          calculateDelta(
            5,
            10,
          ),
        ).toEqual({
          absolute: -5,
          percentage: 50,
          direction: "down",
        });
      },
    );

    it(
      "calculates average values",
      () => {
        expect(
          averageSeries([
            10,
            20,
            30,
          ]),
        ).toBe(20);
      },
    );
  },
);
