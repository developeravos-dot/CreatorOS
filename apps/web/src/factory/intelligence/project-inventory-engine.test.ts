import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildProjectInventory,
  findProjectInventoryNode,
  queryProjectInventory,
  summarizeProjectInventory,
  validateProjectInventory,
} from ".";

describe(
  "project inventory engine",
  () => {
    it(
      "builds files and implicit directories",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              "C:\\CreatorOS\\",
            capturedAt:
              "2026-08-03T12:00:00+04:00",
            files: [
              {
                path:
                  "apps\\web\\src\\App.tsx",
                content:
                  "export default function App() {}",
              },
              {
                path:
                  "apps/web/src/App.test.tsx",
                content:
                  "it('works', () => {})",
              },
            ],
          });

        expect(
          inventory.repositoryRoot,
        ).toBe(
          "C:/CreatorOS",
        );

        expect(
          inventory.capturedAt,
        ).toBe(
          "2026-08-03T08:00:00.000Z",
        );

        expect(
          inventory.nodes.map(
            (node) =>
              node.path,
          ),
        ).toContain(
          "apps/web/src",
        );

        expect(
          findProjectInventoryNode(
            inventory,
            "apps/web/src/App.tsx",
          ),
        ).toEqual(
          expect.objectContaining({
            type: "file",
            language: "tsx",
            role: "source",
          }),
        );
      },
    );

    it(
      "detects tests configuration styles and generated files",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/unit.spec.ts",
                content: "",
              },
              {
                path:
                  "src/styles.css",
                content: "",
              },
              {
                path:
                  "tsconfig.json",
                content: "{}",
              },
              {
                path:
                  "dist/index.js",
                content: "",
              },
            ],
          });

        expect(
          queryProjectInventory(
            inventory,
            {
              role: "test",
            },
          ),
        ).toHaveLength(1);

        expect(
          queryProjectInventory(
            inventory,
            {
              role: "style",
            },
          ),
        ).toHaveLength(1);

        expect(
          queryProjectInventory(
            inventory,
            {
              role:
                "configuration",
            },
          ),
        ).toHaveLength(1);

        expect(
          queryProjectInventory(
            inventory,
            {
              role:
                "generated",
            },
          ),
        ).toHaveLength(1);
      },
    );

    it(
      "supports combined inventory queries",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "apps/web/src/factory/domain.ts",
                content: "",
              },
              {
                path:
                  "apps/api/src/factory/domain.ts",
                content: "",
              },
              {
                path:
                  "apps/web/src/factory/domain.test.ts",
                content: "",
              },
            ],
          });

        const results =
          queryProjectInventory(
            inventory,
            {
              pathPrefix:
                "apps/web/src/factory",
              language:
                "typescript",
              role:
                "source",
              search:
                "domain",
            },
          );

        expect(
          results.map(
            (node) =>
              node.path,
          ),
        ).toEqual([
          "apps/web/src/factory/domain.ts",
        ]);
      },
    );

    it(
      "summarizes inventory statistics",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/index.ts",
                sizeBytes: 100,
              },
              {
                path:
                  "src/index.test.ts",
                sizeBytes: 50,
              },
              {
                path:
                  "src/styles.css",
                sizeBytes: 25,
              },
            ],
          });

        expect(
          summarizeProjectInventory(
            inventory,
          ),
        ).toEqual({
          nodes: 4,
          files: 3,
          directories: 1,
          sourceFiles: 1,
          testFiles: 1,
          configurationFiles: 0,
          generatedFiles: 0,
          totalBytes: 175,
          maximumDepth: 1,
          languages: {
            typescript: 2,
            css: 1,
          },
        });
      },
    );

    it(
      "validates a generated inventory",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "apps/web/src/index.ts",
                content: "",
              },
            ],
          });

        expect(
          validateProjectInventory(
            inventory,
          ),
        ).toEqual({
          valid: true,
          issues: [],
        });
      },
    );

    it(
      "rejects an empty repository root",
      () => {
        expect(
          () =>
            buildProjectInventory({
              repositoryRoot:
                " ",
              files: [],
            }),
        ).toThrow(
          "Project repository root is required.",
        );
      },
    );

    it(
      "computes byte size from content",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/content.ts",
                content:
                  "hello",
              },
            ],
          });

        expect(
          findProjectInventoryNode(
            inventory,
            "src/content.ts",
          )?.sizeBytes,
        ).toBe(5);
      },
    );
  },
);
