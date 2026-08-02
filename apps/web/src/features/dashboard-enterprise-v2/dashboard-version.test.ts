import {
  describe,
  expect,
  it,
} from "vitest";

import {
  readDashboardVersion,
  writeDashboardVersion,
} from "./dashboard-version";

describe(
  "dashboard version preference",
  () => {
    it(
      "defaults to enterprise v2",
      () => {
        expect(
          readDashboardVersion(),
        ).toBe(
          "enterprise-v2",
        );
      },
    );

    it(
      "persists legacy preference",
      () => {
        writeDashboardVersion(
          "legacy",
        );

        expect(
          readDashboardVersion(),
        ).toBe("legacy");
      },
    );

    it(
      "ignores invalid preferences",
      () => {
        localStorage.setItem(
          "creatoros.dashboard.version",
          "invalid",
        );

        expect(
          readDashboardVersion(),
        ).toBe(
          "enterprise-v2",
        );
      },
    );
  },
);
