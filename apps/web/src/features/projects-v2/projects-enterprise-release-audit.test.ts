import {
  describe,
  expect,
  it,
} from "vitest";

import {
  auditProjectsEnterpriseRelease,
  formatProjectsReleaseAudit,
  PROJECTS_RELEASE_CAPABILITIES,
} from "./projects-enterprise-release-audit";

const completeFiles =
  PROJECTS_RELEASE_CAPABILITIES.flatMap(
    (capability) =>
      capability.requiredFiles,
  );

describe(
  "projects enterprise release audit",
  () => {
    it(
      "passes a complete release",
      () => {
        const result =
          auditProjectsEnterpriseRelease({
            availableFiles:
              completeFiles,
            sourceFiles: [
              "ProjectsKanban.tsx",
              "ProjectDetailsPanel.tsx",
            ],
            testFiles: [
              "ProjectsKanban.test.tsx",
              "ProjectDetailsPanel.test.tsx",
            ],
          });

        expect(result.ready)
          .toBe(true);

        expect(
          result.missingFiles,
        ).toEqual([]);

        expect(
          result.capabilities.every(
            (capability) =>
              capability.ready,
          ),
        ).toBe(true);
      },
    );

    it(
      "detects missing capabilities",
      () => {
        const result =
          auditProjectsEnterpriseRelease({
            availableFiles: [
              "ProjectsKanban.tsx",
            ],
            sourceFiles: [],
            testFiles: [],
          });

        expect(result.ready)
          .toBe(false);

        expect(
          result.missingFiles.length,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "normalizes Windows paths",
      () => {
        const result =
          auditProjectsEnterpriseRelease({
            availableFiles:
              completeFiles.map(
                (file) =>
                  `C:\\CreatorOS\\${file}`,
              ),
            sourceFiles: [],
            testFiles: [],
          });

        expect(result.ready)
          .toBe(true);
      },
    );

    it(
      "calculates the test ratio",
      () => {
        const result =
          auditProjectsEnterpriseRelease({
            availableFiles:
              completeFiles,
            sourceFiles: [
              "one.ts",
              "two.ts",
              "three.ts",
              "four.ts",
            ],
            testFiles: [
              "one.test.ts",
              "two.test.ts",
            ],
          });

        expect(
          result.testCoverageRatio,
        ).toBe(0.5);
      },
    );

    it(
      "formats the audit report",
      () => {
        const result =
          auditProjectsEnterpriseRelease({
            availableFiles:
              completeFiles,
            sourceFiles: [
              "one.ts",
            ],
            testFiles: [
              "one.test.ts",
            ],
          });

        const report =
          formatProjectsReleaseAudit(
            result,
          );

        expect(report)
          .toContain(
            "Projects Enterprise Release: READY",
          );

        expect(report)
          .toContain(
            "[READY]Advanced Kanban",
          );
      },
    );
  },
);
