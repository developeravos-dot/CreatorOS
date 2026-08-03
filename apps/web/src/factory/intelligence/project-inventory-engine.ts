import {
  FactoryError,
} from "../domain";

import type {
  ProjectFileRole,
  ProjectInventory,
  ProjectInventoryNode,
  ProjectInventoryNodeId,
  ProjectInventoryQuery,
  ProjectInventorySummary,
  ProjectInventoryValidationIssue,
  ProjectInventoryValidationResult,
  ProjectSnapshot,
  ProjectSnapshotFile,
  ProjectSourceLanguage,
} from "./project-intelligence-types";

function normalizePath(
  value: string,
): string {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\.\//, "")
    .replace(/\/$/, "");
}

function normalizeTimestamp(
  value:
    string | undefined,
): string {
  if (!value) {
    return new Date()
      .toISOString();
  }

  const parsed =
    Date.parse(value);

  return Number.isFinite(parsed)
    ? new Date(parsed)
        .toISOString()
    : value;
}

function getPathName(
  path: string,
): string {
  const parts =
    path.split("/");

  return (
    parts.at(-1) ??
    path
  );
}

function getParentPath(
  path: string,
): string | null {
  const index =
    path.lastIndexOf("/");

  return index < 0
    ? null
    : path.slice(0, index);
}

function getDepth(
  path: string,
): number {
  return path
    ? path.split("/")
        .length - 1
    : 0;
}

function getExtension(
  path: string,
): string | null {
  const name =
    getPathName(path);

  const index =
    name.lastIndexOf(".");

  if (
    index <= 0 ||
    index ===
      name.length - 1
  ) {
    return null;
  }

  return name
    .slice(index + 1)
    .toLowerCase();
}

function detectLanguage(
  extension:
    string | null,
): ProjectSourceLanguage {
  switch (extension) {
    case "ts":
      return "typescript";

    case "tsx":
      return "tsx";

    case "js":
    case "mjs":
    case "cjs":
      return "javascript";

    case "jsx":
      return "jsx";

    case "json":
      return "json";

    case "css":
      return "css";

    case "scss":
    case "sass":
      return "scss";

    case "html":
    case "htm":
      return "html";

    case "md":
    case "mdx":
      return "markdown";

    case "yaml":
    case "yml":
      return "yaml";

    case "sh":
      return "shell";

    case "ps1":
      return "powershell";

    default:
      return "unknown";
  }
}

function detectRole(
  path: string,
  language:
    ProjectSourceLanguage,
  generated: boolean,
): ProjectFileRole {
  const normalized =
    path.toLowerCase();

  if (generated) {
    return "generated";
  }

  if (
    normalized.includes(
      "/dist/",
    ) ||
    normalized.startsWith(
      "dist/",
    ) ||
    normalized.includes(
      "/build/",
    ) ||
    normalized.startsWith(
      "build/",
    )
  ) {
    return "generated";
  }

  if (
    /\.(test|spec)\.[^.]+$/i
      .test(path) ||
    normalized.includes(
      "/__tests__/",
    )
  ) {
    return "test";
  }

  if (
    language === "css" ||
    language === "scss"
  ) {
    return "style";
  }

  if (
    normalized.endsWith(
      "package.json",
    ) ||
    normalized.endsWith(
      "tsconfig.json",
    ) ||
    normalized.endsWith(
      "vite.config.ts",
    ) ||
    normalized.endsWith(
      "vitest.config.ts",
    ) ||
    normalized.endsWith(
      ".eslintrc"
    ) ||
    language === "yaml"
  ) {
    return "configuration";
  }

  if (
    normalized.includes(
      "manifest",
    )
  ) {
    return "manifest";
  }

  if (
    language ===
      "markdown"
  ) {
    return "documentation";
  }

  if (
    normalized.includes(
      "/assets/",
    ) ||
    normalized.startsWith(
      "assets/",
    ) ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i
      .test(path)
  ) {
    return "asset";
  }

  if (
    language ===
      "typescript" ||
    language === "tsx" ||
    language ===
      "javascript" ||
    language === "jsx"
  ) {
    return "source";
  }

  return "unknown";
}

export function createProjectInventoryNodeId(
  path: string,
): ProjectInventoryNodeId {
  const normalized =
    normalizePath(path);

  if (!normalized) {
    throw new FactoryError(
      "Project inventory node path is required.",
      {
        code:
          "INVALID_PACK",
      },
    );
  }

  return normalized as
    ProjectInventoryNodeId;
}

function createDirectoryNode(
  path: string,
): ProjectInventoryNode {
  return {
    id:
      createProjectInventoryNodeId(
        path,
      ),
    type:
      "directory",
    name:
      getPathName(path),
    path,
    parentPath:
      getParentPath(path),
    depth:
      getDepth(path),
    extension: null,
    language:
      "unknown",
    role:
      "unknown",
    sizeBytes: 0,
    modifiedAt: null,
    generated: false,
    hasContent: false,
  };
}

function createFileNode(
  file:
    ProjectSnapshotFile,
): ProjectInventoryNode {
  const path =
    normalizePath(
      file.path,
    );

  const extension =
    getExtension(path);

  const language =
    detectLanguage(
      extension,
    );

  const generated =
    file.generated ??
    false;

  const sizeBytes =
    file.sizeBytes ??
    (
      file.content
        ? new TextEncoder()
            .encode(
              file.content,
            )
            .length
        : 0
    );

  return {
    id:
      createProjectInventoryNodeId(
        path,
      ),
    type: "file",
    name:
      getPathName(path),
    path,
    parentPath:
      getParentPath(path),
    depth:
      getDepth(path),
    extension,
    language,
    role:
      detectRole(
        path,
        language,
        generated,
      ),
    sizeBytes,
    modifiedAt:
      file.modifiedAt
        ? normalizeTimestamp(
            file.modifiedAt,
          )
        : null,
    generated,
    hasContent:
      typeof file.content ===
        "string",
  };
}

function collectDirectoryPaths(
  files:
    readonly ProjectSnapshotFile[],
): readonly string[] {
  const directories =
    new Set<string>();

  for (
    const file of files
  ) {
    let current =
      getParentPath(
        normalizePath(
          file.path,
        ),
      );

    while (current) {
      directories.add(
        current,
      );

      current =
        getParentPath(
          current,
        );
    }
  }

  return [
    ...directories,
  ].sort(
    (left, right) =>
      getDepth(left) -
        getDepth(right) ||
      left.localeCompare(
        right,
      ),
  );
}

export function buildProjectInventory(
  snapshot:
    ProjectSnapshot,
): ProjectInventory {
  const repositoryRoot =
    normalizePath(
      snapshot.repositoryRoot,
    );

  if (!repositoryRoot) {
    throw new FactoryError(
      "Project repository root is required.",
      {
        code:
          "INVALID_PACK",
      },
    );
  }

  const files =
    snapshot.files.map(
      (file) => ({
        ...file,
        path:
          normalizePath(
            file.path,
          ),
      }),
    );

  const directoryNodes =
    collectDirectoryPaths(
      files,
    ).map(
      createDirectoryNode,
    );

  const fileNodes =
    files.map(
      createFileNode,
    );

  return {
    schema:
      "creatoros.factory.project-inventory",
    version:
      "1.0.0",
    repositoryRoot,
    nodes: [
      ...directoryNodes,
      ...fileNodes,
    ].sort(
      (left, right) =>
        left.path.localeCompare(
          right.path,
        ),
    ),
    capturedAt:
      normalizeTimestamp(
        snapshot.capturedAt,
      ),
    metadata:
      snapshot.metadata ??
      {},
  };
}

export function findProjectInventoryNode(
  inventory:
    ProjectInventory,
  path: string,
): ProjectInventoryNode | null {
  const normalized =
    normalizePath(path);

  return (
    inventory.nodes.find(
      (node) =>
        node.path ===
        normalized,
    ) ??
    null
  );
}

export function queryProjectInventory(
  inventory:
    ProjectInventory,
  query:
    ProjectInventoryQuery,
): readonly ProjectInventoryNode[] {
  const search =
    query.search
      ?.trim()
      .toLowerCase() ??
    "";

  const pathPrefix =
    query.pathPrefix
      ? normalizePath(
          query.pathPrefix,
        )
      : "";

  return inventory.nodes.filter(
    (node) => {
      if (
        query.type &&
        node.type !==
          query.type
      ) {
        return false;
      }

      if (
        query.language &&
        node.language !==
          query.language
      ) {
        return false;
      }

      if (
        query.role &&
        node.role !==
          query.role
      ) {
        return false;
      }

      if (
        query.generated !==
          undefined &&
        node.generated !==
          query.generated
      ) {
        return false;
      }

      if (
        pathPrefix &&
        node.path !==
          pathPrefix &&
        !node.path.startsWith(
          `${pathPrefix}/`,
        )
      ) {
        return false;
      }

      if (
        search &&
        ![
          node.name,
          node.path,
          node.extension ?? "",
          node.language,
          node.role,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }

      return true;
    },
  );
}

export function summarizeProjectInventory(
  inventory:
    ProjectInventory,
): ProjectInventorySummary {
  const files =
    inventory.nodes.filter(
      (node) =>
        node.type === "file",
    );

  const directories =
    inventory.nodes.filter(
      (node) =>
        node.type ===
        "directory",
    );

  const languages:
    Partial<
      Record<
        ProjectSourceLanguage,
        number
      >
    > = {};

  for (
    const file of files
  ) {
    languages[
      file.language
    ] =
      (
        languages[
          file.language
        ] ??
        0
      ) + 1;
  }

  return {
    nodes:
      inventory.nodes.length,
    files:
      files.length,
    directories:
      directories.length,
    sourceFiles:
      files.filter(
        (file) =>
          file.role ===
          "source",
      ).length,
    testFiles:
      files.filter(
        (file) =>
          file.role ===
          "test",
      ).length,
    configurationFiles:
      files.filter(
        (file) =>
          file.role ===
          "configuration",
      ).length,
    generatedFiles:
      files.filter(
        (file) =>
          file.role ===
          "generated",
      ).length,
    totalBytes:
      files.reduce(
        (
          total,
          file,
        ) =>
          total +
          file.sizeBytes,
        0,
      ),
    maximumDepth:
      inventory.nodes.reduce(
        (
          maximum,
          node,
        ) =>
          Math.max(
            maximum,
            node.depth,
          ),
        0,
      ),
    languages,
  };
}

export function validateProjectInventory(
  inventory:
    ProjectInventory,
): ProjectInventoryValidationResult {
  const issues:
    ProjectInventoryValidationIssue[] = [];

  if (
    !inventory.repositoryRoot
      .trim()
  ) {
    issues.push({
      code:
        "EMPTY_REPOSITORY_ROOT",
      path:
        "repositoryRoot",
      message:
        "Project repository root is empty.",
    });
  }

  const paths =
    new Set<string>();

  for (
    const node of
    inventory.nodes
  ) {
    if (
      !node.path.trim() ||
      node.path.startsWith("/") ||
      node.path.includes("\\")
    ) {
      issues.push({
        code:
          "INVALID_PATH",
        path:
          `nodes.${node.id}.path`,
        message:
          `Project inventory path is invalid: ${node.path}.`,
      });
    }

    if (
      paths.has(
        node.path,
      )
    ) {
      issues.push({
        code:
          "DUPLICATE_PATH",
        path:
          `nodes.${node.id}.path`,
        message:
          `Duplicate project inventory path: ${node.path}.`,
      });
    }

    paths.add(
      node.path,
    );

    if (
      node.sizeBytes < 0
    ) {
      issues.push({
        code:
          "NEGATIVE_SIZE",
        path:
          `nodes.${node.id}.sizeBytes`,
        message:
          "Project inventory file size cannot be negative.",
      });
    }

    if (
      node.parentPath &&
      !inventory.nodes.some(
        (candidate) =>
          candidate.type ===
            "directory" &&
          candidate.path ===
            node.parentPath,
      )
    ) {
      issues.push({
        code:
          "PARENT_NOT_FOUND",
        path:
          `nodes.${node.id}.parentPath`,
        message:
          `Project inventory parent directory was not found: ${node.parentPath}.`,
      });
    }
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}
