import {
  describe,
  expect,
  it,
} from "vitest";

import {
  clearPerformanceMeasurements,
  getPerformanceMeasurements,
  measureAsync,
} from "./performance";

describe(
  "performance measurements",
  () => {
    it(
      "records async duration",
      async () => {
        clearPerformanceMeasurements();

        const result =
          await measureAsync(
            "test",
            "operation",
            async () =>
              "completed",
          );

        expect(result).toBe(
          "completed",
        );

        expect(
          getPerformanceMeasurements(),
        ).toHaveLength(1);

        expect(
          getPerformanceMeasurements()[0],
        ).toMatchObject({
          scope: "test",
          name: "operation",
        });
      },
    );
  },
);
