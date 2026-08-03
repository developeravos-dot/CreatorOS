import type {
  ProjectInventory,
} from "./project-intelligence-types";

import type {
  ProjectDependencyGraph,
  ProjectModuleDiscovery,
  ProjectPackageReference,
  ProjectSourceAnalysis,
} from "./project-source-analysis-types";

export function discoverProjectStructure(
  inventory:
    ProjectInventory,
  analysis:
    ProjectSourceAnalysis,
  graph:
    ProjectDependencyGraph,
): ProjectModuleDiscovery {
  const files =
    inventory.nodes.filter(
      (node) =>
        node.type === "file",
    );

  const packageMap =
    new Map<
      string,
      {
        files:
          Set<string>;
        imports: number;
        typeOnly: number;
        dynamic: number;
      }
    >();

  for (
    const edge of
    graph.edges
  ) {
    if (
      edge.kind !==
      "external-package"
    ) {
      continue;
    }

    const current =
      packageMap.get(
        edge.target,
      ) ?? {
        files:
          new Set<string>(),
        imports: 0,
        typeOnly: 0,
        dynamic: 0,
      };

    current.files.add(
      edge.sourcePath,
    );

    current.imports += 1;

    if (edge.typeOnly) {
      current.typeOnly += 1;
    }

    packageMap.set(
      edge.target,
      current,
    );
  }

  for (
    const edge of
    graph.edges
  ) {
    if (
      edge.kind ===
      "dynamic-import"
    ) {
      const packageName =
        edge.target;

      const current =
        packageMap.get(
          packageName,
        );

      if (current) {
        current.dynamic += 1;
      }
    }
  }

  const packages:
    ProjectPackageReference[] =
    [
      ...packageMap.entries(),
    ]
      .map(
        (
          [
            name,
            value,
          ],
        ) => ({
          name,
          files: [
            ...value.files,
          ].sort(),
          importCount:
            value.imports,
          typeOnlyCount:
            value.typeOnly,
          dynamicCount:
            value.dynamic,
        }),
      )
      .sort(
        (left, right) =>
          right.importCount -
            left.importCount ||
          left.name.localeCompare(
            right.name,
          ),
      );

  return {
    indexModules:
      analysis.files
        .filter(
          (file) =>
            file.isIndexModule,
        )
        .map(
          (file) =>
            file.path,
        ),
    testModules:
      files
        .filter(
          (file) =>
            file.role ===
            "test",
        )
        .map(
          (file) =>
            file.path,
        ),
    sourceModules:
      files
        .filter(
          (file) =>
            file.role ===
            "source",
        )
        .map(
          (file) =>
            file.path,
        ),
    styleModules:
      files
        .filter(
          (file) =>
            file.role ===
            "style",
        )
        .map(
          (file) =>
            file.path,
        ),
    configurationModules:
      files
        .filter(
          (file) =>
            file.role ===
            "configuration",
        )
        .map(
          (file) =>
            file.path,
        ),
    packages,
  };
}
