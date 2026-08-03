export interface ProjectsReleaseCapability {
  readonly id: string;
  readonly label: string;
  readonly requiredFiles:
    readonly string[];
}

export interface ProjectsReleaseAuditInput {
  readonly availableFiles:
    readonly string[];
  readonly testFiles:
    readonly string[];
  readonly sourceFiles:
    readonly string[];
}

export interface ProjectsReleaseCapabilityResult {
  readonly id: string;
  readonly label: string;
  readonly ready: boolean;
  readonly missingFiles:
    readonly string[];
}

export interface ProjectsReleaseAuditResult {
  readonly ready: boolean;
  readonly capabilities:
    readonly ProjectsReleaseCapabilityResult[];
  readonly missingFiles:
    readonly string[];
  readonly sourceFileCount: number;
  readonly testFileCount: number;
  readonly testCoverageRatio: number;
}

export const PROJECTS_RELEASE_CAPABILITIES:
  readonly ProjectsReleaseCapability[] = [
    {
      id: "workspace",
      label:
        "Projects Workspace",
      requiredFiles: [
        "ProjectsTable.tsx",
        "ProjectsPagination.tsx",
        "projects-workspace-context.tsx",
        "projects-workspace-engine.ts",
        "projects-workspace-storage.ts",
      ],
    },
    {
      id: "kanban",
      label:
        "Advanced Kanban",
      requiredFiles: [
        "ProjectsKanban.tsx",
        "kanban-engine.ts",
        "kanban-state-engine.ts",
        "ProjectsKanbanAdvanced.test.tsx",
      ],
    },
    {
      id: "details",
      label:
        "Project Details",
      requiredFiles: [
        "ProjectDetailsPanel.tsx",
        "ProjectDetailsPanelBase.tsx",
        "ProjectDetailsPanel.test.tsx",
      ],
    },
    {
      id: "activity",
      label:
        "Timeline and Activity",
      requiredFiles: [
        "ProjectActivityTimeline.tsx",
        "project-activity-engine.ts",
        "ProjectActivityTimeline.test.tsx",
        "project-activity-engine.test.ts",
      ],
    },
    {
      id: "assets",
      label:
        "Files and Assets",
      requiredFiles: [
        "ProjectAssetsWorkspace.tsx",
        "project-assets-engine.ts",
        "project-assets-storage.ts",
        "ProjectAssetsWorkspace.test.tsx",
      ],
    },
    {
      id: "assistant",
      label:
        "AI Project Assistant",
      requiredFiles: [
        "ProjectAIAssistantWorkspace.tsx",
        "project-ai-assistant-engine.ts",
        "project-ai-assistant-storage.ts",
        "ProjectAIAssistantWorkspace.test.tsx",
      ],
    },
  ];

function normalizePath(
  value: string,
): string {
  return value
    .replace(
      /\\/g,
      "/",
    )
    .trim()
    .toLocaleLowerCase();
}

function getFileName(
  value: string,
): string {
  const normalized =
    normalizePath(value);

  return (
    normalized
      .split("/")
      .at(-1) ??
    normalized
  );
}

export function auditProjectsEnterpriseRelease(
  input:
    ProjectsReleaseAuditInput,
): ProjectsReleaseAuditResult {
  const availableNames =
    new Set(
      input.availableFiles.map(
        getFileName,
      ),
    );

  const capabilities =
    PROJECTS_RELEASE_CAPABILITIES.map(
      (capability) => {
        const missingFiles =
          capability.requiredFiles.filter(
            (file) =>
              !availableNames.has(
                file.toLocaleLowerCase(),
              ),
          );

        return {
          id:
            capability.id,
          label:
            capability.label,
          ready:
            missingFiles.length ===
            0,
          missingFiles,
        };
      },
    );

  const missingFiles = [
    ...new Set(
      capabilities.flatMap(
        (capability) =>
          capability.missingFiles,
      ),
    ),
  ];

  const sourceFileCount =
    input.sourceFiles.length;

  const testFileCount =
    input.testFiles.length;

  const testCoverageRatio =
    sourceFileCount === 0
      ? 0
      : Number(
          (
            testFileCount /
            sourceFileCount
          ).toFixed(2),
        );

  return {
    ready:
      missingFiles.length ===
      0,
    capabilities,
    missingFiles,
    sourceFileCount,
    testFileCount,
    testCoverageRatio,
  };
}

export function formatProjectsReleaseAudit(
  result:
    ProjectsReleaseAuditResult,
): string {
  const capabilityLines =
    result.capabilities.map(
      (capability) =>
        [
          capability.ready
            ? "[READY]"
            : "[MISSING]",
          capability.label,
          capability.missingFiles
            .length > 0
            ? `: ${capability.missingFiles.join(", ")}`
            : "",
        ].join(""),
    );

  return [
    `Projects Enterprise Release: ${
      result.ready
        ? "READY"
        : "NOT READY"
    }`,
    `Source files: ${result.sourceFileCount}`,
    `Test files: ${result.testFileCount}`,
    `Test coverage ratio: ${result.testCoverageRatio}`,
    ...capabilityLines,
  ].join("\n");
}
