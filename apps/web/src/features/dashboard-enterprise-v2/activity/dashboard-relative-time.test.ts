import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ensureIsoTimestamp,
  formatRelativeTime,
} from "./dashboard-relative-time";

describe(
  "dashboard relative time",
  () => {
    const now =
      new Date(
        "2026-08-02T12:00:00.000Z",
      );

    it(
      "formats recent timestamps",
      () => {
        expect(
          formatRelativeTime(
            "2026-08-02T11:59:45.000Z",
            now,
          ),
        ).toBe("Just now");
      },
    );

    it(
      "formats minutes",
      () => {
        expect(
          formatRelativeTime(
            "2026-08-02T11:45:00.000Z",
            now,
          ),
        ).toBe("15m ago");
      },
    );

    it(
      "formats hours",
      () => {
        expect(
          formatRelativeTime(
            "2026-08-02T09:00:00.000Z",
            now,
          ),
        ).toBe("3h ago");
      },
    );

    it(
      "normalizes invalid timestamps",
      () => {
        expect(
          ensureIsoTimestamp(
            "invalid",
            now,
          ),
        ).toBe(
          now.toISOString(),
        );
      },
    );
  },
);
