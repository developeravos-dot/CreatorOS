import type {
  ProjectDependencyEdge,
  ProjectDependencyNode,
} from "./project-deep-intelligence-interfaces";

import {
  DependencyGraphEngine,
} from "./dependency-graph-engine";

export interface ImportReference {

  readonly importer:
    ProjectDependencyNode;

  readonly imported:
    ProjectDependencyNode;

  readonly edge:
    ProjectDependencyEdge;

}

export interface ImportAnalysis {

  readonly totalImports:
    number;

  readonly staticImports:
    number;

  readonly dynamicImports:
    number;

  readonly reExports:
    number;

  readonly externalPackages:
    number;

  readonly internalPackages:
    number;

  readonly imports:
    readonly ImportReference[];

}

export class ImportAnalysisEngine {

  constructor(
    private readonly graph:
      DependencyGraphEngine,
  ) {}

  analyze():
    ImportAnalysis {

    const dependencyGraph =
      this.graph.build();

    const imports:
      ImportReference[] =
      [];

    let staticImports =
      0;

    let dynamicImports =
      0;

    let reExports =
      0;

    let externalPackages =
      0;

    let internalPackages =
      0;

    for (
      const edge of
      dependencyGraph.edges
    ) {

      const importer =
        dependencyGraph.nodes.find(
          node =>
            node.id ===
            edge.source,
        );

      const imported =
        dependencyGraph.nodes.find(
          node =>
            node.id ===
            edge.target,
        );

      if (
        !importer ||
        !imported
      ) {
        continue;
      }

      imports.push({
        importer,
        imported,
        edge,
      });

      switch (
        edge.kind
      ) {

        case "import":
          staticImports++;
          internalPackages++;
          break;

        case "dynamic-import":
          dynamicImports++;
          internalPackages++;
          break;

        case "re-export":
          reExports++;
          internalPackages++;
          break;

        case "external-package":
          externalPackages++;
          break;

      }

    }

    return {

      totalImports:
        imports.length,

      staticImports,

      dynamicImports,

      reExports,

      externalPackages,

      internalPackages,

      imports,

    };

  }

  staticImports() {

    return this
      .analyze()
      .imports
      .filter(
        item =>
          item.edge.kind ===
          "import",
      );

  }

  dynamicImports() {

    return this
      .analyze()
      .imports
      .filter(
        item =>
          item.edge.kind ===
          "dynamic-import",
      );

  }

  externalPackages() {

    return this
      .analyze()
      .imports
      .filter(
        item =>
          item.edge.kind ===
          "external-package",
      );

  }

}
