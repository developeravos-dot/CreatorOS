import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  retry,
} from "./retry";

describe(
  "retry",
  () => {
    it(
      "retries temporary failures",
      async () => {
        const operation = vi
          .fn()
          .mockRejectedValueOnce(
            new Error("temporary"),
          )
          .mockResolvedValue(
            "success",
          );

        const result =
          await retry(
            operation,
            {
              retries: 2,
              delayMs: 0,
            },
          );

        expect(result).toBe(
          "success",
        );

        expect(
          operation,
        ).toHaveBeenCalledTimes(
          2,
        );
      },
    );

    it(
      "stops after retry limit",
      async () => {
        const operation = vi
          .fn()
          .mockRejectedValue(
            new Error("failed"),
          );

        await expect(
          retry(
            operation,
            {
              retries: 2,
              delayMs: 0,
            },
          ),
        ).rejects.toThrow(
          "failed",
        );

        expect(
          operation,
        ).toHaveBeenCalledTimes(
          3,
        );
      },
    );

    it(
      "respects shouldRetry",
      async () => {
        const operation = vi
          .fn()
          .mockRejectedValue(
            new Error("fatal"),
          );

        await expect(
          retry(
            operation,
            {
              retries: 5,
              delayMs: 0,
              shouldRetry:
                () => false,
            },
          ),
        ).rejects.toThrow(
          "fatal",
        );

        expect(
          operation,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "stops when aborted",
      async () => {
        const controller =
          new AbortController();

        controller.abort();

        await expect(
          retry(
            async () =>
              "never",
            {
              signal:
                controller.signal,
            },
          ),
        ).rejects.toMatchObject({
          name: "AbortError",
        });
      },
    );
  },
);
