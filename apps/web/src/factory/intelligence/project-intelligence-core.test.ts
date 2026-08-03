import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildProjectInventory,
} from "./project-inventory-engine";

import {
  analyzeProjectSources,
  analyzeTypeScriptSourceFile,
} from "./typescript-source-analyzer";

import {
  buildProjectDependencyGraph,
  getProjectDependencyImpact,
} from "./project-dependency-graph";

import {
  discoverProjectStructure,
} from "./project-structure-discovery";

import {
  createProjectIntelligenceReport,
} from "./project-intelligence-report";

describe(
  "F1A project intelligence core",
  () => {
    it(
      "analyzes static imports and exports",
      () => {
        const inventoryPaths =
          new Set([
            "src/a.ts",
            "src/b.ts",
          ]);

        const analysis =
          analyzeTypeScriptSourceFile(
            "src/a.ts",
            `
              import type {
                Model,
              } from "./b";

              import DefaultValue, {
                helper as localHelper,
              } from "library";

              export const value = 1;
              export type Result = Model;
              export default function run() {}
            `,
            inventoryPaths,
          );

        expect(
          analysis.imports,
        ).toHaveLength(2);

        expect(
          analysis.imports[0],
        ).toEqual(
          expect.objectContaining({
            source: "./b",
            resolvedPath:
              "src/b.ts",
            external: false,
            typeOnly: true,
          }),
        );

        expect(
          analysis.imports[1]
            ?.symbols,
        ).toEqual([
          {
            imported:
              "default",
            local:
              "DefaultValue",
            kind:
              "default",
          },
          {
            imported:
              "helper",
            local:
              "localHelper",
            kind:
              "named",
          },
        ]);

        expect(
          analysis.hasDefaultExport,
        ).toBe(true);

        expect(
          analysis.exports.map(
            (item) =>
              item.name,
          ),
        ).toContain("value");
      },
    );

    it(
      "analyzes dynamic imports and re-exports",
      () => {
        const analysis =
          analyzeTypeScriptSourceFile(
            "src/index.ts",
            `
              export * from "./domain";
              export {
                Engine,
              } from "./engine";

              const module =
                import("./runtime");
            `,
            new Set([
              "src/domain.ts",
              "src/engine.ts",
              "src/runtime.ts",
              "src/index.ts",
            ]),
          );

        expect(
          analysis.isIndexModule,
        ).toBe(true);

        expect(
          analysis.imports.some(
            (item) =>
              item.dynamic &&
              item.resolvedPath ===
                "src/runtime.ts",
          ),
        ).toBe(true);

        expect(
          analysis.exports.map(
            (item) =>
              item.kind,
          ),
        ).toContain(
          "wildcard",
        );
      },
    );

    it(
      "builds a dependency graph",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/a.ts",
              },
              {
                path:
                  "src/b.ts",
              },
              {
                path:
                  "src/c.ts",
              },
            ],
          });

        const contents = {
          "src/a.ts":
            'import { b } from "./b"; import React from "react";',
          "src/b.ts":
            'import { c } from "./c"; export const b = c;',
          "src/c.ts":
            "export const c = 1;",
        };

        const analysis =
          analyzeProjectSources(
            inventory,
            contents,
          );

        const graph =
          buildProjectDependencyGraph(
            analysis,
          );

        expect(
          graph.edges.filter(
            (edge) =>
              edge.kind ===
              "internal-import",
          ),
        ).toHaveLength(2);

        expect(
          graph.edges.filter(
            (edge) =>
              edge.kind ===
              "external-package",
          ),
        ).toHaveLength(1);

        expect(
          graph.nodes.find(
            (node) =>
              node.path ===
              "src/c.ts",
          )?.incoming,
        ).toBe(1);
      },
    );

    it(
      "detects circular dependencies",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/a.ts",
              },
              {
                path:
                  "src/b.ts",
              },
              {
                path:
                  "src/c.ts",
              },
            ],
          });

        const analysis =
          analyzeProjectSources(
            inventory,
            {
              "src/a.ts":
                'import "./b";',
              "src/b.ts":
                'import "./c";',
              "src/c.ts":
                'import "./a";',
            },
          );

        const graph =
          buildProjectDependencyGraph(
            analysis,
          );

        expect(graph.cycles)
          .toHaveLength(1);

        expect(
          graph.cycles[0]
            ?.paths,
        ).toContain(
          "src/a.ts",
        );
      },
    );

    it(
      "calculates reverse dependency impact",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/a.ts",
              },
              {
                path:
                  "src/b.ts",
              },
              {
                path:
                  "src/c.ts",
              },
            ],
          });

        const graph =
          buildProjectDependencyGraph(
            analyzeProjectSources(
              inventory,
              {
                "src/a.ts":
                  'import "./b";',
                "src/b.ts":
                  'import "./c";',
                "src/c.ts":
                  "export const c = 1;",
              },
            ),
          );

        expect(
          getProjectDependencyImpact(
            graph,
            [
              "src/c.ts",
            ],
          ),
        ).toEqual([
          "src/a.ts",
          "src/b.ts",
          "src/c.ts",
        ]);
      },
    );

    it(
      "discovers modules and packages",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/index.ts",
              },
              {
                path:
                  "src/App.tsx",
              },
              {
                path:
                  "src/App.test.tsx",
              },
              {
                path:
                  "src/styles.css",
              },
              {
                path:
                  "tsconfig.json",
              },
            ],
          });

        const analysis =
          analyzeProjectSources(
            inventory,
            {
              "src/index.ts":
                'export * from "./App";',
              "src/App.tsx":
                'import React from "react"; export function App() {}',
              "src/App.test.tsx":
                'import { describe } from "vitest";',
            },
          );

        const graph =
          buildProjectDependencyGraph(
            analysis,
          );

        const discovery =
          discoverProjectStructure(
            inventory,
            analysis,
            graph,
          );

        expect(
          discovery.indexModules,
        ).toEqual([
          "src/index.ts",
        ]);

        expect(
          discovery.testModules,
        ).toEqual([
          "src/App.test.tsx",
        ]);

        expect(
          discovery.packages.map(
            (item) =>
              item.name,
          ),
        ).toEqual([
          "react",
          "vitest",
        ]);
      },
    );

    it(
      "creates an integrated intelligence report",
      () => {
        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files: [
              {
                path:
                  "src/index.ts",
              },
              {
                path:
                  "src/domain.ts",
              },
            ],
          });

        const report =
          createProjectIntelligenceReport({
            inventory,
            contents: {
              "src/index.ts":
                'export * from "./domain";',
              "src/domain.ts":
                "export interface Domain {}",
            },
            now:
              () =>
                "2026-08-03T08:00:00.000Z",
          });

        expect(
          report.summary,
        ).toEqual({
          files: 2,
          analyzedFiles: 2,
          imports: 0,
          exports: 2,
          internalDependencies: 0,
          externalDependencies: 0,
          circularDependencies: 0,
          indexModules: 1,
          packages: 0,
        });

        expect(
          report.analysis
            .analyzedAt,
        ).toBe(
          "2026-08-03T08:00:00.000Z",
        );
      },
    );
  },
);
