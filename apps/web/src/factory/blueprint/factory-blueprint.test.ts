import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createFactoryPackId,
} from "../domain";

import {
  addFactoryBlueprintDependency,
  addFactoryBlueprintNode,
  createFactoryBlueprint,
  createFactoryBlueprintNodeId,
  getFactoryBlueprintExecutionOrder,
  getFactoryBlueprintFiles,
  summarizeFactoryBlueprint,
  transitionFactoryBlueprint,
  validateFactoryBlueprint,
} from ".";

function createFileSpecification(
  path: string,
  operation:
    | "create"
    | "update"
    | "delete" =
      "create",
) {
  return {
    operation,
    kind:
      "typescript" as const,
    location: {
      path,
      parentPath:
        "apps/web/src/factory",
      absolute: false,
    },
    templateId: null,
    encoding:
      "utf8-no-bom" as const,
    overwrite: false,
    required: true,
    expectedExports: [],
  };
}

describe(
  "factory blueprint models",
  () => {
    it(
      "creates a blueprint with a root node",
      () => {
        const blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Foundation Blueprint",
            createdAt:
              "2026-08-03T12:00:00+04:00",
          });

        expect(
          blueprint.status,
        ).toBe("draft");

        expect(
          blueprint.nodes,
        ).toHaveLength(1);

        expect(
          blueprint.nodes[0]
            ?.type,
        ).toBe("root");

        expect(
          blueprint.createdAt,
        ).toBe(
          "2026-08-03T08:00:00.000Z",
        );
      },
    );

    it(
      "adds directory and file nodes",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "factory-directory",
              type:
                "directory",
              name:
                "Factory",
              order: 1,
            },
          );

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "domain-file",
              type:
                "file",
              name:
                "Domain File",
              order: 2,
              parentId:
                createFactoryBlueprintNodeId(
                  "factory-directory",
                ),
              file:
                createFileSpecification(
                  "apps\\web\\src\\factory\\domain.ts",
                ),
            },
          );

        expect(
          getFactoryBlueprintFiles(
            blueprint,
          ),
        ).toHaveLength(1);

        expect(
          getFactoryBlueprintFiles(
            blueprint,
          )[0]?.file
            ?.location.path,
        ).toBe(
          "apps/web/src/factory/domain.ts",
        );

        expect(
          blueprint.nodes.find(
            (node) =>
              node.id ===
              "factory-directory",
          )?.children,
        ).toEqual([
          "domain-file",
        ]);
      },
    );

    it(
      "rejects file nodes without specifications",
      () => {
        const blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        expect(
          () =>
            addFactoryBlueprintNode(
              blueprint,
              {
                id:
                  "invalid-file",
                type:
                  "file",
                name:
                  "Invalid File",
                order: 1,
              },
            ),
        ).toThrow(
          "File blueprint nodes require a file specification.",
        );
      },
    );

    it(
      "rejects duplicate node identifiers",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "factory-directory",
              type:
                "directory",
              name:
                "Factory",
              order: 1,
            },
          );

        expect(
          () =>
            addFactoryBlueprintNode(
              blueprint,
              {
                id:
                  "factory-directory",
                type:
                  "directory",
                name:
                  "Duplicate",
                order: 2,
              },
            ),
        ).toThrow(
          "Factory blueprint node already exists: factory-directory.",
        );
      },
    );

    it(
      "adds dependencies between nodes",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id: "types",
              type: "file",
              name: "Types",
              order: 1,
              file:
                createFileSpecification(
                  "src/types.ts",
                ),
            },
          );

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id: "domain",
              type: "file",
              name: "Domain",
              order: 2,
              file:
                createFileSpecification(
                  "src/domain.ts",
                ),
            },
          );

        blueprint =
          addFactoryBlueprintDependency(
            blueprint,
            {
              id:
                "domain-imports-types",
              sourceNodeId:
                createFactoryBlueprintNodeId(
                  "domain",
                ),
              targetNodeId:
                createFactoryBlueprintNodeId(
                  "types",
                ),
              type:
                "imports",
            },
          );

        expect(
          blueprint.dependencies,
        ).toHaveLength(1);

        expect(
          blueprint.dependencies[0]
            ?.type,
        ).toBe("imports");
      },
    );

    it(
      "validates a complete blueprint",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "factory-file",
              type:
                "file",
              name:
                "Factory File",
              order: 1,
              file:
                createFileSpecification(
                  "src/factory.ts",
                ),
            },
          );

        expect(
          validateFactoryBlueprint(
            blueprint,
          ),
        ).toEqual({
          valid: true,
          issues: [],
        });
      },
    );

    it(
      "detects duplicate output paths",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "first-file",
              type:
                "file",
              name:
                "First",
              order: 1,
              file:
                createFileSpecification(
                  "src/shared.ts",
                ),
            },
          );

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "second-file",
              type:
                "file",
              name:
                "Second",
              order: 2,
              file:
                createFileSpecification(
                  "src/shared.ts",
                ),
            },
          );

        expect(
          validateFactoryBlueprint(
            blueprint,
          ).issues,
        ).toContainEqual(
          expect.objectContaining({
            code:
              "DUPLICATE_PATH",
          }),
        );
      },
    );

    it(
      "summarizes blueprint operations",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "factory-directory",
              type:
                "directory",
              name:
                "Factory",
              order: 1,
            },
          );

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "create-file",
              type:
                "file",
              name:
                "Create",
              order: 2,
              file:
                createFileSpecification(
                  "src/create.ts",
                  "create",
                ),
            },
          );

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "update-file",
              type:
                "file",
              name:
                "Update",
              order: 3,
              file:
                createFileSpecification(
                  "src/update.ts",
                  "update",
                ),
            },
          );

        expect(
          summarizeFactoryBlueprint(
            blueprint,
          ),
        ).toEqual({
          nodes: 4,
          directories: 1,
          files: 2,
          createOperations: 1,
          updateOperations: 1,
          deleteOperations: 0,
          dependencies: 0,
        });
      },
    );

    it(
      "returns nodes in execution order",
      () => {
        let blueprint =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "late",
              type:
                "directory",
              name:
                "Late",
              order: 20,
            },
          );

        blueprint =
          addFactoryBlueprintNode(
            blueprint,
            {
              id:
                "early",
              type:
                "directory",
              name:
                "Early",
              order: 10,
            },
          );

        expect(
          getFactoryBlueprintExecutionOrder(
            blueprint,
          ).map(
            (node) =>
              node.id,
          ),
        ).toEqual([
          "factory-f0-blueprint:root",
          "early",
          "late",
        ]);
      },
    );

    it(
      "enforces blueprint status transitions",
      () => {
        const draft =
          createFactoryBlueprint({
            id:
              "factory-f0-blueprint",
            packId:
              createFactoryPackId(
                "factory-f0",
              ),
            name:
              "Factory Blueprint",
          });

        const validated =
          transitionFactoryBlueprint(
            draft,
            "validated",
          );

        const planned =
          transitionFactoryBlueprint(
            validated,
            "planned",
          );

        expect(planned.status)
          .toBe("planned");

        expect(
          () =>
            transitionFactoryBlueprint(
              draft,
              "applied",
            ),
        ).toThrow(
          "Cannot transition Factory blueprint from draft to applied.",
        );
      },
    );
  },
);
