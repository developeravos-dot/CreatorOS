import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createTimeoutController,
  withTimeout,
} from "./timeout";

describe(
  "timeout resilience",
  () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it(
      "completes operations before timeout",
      async () => {
        const result =
          await withTimeout(
            async () =>
              "completed",
            100,
          );

        expect(result).toBe(
          "completed",
        );
      },
    );

    it(
      "aborts after timeout",
      async () => {
        vi.useFakeTimers();

        const timeout =
          createTimeoutController(
            100,
          );

        vi.advanceTimersByTime(
          100,
        );

        expect(
          timeout.signal.aborted,
        ).toBe(true);

        timeout.dispose();
      },
    );

    it(
      "inherits parent abort",
      () => {
        const parent =
          new AbortController();

        const timeout =
          createTimeoutController(
            5_000,
            parent.signal,
          );

        parent.abort();

        expect(
          timeout.signal.aborted,
        ).toBe(true);

        timeout.dispose();
      },
    );
  },
);
