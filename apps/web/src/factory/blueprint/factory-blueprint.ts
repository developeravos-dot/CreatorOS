import {
  FactoryError,
} from "../domain";

import type {
  CreateFactoryBlueprintDependencyInput,
  CreateFactoryBlueprintInput,
  CreateFactoryBlueprintNodeInput,
  FactoryBlueprint,
  FactoryBlueprintDependency,
  FactoryBlueprintId,
  FactoryBlueprintNode,
  FactoryBlueprintNodeId,
  FactoryBlueprintStatus,
  FactoryBlueprintSummary,
  FactoryBlueprintValidationIssue,
  FactoryBlueprintValidationResult,
} from "./factory-blueprint-types";

function normalizeText(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new FactoryError(
      `${fieldName} is required.`,
      {
        code:
          "INVALID_PACK",
        details: {
          fieldName,
        },
      },
    );
  }

  return normalized;
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

function normalizePath(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /\\/g,
      "/",
    )
    .replace(
      /\/+/g,
      "/",
    )
    .replace(
      /\/$/g,
      "",
    );
}

export function createFactoryBlueprintId(
  value: string,
): FactoryBlueprintId {
  return normalizeText(
    value,
    "Blueprint id",
  ) as FactoryBlueprintId;
}

export function createFactoryBlueprintNodeId(
  value: string,
): FactoryBlueprintNodeId {
  return normalizeText(
    value,
    "Blueprint node id",
  ) as FactoryBlueprintNodeId;
}

export function createFactoryBlueprint(
  input:
    CreateFactoryBlueprintInput,
): FactoryBlueprint {
  const timestamp =
    normalizeTimestamp(
      input.createdAt,
    );

  const blueprintId =
    createFactoryBlueprintId(
      input.id,
    );

  const rootNodeId =
    createFactoryBlueprintNodeId(
      `${input.id}:root`,
    );

  const rootNode:
    FactoryBlueprintNode = {
    id:
      rootNodeId,
    blueprintId,
    type: "root",
    name:
      normalizeText(
        input.rootName ??
          "Root",
        "Blueprint root name",
      ),
    description:
      "Blueprint root node.",
    order: 0,
    parentId: null,
    children: [],
    file: null,
    metadata: {},
  };

  return {
    id:
      blueprintId,
    packId:
      input.packId,
    name:
      normalizeText(
        input.name,
        "Blueprint name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    status: "draft",
    version: 1,
    rootNodeId,
    nodes: [
      rootNode,
    ],
    dependencies: [],
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
    metadata:
      input.metadata ??
      {},
  };
}

export function findFactoryBlueprintNode(
  blueprint:
    FactoryBlueprint,
  nodeId:
    FactoryBlueprintNodeId,
): FactoryBlueprintNode | null {
  return (
    blueprint.nodes.find(
      (node) =>
        node.id ===
        nodeId,
    ) ??
    null
  );
}

export function addFactoryBlueprintNode(
  blueprint:
    FactoryBlueprint,
  input:
    CreateFactoryBlueprintNodeInput,
  updatedAt?:
    string,
): FactoryBlueprint {
  const id =
    createFactoryBlueprintNodeId(
      input.id,
    );

  if (
    findFactoryBlueprintNode(
      blueprint,
      id,
    )
  ) {
    throw new FactoryError(
      `Factory blueprint node already exists: ${id}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          blueprintId:
            blueprint.id,
          nodeId:
            id,
        },
      },
    );
  }

  const parentId =
    input.parentId ??
    blueprint.rootNodeId;

  const parent =
    findFactoryBlueprintNode(
      blueprint,
      parentId,
    );

  if (!parent) {
    throw new FactoryError(
      `Factory blueprint parent node was not found: ${parentId}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          blueprintId:
            blueprint.id,
          parentId,
        },
      },
    );
  }

  if (
    !Number.isInteger(
      input.order,
    ) ||
    input.order < 0
  ) {
    throw new FactoryError(
      "Blueprint node order must be a non-negative integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          nodeId:
            id,
          order:
            input.order,
        },
      },
    );
  }

  if (
    input.type === "file" &&
    !input.file
  ) {
    throw new FactoryError(
      "File blueprint nodes require a file specification.",
      {
        code:
          "INVALID_PACK",
        details: {
          nodeId:
            id,
        },
      },
    );
  }

  if (
    input.type !== "file" &&
    input.file
  ) {
    throw new FactoryError(
      "Only file blueprint nodes can include a file specification.",
      {
        code:
          "INVALID_PACK",
        details: {
          nodeId:
            id,
          nodeType:
            input.type,
        },
      },
    );
  }

  const node:
    FactoryBlueprintNode = {
    id,
    blueprintId:
      blueprint.id,
    type:
      input.type,
    name:
      normalizeText(
        input.name,
        "Blueprint node name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    order:
      input.order,
    parentId,
    children: [],
    file:
      input.file
        ? {
            ...input.file,
            location: {
              ...input.file.location,
              path:
                normalizePath(
                  input.file.location.path,
                ),
              parentPath:
                input.file
                  .location
                  .parentPath
                  ? normalizePath(
                      input.file
                        .location
                        .parentPath,
                    )
                  : null,
            },
            expectedExports: [
              ...new Set(
                input.file
                  .expectedExports
                  .map(
                    (value) =>
                      value.trim(),
                  )
                  .filter(Boolean),
              ),
            ],
          }
        : null,
    metadata:
      input.metadata ??
      {},
  };

  const updatedParent:
    FactoryBlueprintNode = {
    ...parent,
    children: [
      ...parent.children,
      id,
    ],
  };

  return {
    ...blueprint,
    nodes: [
      ...blueprint.nodes.map(
        (current) =>
          current.id ===
          parentId
            ? updatedParent
            : current,
      ),
      node,
    ].sort(
      (left, right) =>
        left.order -
        right.order,
    ),
    version:
      blueprint.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function addFactoryBlueprintDependency(
  blueprint:
    FactoryBlueprint,
  input:
    CreateFactoryBlueprintDependencyInput,
  updatedAt?:
    string,
): FactoryBlueprint {
  const id =
    normalizeText(
      input.id,
      "Blueprint dependency id",
    );

  if (
    blueprint.dependencies.some(
      (dependency) =>
        dependency.id === id,
    )
  ) {
    throw new FactoryError(
      `Factory blueprint dependency already exists: ${id}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          blueprintId:
            blueprint.id,
          dependencyId:
            id,
        },
      },
    );
  }

  if (
    !findFactoryBlueprintNode(
      blueprint,
      input.sourceNodeId,
    )
  ) {
    throw new FactoryError(
      `Blueprint dependency source was not found: ${input.sourceNodeId}.`,
      {
        code:
          "INVALID_PACK",
      },
    );
  }

  if (
    !findFactoryBlueprintNode(
      blueprint,
      input.targetNodeId,
    )
  ) {
    throw new FactoryError(
      `Blueprint dependency target was not found: ${input.targetNodeId}.`,
      {
        code:
          "INVALID_PACK",
      },
    );
  }

  const dependency:
    FactoryBlueprintDependency = {
    id,
    sourceNodeId:
      input.sourceNodeId,
    targetNodeId:
      input.targetNodeId,
    type:
      input.type,
    required:
      input.required ??
      true,
    description:
      input.description
        ?.trim() ??
      "",
  };

  return {
    ...blueprint,
    dependencies: [
      ...blueprint.dependencies,
      dependency,
    ],
    version:
      blueprint.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function transitionFactoryBlueprint(
  blueprint:
    FactoryBlueprint,
  status:
    FactoryBlueprintStatus,
  updatedAt?:
    string,
): FactoryBlueprint {
  if (
    blueprint.status ===
    status
  ) {
    return blueprint;
  }

  const allowed:
    Readonly<
      Record<
        FactoryBlueprintStatus,
        readonly FactoryBlueprintStatus[]
      >
    > = {
    draft: [
      "validated",
      "failed",
    ],

    validated: [
      "planned",
      "failed",
    ],

    planned: [
      "applied",
      "failed",
    ],

    applied: [],

    failed: [
      "draft",
    ],
  };

  if (
    !allowed[
      blueprint.status
    ].includes(status)
  ) {
    throw new FactoryError(
      `Cannot transition Factory blueprint from ${blueprint.status} to ${status}.`,
      {
        code:
          "INVALID_STATUS_TRANSITION",
        details: {
          blueprintId:
            blueprint.id,
          currentStatus:
            blueprint.status,
          targetStatus:
            status,
        },
      },
    );
  }

  return {
    ...blueprint,
    status,
    version:
      blueprint.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

function hasParentCycle(
  blueprint:
    FactoryBlueprint,
  node:
    FactoryBlueprintNode,
): boolean {
  const visited =
    new Set<
      FactoryBlueprintNodeId
    >();

  let current:
    FactoryBlueprintNode | null =
    node;

  while (
    current &&
    current.parentId
  ) {
    if (
      visited.has(
        current.id,
      )
    ) {
      return true;
    }

    visited.add(
      current.id,
    );

    current =
      findFactoryBlueprintNode(
        blueprint,
        current.parentId,
      );
  }

  return false;
}

export function validateFactoryBlueprint(
  blueprint:
    FactoryBlueprint,
): FactoryBlueprintValidationResult {
  const issues:
    FactoryBlueprintValidationIssue[] = [];

  const nodeIds =
    new Set<
      FactoryBlueprintNodeId
    >();

  const paths =
    new Set<string>();

  const root =
    findFactoryBlueprintNode(
      blueprint,
      blueprint.rootNodeId,
    );

  if (
    !root ||
    root.type !== "root"
  ) {
    issues.push({
      code:
        "ROOT_NOT_FOUND",
      path:
        "rootNodeId",
      message:
        "Factory blueprint root node was not found.",
    });
  }

  for (
    const node of
    blueprint.nodes
  ) {
    if (
      nodeIds.has(
        node.id,
      )
    ) {
      issues.push({
        code:
          "DUPLICATE_NODE",
        path:
          `nodes.${node.id}`,
        message:
          `Duplicate blueprint node: ${node.id}.`,
      });
    }

    nodeIds.add(
      node.id,
    );

    if (
      node.parentId &&
      !findFactoryBlueprintNode(
        blueprint,
        node.parentId,
      )
    ) {
      issues.push({
        code:
          "PARENT_NOT_FOUND",
        path:
          `nodes.${node.id}.parentId`,
        message:
          `Parent node was not found: ${node.parentId}.`,
      });
    }

    for (
      const childId of
      node.children
    ) {
      if (
        !findFactoryBlueprintNode(
          blueprint,
          childId,
        )
      ) {
        issues.push({
          code:
            "CHILD_NOT_FOUND",
          path:
            `nodes.${node.id}.children`,
          message:
            `Child node was not found: ${childId}.`,
        });
      }
    }

    if (
      hasParentCycle(
        blueprint,
        node,
      )
    ) {
      issues.push({
        code:
          "CIRCULAR_PARENT",
        path:
          `nodes.${node.id}.parentId`,
        message:
          "Circular blueprint parent relationship detected.",
      });
    }

    if (
      node.type === "file" &&
      !node.file
    ) {
      issues.push({
        code:
          "INVALID_FILE_NODE",
        path:
          `nodes.${node.id}.file`,
        message:
          "File blueprint node is missing its file specification.",
      });
    }

    if (
      node.file
    ) {
      const path =
        normalizePath(
          node.file.location.path,
        );

      if (
        paths.has(path)
      ) {
        issues.push({
          code:
            "DUPLICATE_PATH",
          path:
            `nodes.${node.id}.file.location.path`,
          message:
            `Duplicate blueprint output path: ${path}.`,
        });
      }

      paths.add(path);
    }
  }

  for (
    const dependency of
    blueprint.dependencies
  ) {
    if (
      !findFactoryBlueprintNode(
        blueprint,
        dependency.sourceNodeId,
      )
    ) {
      issues.push({
        code:
          "DEPENDENCY_SOURCE_NOT_FOUND",
        path:
          `dependencies.${dependency.id}.sourceNodeId`,
        message:
          `Dependency source node was not found: ${dependency.sourceNodeId}.`,
      });
    }

    if (
      !findFactoryBlueprintNode(
        blueprint,
        dependency.targetNodeId,
      )
    ) {
      issues.push({
        code:
          "DEPENDENCY_TARGET_NOT_FOUND",
        path:
          `dependencies.${dependency.id}.targetNodeId`,
        message:
          `Dependency target node was not found: ${dependency.targetNodeId}.`,
      });
    }
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}

export function summarizeFactoryBlueprint(
  blueprint:
    FactoryBlueprint,
): FactoryBlueprintSummary {
  let directories = 0;
  let files = 0;
  let createOperations = 0;
  let updateOperations = 0;
  let deleteOperations = 0;

  for (
    const node of
    blueprint.nodes
  ) {
    if (
      node.type ===
      "directory"
    ) {
      directories += 1;
    }

    if (
      node.type ===
      "file"
    ) {
      files += 1;

      switch (
        node.file?.operation
      ) {
        case "create":
          createOperations += 1;
          break;

        case "update":
          updateOperations += 1;
          break;

        case "delete":
          deleteOperations += 1;
          break;
      }
    }
  }

  return {
    nodes:
      blueprint.nodes.length,
    directories,
    files,
    createOperations,
    updateOperations,
    deleteOperations,
    dependencies:
      blueprint.dependencies.length,
  };
}

export function getFactoryBlueprintFiles(
  blueprint:
    FactoryBlueprint,
): readonly FactoryBlueprintNode[] {
  return blueprint.nodes.filter(
    (node) =>
      node.type ===
      "file",
  );
}

export function getFactoryBlueprintExecutionOrder(
  blueprint:
    FactoryBlueprint,
): readonly FactoryBlueprintNode[] {
  return [
    ...blueprint.nodes,
  ].sort(
    (left, right) =>
      left.order -
      right.order,
  );
}
