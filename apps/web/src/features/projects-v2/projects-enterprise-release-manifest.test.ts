import {
  describe,
  expect,
  it,
} from "vitest";

import {
  PROJECTS_ENTERPRISE_RELEASE,
} from "./projects-enterprise-release-manifest";

describe(
  "projects enterprise release manifest",
  () => {
    it(
      "defines the stable Projects Workspace release",
      () => {
        expect(
          PROJECTS_ENTERPRISE_RELEASE.product,
        ).toBe(
          "CreatorOS Projects Workspace",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.version,
        ).toBe("2.0.0");

        expect(
          PROJECTS_ENTERPRISE_RELEASE.status,
        ).toBe("stable");
      },
    );

    it(
      "contains the major enterprise capabilities",
      () => {
        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Advanced Kanban",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Project files and assets",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "AI project assistant",
        );
      },
    );

    it(
      "records all release quality gates as passed",
      () => {
        expect(
          Object.values(
            PROJECTS_ENTERPRISE_RELEASE.qualityGates,
          ).every(
            (value) =>
              value === "passed",
          ),
        ).toBe(true);
      },
    );
  },
);
