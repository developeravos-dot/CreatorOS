import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  runBulkAction,
} from "./projects-bulk-actions";

describe(
  "runBulkAction",
  () => {
    it(
      "collects succeeded and failed ids",
      async () => {
        const result =
          await runBulkAction(
            ["a", "b", "c"],
            async (id) =>
              id !== "b",
          );

        expect(
          result.succeeded,
        ).toEqual([
          "a",
          "c",
        ]);

        expect(
          result.failed,
        ).toEqual([
          "b",
        ]);
      },
    );

    it(
      "handles thrown errors",
      async () => {
        const executor =
          vi.fn(
            async (
              id: string,
            ) => {
              if (
                id === "b"
              ) {
                throw new Error(
                  "Failed",
                );
              }

              return true;
            },
          );

        const result =
          await runBulkAction(
            ["a", "b"],
            executor,
          );

        expect(
          result.succeeded,
        ).toEqual([
          "a",
        ]);

        expect(
          result.failed,
        ).toEqual([
          "b",
        ]);
      },
    );
  },
);
