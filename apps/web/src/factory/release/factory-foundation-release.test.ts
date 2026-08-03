import {
  describe,
  expect,
  it,
} from "vitest";

import {
  FACTORY_FOUNDATION_RELEASE,
} from ".";

describe(
  "factory foundation release",
  () => {
    it(
      "defines the stable F0 release",
      () => {
        expect(
          FACTORY_FOUNDATION_RELEASE,
        ).toEqual(
          expect.objectContaining({
            product:
              "CreatorOS Pack Factory",
            pack: "F0",
            version:
              "1.0.0",
            status:
              "stable",
          }),
        );
      },
    );

    it(
      "contains all F0 capabilities",
      () => {
        expect(
          FACTORY_FOUNDATION_RELEASE
            .capabilities,
        ).toHaveLength(8);

        expect(
          FACTORY_FOUNDATION_RELEASE
            .capabilities,
        ).toContain(
          "Foundation Integration",
        );
      },
    );

    it(
      "records all quality gates as passed",
      () => {
        expect(
          Object.values(
            FACTORY_FOUNDATION_RELEASE
              .qualityGates,
          ).every(
            (value) =>
              value === "passed",
          ),
        ).toBe(true);
      },
    );
  },
);
