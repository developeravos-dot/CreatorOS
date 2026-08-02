import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildAreaPath,
  buildChartPoints,
  buildLinePath,
} from "./chart-geometry";

describe(
  "chart geometry",
  () => {
    it(
      "builds chart points",
      () => {
        const points =
          buildChartPoints(
            [10, 20, 30],
            ["A", "B", "C"],
            300,
            120,
          );

        expect(
          points,
        ).toHaveLength(3);

        expect(
          points[0]?.label,
        ).toBe("A");
      },
    );

    it(
      "builds a line path",
      () => {
        const points =
          buildChartPoints(
            [10, 20],
            ["A", "B"],
            200,
            100,
          );

        expect(
          buildLinePath(points),
        ).toMatch(/^M /);
      },
    );

    it(
      "builds an area path",
      () => {
        const points =
          buildChartPoints(
            [10, 20],
            ["A", "B"],
            200,
            100,
          );

        expect(
          buildAreaPath(
            points,
            100,
          ),
        ).toContain("Z");
      },
    );
  },
);
