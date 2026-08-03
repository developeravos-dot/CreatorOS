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
      "defines the stable Projects Workspace 2.1 release",
      () => {
        expect(
          PROJECTS_ENTERPRISE_RELEASE.product,
        ).toBe(
          "CreatorOS Projects Workspace",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.version,
        ).toBe("2.1.0");

        expect(
          PROJECTS_ENTERPRISE_RELEASE.status,
        ).toBe("stable");
      },
    );

    it(
      "contains production integration capabilities",
      () => {
        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Remote persistence adapter",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Offline synchronization queue",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Conflict resolution engine",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Project permissions and ACL",
        );

        expect(
          PROJECTS_ENTERPRISE_RELEASE.capabilities,
        ).toContain(
          "Production runtime",
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
